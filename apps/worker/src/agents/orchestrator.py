"""
Feature 12: Multi-Agent AI Orchestration
Coordinates all agents to perform complete contract analysis
"""
from typing import Any, Dict, Optional
from datetime import datetime
import uuid

from .supervisor import SupervisorAgent
from .ingestion_agent import IngestionAgent
from .clause_extractor_agent import ClauseExtractorAgent
from .risk_engine_agent import RiskEngineAgent
from .explainer_agent import ExplainerAgent

class AgentOrchestrator:
    """Orchestrates multi-agent workflow for contract analysis"""
    
    def __init__(self):
        self.supervisor = SupervisorAgent()
        self.ingestion = IngestionAgent()
        self.clause_extractor = ClauseExtractorAgent()
        self.risk_engine = RiskEngineAgent()
        self.explainer = ExplainerAgent()
    
    async def analyze_document(self, file_path: str, options: Optional[Dict] = None) -> Dict[str, Any]:
        """Run complete analysis pipeline on a document"""
        options = options or {}
        analysis_id = str(uuid.uuid4())
        
        # Step 1: Ingestion - Extract text and classify document
        ingestion_result = await self.ingestion.execute({"file_path": file_path})
        
        text = ingestion_result["cleaned_text"]
        doc_type = ingestion_result["document_type"]
        language = options.get("language") or ingestion_result["detected_language"]
        
        # Step 2: Extract all clauses
        clause_result = await self.clause_extractor.execute({
            "text": text,
            "document_type": doc_type
        })
        
        clauses = clause_result["extracted_clauses"]
        
        # Step 3: Risk analysis
        risk_result = await self.risk_engine.execute({
            "text": text,
            "extracted_clauses": clauses,
            "document_type": doc_type
        })
        
        # Step 4: Generate summary
        summary_result = await self.explainer.execute({
            "task": "summary",
            "text": text,
            "extracted_clauses": clauses,
            "document_type": doc_type,
            "language": language
        })
        
        # Compile final analysis
        analysis = {
            "id": analysis_id,
            "documentType": doc_type,
            "detectedLanguage": ingestion_result["detected_language"],
            "analyzedAt": datetime.utcnow().isoformat(),
            "wordCount": ingestion_result["word_count"],
            "summary": summary_result,
            "riskScore": risk_result["risk_score"],
            "extractedClauses": clauses,
            "missingClauses": risk_result["missing_clauses"],
            "redFlags": risk_result["red_flags"],
            "jurisdictionInfo": risk_result["jurisdiction_info"],
            "rawText": text
        }
        
        return analysis
    
    async def chat(self, document_id: str, question: str, text: str, clauses: Dict, history: list, language: str = "en") -> Dict[str, Any]:
        """Handle chat questions about a document"""
        return await self.explainer.execute({
            "task": "chat",
            "question": question,
            "text": text,
            "extracted_clauses": clauses,
            "history": history,
            "language": language
        })
    
    async def fix_clause(self, clause_text: str, issue: str, context: str = "") -> Dict[str, Any]:
        """Fix a problematic clause"""
        return await self.explainer.execute({
            "task": "fix_clause",
            "clause_text": clause_text,
            "issue": issue,
            "context": context
        })
    
    async def generate_report(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate report data for PDF generation"""
        return await self.explainer.execute({
            "task": "report",
            "analysis": analysis,
            "timestamp": datetime.utcnow().isoformat()
        })

# Singleton instance
orchestrator = AgentOrchestrator()
