"""FastAPI application for the AI Worker Service"""
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import uuid
import aiofiles
from datetime import datetime

from ..config import settings
from ..agents.orchestrator import orchestrator
from ..reports.pdf_generator import generate_pdf_report, generate_corrected_contract_pdf
from .. import db

app = FastAPI(
    title="DocIntel AI Worker",
    description="AI-powered contract analysis service",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache (backed by SQLite database)
documents_cache: Dict[str, Dict] = {}
analyses_cache: Dict[str, Dict] = {}

# Pydantic models
class ChatRequest(BaseModel):
    document_id: str
    message: str
    language: Optional[str] = "en"
    history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    answer: str
    citations: List[str]
    related_clauses: List[str]
    follow_up_questions: List[str]

class FixClauseRequest(BaseModel):
    clause_text: str
    issue: str
    context: Optional[str] = ""

class FixClauseResponse(BaseModel):
    original_clause: str
    fixed_clause: str
    explanation: str
    negotiation_wording: str

class AnalysisResponse(BaseModel):
    id: str
    document_type: str
    detected_language: str
    analyzed_at: str
    summary: Dict[str, Any]
    risk_score: Dict[str, Any]
    extracted_clauses: Dict[str, Any]
    missing_clauses: List[Dict[str, Any]]
    red_flags: List[Dict[str, Any]]
    jurisdiction_info: Dict[str, Any]

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "docintel-worker"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload a document for analysis"""
    # Validate file type
    allowed_types = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png", "image/jpeg", "image/jpg", "image/webp", "image/tiff",
        "text/plain"
    ]
    
    if file.content_type not in allowed_types:
        raise HTTPException(400, f"Unsupported file type: {file.content_type}")
    
    # Generate unique ID and save file
    doc_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    file_path = os.path.join(settings.UPLOAD_DIR, f"{doc_id}{ext}")
    
    async with aiofiles.open(file_path, "wb") as f:
        content = await file.read()
        if len(content) > settings.MAX_FILE_SIZE:
            raise HTTPException(400, "File too large")
        await f.write(content)
    
    # Store document info in database
    doc_data = {
        "id": doc_id,
        "fileName": file.filename,
        "filePath": file_path,
        "mimeType": file.content_type,
        "fileSize": len(content),
        "uploadedAt": datetime.utcnow().isoformat(),
        "status": "uploaded"
    }
    db.save_document(doc_data)
    documents_cache[doc_id] = doc_data
    
    return {"id": doc_id, "fileName": file.filename, "status": "uploaded"}

@app.post("/analyze/{document_id}")
async def analyze_document(document_id: str, language: Optional[str] = None):
    """Run full AI analysis on a document"""
    # Check cache first, then database
    doc = documents_cache.get(document_id) or db.get_document(document_id)
    if not doc:
        raise HTTPException(404, "Document not found")
    
    db.update_document_status(document_id, "processing")
    
    try:
        # Run the multi-agent analysis
        analysis = await orchestrator.analyze_document(
            doc["filePath"],
            {"language": language}
        )
        
        # Add document ID to analysis
        analysis["documentId"] = document_id
        
        # Store analysis in database
        db.save_analysis(analysis)
        analyses_cache[document_id] = analysis
        
        # Update document status and store raw text
        raw_text = analysis.get("rawText", "")
        db.update_document_status(document_id, "analyzed", raw_text)
        
        return {
            "id": analysis["id"],
            "documentId": document_id,
            "documentType": analysis["documentType"],
            "detectedLanguage": analysis["detectedLanguage"],
            "analyzedAt": analysis["analyzedAt"],
            "summary": analysis["summary"],
            "riskScore": analysis["riskScore"],
            "extractedClauses": analysis["extractedClauses"],
            "missingClauses": analysis["missingClauses"],
            "redFlags": analysis["redFlags"],
            "jurisdictionInfo": analysis["jurisdictionInfo"]
        }
    except Exception as e:
        db.update_document_status(document_id, "failed")
        raise HTTPException(500, f"Analysis failed: {str(e)}")

@app.get("/analysis/{document_id}")
async def get_analysis_endpoint(document_id: str):
    """Get analysis results for a document"""
    # Check cache first, then database
    analysis = analyses_cache.get(document_id) or db.get_analysis(document_id)
    if not analysis:
        raise HTTPException(404, "Analysis not found")
    
    # Cache it for future requests
    analyses_cache[document_id] = analysis
    return analysis

@app.post("/chat", response_model=ChatResponse)
async def chat_with_document(request: ChatRequest):
    """Chat with a document - ask questions about the contract"""
    # Check cache first, then database
    analysis = analyses_cache.get(request.document_id) or db.get_analysis_with_raw_text(request.document_id)
    if not analysis:
        raise HTTPException(404, "Document analysis not found. Please analyze the document first.")
    
    analyses_cache[request.document_id] = analysis
    
    result = await orchestrator.chat(
        document_id=request.document_id,
        question=request.message,
        text=analysis.get("rawText", ""),
        clauses=analysis.get("extractedClauses", {}),
        history=request.history or [],
        language=request.language or "en"
    )
    
    return ChatResponse(
        answer=result.get("answer", ""),
        citations=result.get("citations", []),
        related_clauses=result.get("relatedClauses", []),
        follow_up_questions=result.get("followUpQuestions", [])
    )

@app.post("/fix-clause", response_model=FixClauseResponse)
async def fix_clause(request: FixClauseRequest):
    """Fix a problematic clause with AI-generated alternative"""
    result = await orchestrator.fix_clause(
        clause_text=request.clause_text,
        issue=request.issue,
        context=request.context or ""
    )
    
    return FixClauseResponse(
        original_clause=result.get("originalClause", request.clause_text),
        fixed_clause=result.get("fixedClause", ""),
        explanation=result.get("explanation", ""),
        negotiation_wording=result.get("negotiationWording", "")
    )

@app.get("/report/{document_id}")
async def generate_report(document_id: str, format: str = "pdf"):
    """Generate downloadable report for a document"""
    analysis = analyses_cache.get(document_id) or db.get_analysis(document_id)
    if not analysis:
        raise HTTPException(404, "Analysis not found")
    
    doc = documents_cache.get(document_id) or db.get_document(document_id) or {}
    
    # Generate report data
    report_data = await orchestrator.generate_report(analysis)
    report_data["fileName"] = doc.get("fileName", "document")
    
    # Generate PDF
    pdf_path = await generate_pdf_report(report_data, document_id)
    
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"contract-analysis-{document_id[:8]}.pdf"
    )

@app.get("/documents")
async def list_documents_endpoint():
    """List all uploaded documents"""
    return db.list_documents()

@app.get("/documents/{document_id}/content")
async def get_document_content(document_id: str):
    """Get the original document content as text"""
    doc = documents_cache.get(document_id) or db.get_document(document_id)
    if not doc:
        raise HTTPException(404, "Document not found")
    
    file_path = doc["filePath"]
    
    # First check if we have raw text stored in database
    if doc.get("rawText"):
        return {"content": doc["rawText"], "mimeType": doc["mimeType"], "fileName": doc["fileName"]}
    
    # For text files, read from file
    if doc["mimeType"] == "text/plain" and os.path.exists(file_path):
        async with aiofiles.open(file_path, "r", encoding="utf-8") as f:
            content = await f.read()
        return {"content": content, "mimeType": doc["mimeType"], "fileName": doc["fileName"]}
    
    # Check analysis for raw text
    analysis = analyses_cache.get(document_id) or db.get_analysis(document_id)
    if analysis and analysis.get("rawText"):
        return {"content": analysis["rawText"], "mimeType": doc["mimeType"], "fileName": doc["fileName"]}
    
    # Fallback: return file for download if exists
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=doc["fileName"])
    
    raise HTTPException(404, "Document content not available")

@app.get("/documents/{document_id}/file")
async def get_document_file(document_id: str):
    """Get the original document file for viewing/download"""
    doc = documents_cache.get(document_id) or db.get_document(document_id)
    if not doc:
        raise HTTPException(404, "Document not found")
    
    file_path = doc["filePath"]
    if not os.path.exists(file_path):
        raise HTTPException(404, "Document file not found")
    
    return FileResponse(
        file_path, 
        filename=doc["fileName"],
        media_type=doc["mimeType"]
    )

@app.post("/corrected-contract/{document_id}")
async def generate_corrected_contract(document_id: str, fixes: List[Dict[str, Any]] = []):
    """Generate a corrected contract PDF with fixes applied"""
    # Get document and analysis
    doc = documents_cache.get(document_id) or db.get_document(document_id)
    if not doc:
        raise HTTPException(404, "Document not found")
    
    analysis = analyses_cache.get(document_id) or db.get_analysis_with_raw_text(document_id)
    if not analysis:
        raise HTTPException(404, "Analysis not found")
    
    # Get original text
    original_text = doc.get("rawText") or analysis.get("rawText", "")
    if not original_text:
        raise HTTPException(400, "Original document text not available")
    
    # Use provided fixes or get from red flags
    if not fixes:
        # Generate fixes from red flags
        fixes = []
        for flag in analysis.get("redFlags", []):
            if flag.get("clauseText"):
                fix_result = await orchestrator.fix_clause(
                    clause_text=flag["clauseText"],
                    issue=flag.get("issue", ""),
                    context=analysis.get("documentType", "")
                )
                fixes.append({
                    "originalClause": flag["clauseText"],
                    "fixedClause": fix_result.get("fixedClause", ""),
                    "issue": flag.get("issue", ""),
                    "explanation": fix_result.get("explanation", "")
                })
    
    # Generate corrected PDF
    pdf_path = await generate_corrected_contract_pdf(
        original_text=original_text,
        analysis=analysis,
        fixes=fixes,
        document_id=document_id
    )
    
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"corrected-contract-{document_id[:8]}.pdf"
    )

@app.delete("/documents/{document_id}")
async def delete_document_endpoint(document_id: str):
    """Delete a document and its analysis"""
    # Get document to delete file
    doc = documents_cache.get(document_id) or db.get_document(document_id)
    if doc and os.path.exists(doc["filePath"]):
        os.remove(doc["filePath"])
    
    # Remove from database
    db.delete_document(document_id)
    
    # Remove from cache
    documents_cache.pop(document_id, None)
    analyses_cache.pop(document_id, None)
    
    return {"status": "deleted"}
