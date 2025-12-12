"""
Feature 4: Clause Extractor Agent - Extracts 30+ key fields from contracts
"""
from typing import Any, Dict
from .base_agent import BaseAgent

class ClauseExtractorAgent(BaseAgent):
    """Agent for extracting specific clauses from contracts"""
    
    def __init__(self):
        super().__init__(
            name="clause_extractor",
            description="Extracts all key clauses and terms from contracts"
        )
    
    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract all clauses from the contract text"""
        text = input_data.get("text", "")
        doc_type = input_data.get("document_type", "unknown")
        
        prompt = f"""You are a legal document analyzer. Extract ALL relevant clauses from this {doc_type} contract.

CONTRACT TEXT:
{text}

Extract and return a JSON object with these fields (use null if not found):
{{
    "paymentTerms": "payment terms description",
    "paymentAmount": "total amount or rate",
    "paymentSchedule": "when payments are due",
    "milestones": ["milestone1", "milestone2"],
    "dueDates": ["date1", "date2"],
    "terminationNoticePeriod": "notice period required",
    "terminationConditions": "conditions for termination",
    "liabilityLimitations": "liability limitations",
    "liabilityCap": "maximum liability amount",
    "ipOwnership": "who owns intellectual property",
    "workOwnership": "who owns the work product",
    "confidentialityRequirements": "confidentiality terms",
    "confidentialityDuration": "how long confidentiality lasts",
    "revisionCount": "number of revisions allowed",
    "revisionTerms": "terms for revisions",
    "governingLaw": "which law governs",
    "jurisdiction": "court jurisdiction",
    "nonCompete": "non-compete clause details",
    "nonCompeteDuration": "non-compete duration",
    "nonSolicit": "non-solicitation terms",
    "disputeResolution": "how disputes are resolved",
    "arbitrationClause": "arbitration requirements",
    "deliverables": ["deliverable1", "deliverable2"],
    "scopeOfWork": "scope description",
    "refundRules": "refund policy",
    "deadlines": ["deadline1", "deadline2"],
    "renewalTerms": "renewal conditions",
    "autoRenewal": true/false,
    "contractDuration": "contract length",
    "startDate": "start date",
    "endDate": "end date",
    "killFee": "cancellation fee",
    "latePaymentPenalty": "late payment terms",
    "indemnification": "indemnification clause",
    "forceMajeure": "force majeure clause",
    "assignmentRights": "assignment/transfer rights",
    "amendmentProcess": "how to amend contract",
    "noticeRequirements": "notice requirements",
    "warrantyTerms": "warranty terms",
    "insuranceRequirements": "insurance requirements"
}}

Be thorough and extract exact quotes where possible. Return ONLY valid JSON."""
        
        clauses = await self.generate_json(prompt, temperature=0.2)
        return {"extracted_clauses": clauses}
