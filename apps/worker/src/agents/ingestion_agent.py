"""
Feature 1 & 11: Ingestion Agent - Document processing and classification
Handles OCR, text extraction, language detection, document type classification
"""
from typing import Any, Dict, Tuple
from .base_agent import BaseAgent
from ..ocr.document_ingestion import document_ingestion

class IngestionAgent(BaseAgent):
    """Agent for document ingestion and preprocessing"""
    
    DOCUMENT_TYPES = [
        "nda", "employment", "service_agreement", "vendor_contract",
        "lease", "saas_agreement", "partnership_agreement", "loan_agreement",
        "freelance_contract", "unknown"
    ]
    
    def __init__(self):
        super().__init__(
            name="ingestion",
            description="Extracts text from documents and classifies document type"
        )
    
    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process document and extract structured text"""
        file_path = input_data.get("file_path", "")
        
        # Extract text using OCR/document parser
        raw_text, detected_language = await document_ingestion.extract_text(file_path)
        
        # Clean the text
        cleaned_text = document_ingestion.clean_text(raw_text)
        
        # Classify document type
        doc_type = await self._classify_document(cleaned_text)
        
        return {
            "raw_text": raw_text,
            "cleaned_text": cleaned_text,
            "detected_language": detected_language,
            "document_type": doc_type,
            "word_count": len(cleaned_text.split()),
            "char_count": len(cleaned_text)
        }
    
    async def _classify_document(self, text: str) -> str:
        """Feature 11: Auto-classify document type"""
        # Take first 3000 chars for classification
        sample = text[:3000] if len(text) > 3000 else text
        
        prompt = f"""Classify this legal document into one of these categories:
- nda (Non-Disclosure Agreement)
- employment (Employment Contract)
- service_agreement (Service/Consulting Agreement)
- vendor_contract (Vendor/Supplier Contract)
- lease (Lease/Rental Agreement)
- saas_agreement (SaaS/Software License)
- partnership_agreement (Partnership Agreement)
- loan_agreement (Loan/Credit Agreement)
- freelance_contract (Freelance/Independent Contractor)
- unknown (Cannot determine)

Document excerpt:
{sample}

Respond with JSON: {{"document_type": "type_name", "confidence": 0.0-1.0, "indicators": ["reason1", "reason2"]}}"""
        
        result = await self.generate_json(prompt, temperature=0.2)
        return result.get("document_type", "unknown")
