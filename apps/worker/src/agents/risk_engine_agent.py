"""
Features 3, 5, 6, 10: Risk Engine Agent
- Traffic-Light Risk Score (0-100)
- Missing Clause Detection
- Red Flag Detection
- Jurisdiction & Law Checker
"""
from typing import Any, Dict, List
from .base_agent import BaseAgent

class RiskEngineAgent(BaseAgent):
    """Agent for analyzing contract risks"""
    
    # Standard clauses that should be in contracts
    ESSENTIAL_CLAUSES = {
        "freelance_contract": [
            "killFee", "latePaymentPenalty", "ipOwnership", "confidentialityRequirements",
            "terminationNoticePeriod", "liabilityCap", "scopeOfWork", "revisionCount",
            "paymentSchedule", "disputeResolution"
        ],
        "service_agreement": [
            "paymentTerms", "scopeOfWork", "terminationConditions", "liabilityLimitations",
            "confidentialityRequirements", "ipOwnership", "disputeResolution", "indemnification"
        ],
        "nda": [
            "confidentialityRequirements", "confidentialityDuration", "returnOfMaterials",
            "permittedDisclosures", "terminationConditions"
        ],
        "employment": [
            "paymentTerms", "terminationNoticePeriod", "nonCompete", "confidentialityRequirements",
            "ipOwnership", "benefits", "workHours", "disputeResolution"
        ]
    }
    
    # Known red flag patterns
    RED_FLAG_PATTERNS = [
        {"pattern": "unlimited revision", "issue": "Unlimited revisions can lead to scope creep", "severity": "red"},
        {"pattern": "work for hire", "issue": "You may lose all IP rights before payment", "severity": "yellow"},
        {"pattern": "terminate at any time", "issue": "One-sided termination without notice", "severity": "red"},
        {"pattern": "full refund", "issue": "Client can demand full refund even after work delivered", "severity": "red"},
        {"pattern": "no payment until", "issue": "Payment withheld until arbitrary conditions met", "severity": "yellow"},
        {"pattern": "exclusive", "issue": "May prevent you from working with competitors", "severity": "yellow"},
        {"pattern": "perpetual", "issue": "Obligations that never expire", "severity": "yellow"},
        {"pattern": "indemnify and hold harmless", "issue": "You may be liable for client's legal issues", "severity": "yellow"},
        {"pattern": "sole discretion", "issue": "One party has unilateral decision power", "severity": "yellow"},
        {"pattern": "waive", "issue": "You may be waiving important rights", "severity": "yellow"}
    ]
    
    def __init__(self):
        super().__init__(
            name="risk_engine",
            description="Analyzes contract risks, missing clauses, and red flags"
        )
    
    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze all risks in the contract"""
        text = input_data.get("text", "")
        clauses = input_data.get("extracted_clauses", {})
        doc_type = input_data.get("document_type", "unknown")
        
        # Run all risk analyses
        risk_score = await self._calculate_risk_score(text, clauses, doc_type)
        missing_clauses = await self._detect_missing_clauses(clauses, doc_type)
        red_flags = await self._detect_red_flags(text, clauses)
        jurisdiction_info = await self._check_jurisdiction(text, clauses)
        
        return {
            "risk_score": risk_score,
            "missing_clauses": missing_clauses,
            "red_flags": red_flags,
            "jurisdiction_info": jurisdiction_info
        }
    
    async def _calculate_risk_score(self, text: str, clauses: Dict, doc_type: str) -> Dict[str, Any]:
        """Feature 3: Calculate traffic-light risk score (0-100)"""
        prompt = f"""Analyze this contract and calculate a risk score from 0-100.
0-30 = Green (Safe)
31-60 = Yellow (Caution)
61-100 = Red (Dangerous)

Consider:
- Missing protections for the service provider/freelancer
- One-sided terms favoring the client
- Vague or ambiguous language
- Unusual or harsh penalties
- Missing standard clauses

Contract type: {doc_type}
Extracted clauses: {clauses}
Contract text (first 4000 chars): {text[:4000]}

Return JSON:
{{
    "score": 0-100,
    "level": "green" or "yellow" or "red",
    "summary": "Brief explanation of the score",
    "factors": [
        {{"factor": "description", "impact": positive or negative number}}
    ]
}}"""
        
        return await self.generate_json(prompt, temperature=0.3)
    
    async def _detect_missing_clauses(self, clauses: Dict, doc_type: str) -> List[Dict]:
        """Feature 5: Detect missing clauses that should be present"""
        essential = self.ESSENTIAL_CLAUSES.get(doc_type, self.ESSENTIAL_CLAUSES["freelance_contract"])
        missing = []
        
        for clause_name in essential:
            if not clauses.get(clause_name):
                missing.append(clause_name)
        
        if not missing:
            return []
        
        prompt = f"""For a {doc_type}, these important clauses are MISSING:
{missing}

For each missing clause, provide:
1. Why it's important
2. The risk of not having it
3. Suggested text to add

Return JSON array:
[
    {{
        "clauseName": "name",
        "importance": "critical" or "important" or "recommended",
        "description": "why this matters",
        "suggestedText": "professional legal text to add"
    }}
]"""
        
        return await self.generate_json(prompt, temperature=0.4)
    
    async def _detect_red_flags(self, text: str, clauses: Dict) -> List[Dict]:
        """Feature 6: Detect dangerous clauses"""
        text_lower = text.lower()
        
        prompt = f"""Analyze this contract for RED FLAGS - dangerous clauses that could harm the freelancer/service provider.

Look for:
- Unlimited revisions
- Work ownership transferred before payment
- No kill fee / cancellation fee
- One-sided termination rights
- Client can cancel at any time without penalty
- No dispute resolution mechanism
- No payment schedule
- Full refund clause even after work delivered
- Unreasonable non-compete
- Perpetual obligations
- Unlimited liability
- Vague scope that could expand

Contract text: {text[:6000]}

Return JSON array:
[
    {{
        "id": "unique_id",
        "clauseText": "exact quote from contract",
        "issue": "what's wrong with this",
        "severity": "green" or "yellow" or "red",
        "explanation": "plain English explanation of the risk",
        "location": "section or paragraph reference if available"
    }}
]

Only include actual problems found. Return empty array if contract is clean."""
        
        return await self.generate_json(prompt, temperature=0.3)
    
    async def _check_jurisdiction(self, text: str, clauses: Dict) -> Dict[str, Any]:
        """Feature 10: Check jurisdiction and governing law"""
        governing_law = clauses.get("governingLaw", "")
        jurisdiction = clauses.get("jurisdiction", "")
        
        prompt = f"""Analyze the jurisdiction and governing law of this contract.

Governing Law clause: {governing_law}
Jurisdiction clause: {jurisdiction}
Contract excerpt: {text[:2000]}

Check:
1. Is the governing law clearly stated?
2. Is the jurisdiction reasonable?
3. Are there any conflicts between parties' locations?
4. Any outdated legal references?

Return JSON:
{{
    "governingLaw": "identified law",
    "jurisdiction": "identified jurisdiction",
    "isValid": true/false,
    "warnings": ["warning1", "warning2"],
    "recommendations": ["recommendation1"]
}}"""
        
        return await self.generate_json(prompt, temperature=0.3)
