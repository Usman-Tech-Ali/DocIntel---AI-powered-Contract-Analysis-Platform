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
from ..reports.pdf_generator import generate_pdf_report

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

# In-memory storage (replace with Redis/DB in production)
documents_store: Dict[str, Dict] = {}
analyses_store: Dict[str, Dict] = {}

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
    
    # Store document info
    documents_store[doc_id] = {
        "id": doc_id,
        "fileName": file.filename,
        "filePath": file_path,
        "mimeType": file.content_type,
        "fileSize": len(content),
        "uploadedAt": datetime.utcnow().isoformat(),
        "status": "uploaded"
    }
    
    return {"id": doc_id, "fileName": file.filename, "status": "uploaded"}

@app.post("/analyze/{document_id}")
async def analyze_document(document_id: str, language: Optional[str] = None):
    """Run full AI analysis on a document"""
    if document_id not in documents_store:
        raise HTTPException(404, "Document not found")
    
    doc = documents_store[document_id]
    doc["status"] = "processing"
    
    try:
        # Run the multi-agent analysis
        analysis = await orchestrator.analyze_document(
            doc["filePath"],
            {"language": language}
        )
        
        # Store analysis
        analyses_store[document_id] = analysis
        doc["status"] = "analyzed"
        
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
        doc["status"] = "failed"
        raise HTTPException(500, f"Analysis failed: {str(e)}")

@app.get("/analysis/{document_id}")
async def get_analysis(document_id: str):
    """Get analysis results for a document"""
    if document_id not in analyses_store:
        raise HTTPException(404, "Analysis not found")
    
    return analyses_store[document_id]

@app.post("/chat", response_model=ChatResponse)
async def chat_with_document(request: ChatRequest):
    """Chat with a document - ask questions about the contract"""
    if request.document_id not in analyses_store:
        raise HTTPException(404, "Document analysis not found. Please analyze the document first.")
    
    analysis = analyses_store[request.document_id]
    
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
    if document_id not in analyses_store:
        raise HTTPException(404, "Analysis not found")
    
    analysis = analyses_store[document_id]
    doc = documents_store.get(document_id, {})
    
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
async def list_documents():
    """List all uploaded documents"""
    return list(documents_store.values())

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document and its analysis"""
    if document_id in documents_store:
        doc = documents_store[document_id]
        if os.path.exists(doc["filePath"]):
            os.remove(doc["filePath"])
        del documents_store[document_id]
    
    if document_id in analyses_store:
        del analyses_store[document_id]
    
    return {"status": "deleted"}
