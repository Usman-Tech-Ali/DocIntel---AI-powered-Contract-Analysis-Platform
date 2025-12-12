"""Gemini API Client for DocIntel"""
import httpx
import json
import asyncio
from typing import Optional, List, Dict, Any
from ..config import settings

# Mock responses for testing when API quota is exhausted
MOCK_RESPONSES = {
    "document_type": {"document_type": "freelance_contract", "confidence": 0.95, "indicators": ["service agreement", "contractor", "payment terms"]},
    "clauses": {
        "paymentTerms": "50% upfront, 50% on completion",
        "paymentAmount": "$5,000 USD",
        "paymentSchedule": "50% upon signing, 50% upon completion",
        "terminationNoticePeriod": "7 days written notice",
        "terminationConditions": "Either party may terminate at any time",
        "liabilityLimitations": "Unlimited liability",
        "ipOwnership": "Client owns all work upon full payment",
        "confidentialityRequirements": "2 years confidentiality period",
        "revisionCount": "Unlimited revisions",
        "governingLaw": "State of California",
        "jurisdiction": "Los Angeles, California",
        "disputeResolution": "Binding arbitration",
        "scopeOfWork": "Web development services including design, payment integration, mobile responsive design",
        "deliverables": ["Company website", "Payment system integration", "Mobile responsive design"]
    },
    "risk_score": {
        "score": 75,
        "level": "red",
        "summary": "High risk contract with several concerning clauses including unlimited revisions, unlimited liability, and one-sided termination rights.",
        "factors": [
            {"factor": "Unlimited revisions clause", "impact": 20},
            {"factor": "Unlimited liability", "impact": 25},
            {"factor": "One-sided termination", "impact": 15},
            {"factor": "No kill fee", "impact": 15}
        ]
    },
    "missing_clauses": [
        {"clauseName": "killFee", "importance": "critical", "description": "No cancellation fee if client terminates early", "suggestedText": "If Client terminates this Agreement before completion, Client shall pay Contractor a kill fee equal to 25% of the remaining contract value."},
        {"clauseName": "latePaymentPenalty", "importance": "important", "description": "No penalty for late payments", "suggestedText": "Late payments shall incur a penalty of 1.5% per month on the outstanding balance."},
        {"clauseName": "liabilityCap", "importance": "critical", "description": "Liability is unlimited which is very risky", "suggestedText": "Contractor's total liability shall not exceed the total fees paid under this Agreement."}
    ],
    "red_flags": [
        {"id": "rf1", "clauseText": "The Contractor will provide unlimited revisions until the Client is satisfied", "issue": "Unlimited revisions can lead to scope creep and unpaid work", "severity": "red", "explanation": "This clause allows the client to request endless changes without additional compensation, potentially turning a fixed-price project into unlimited work.", "location": "Section 3"},
        {"id": "rf2", "clauseText": "The Client may terminate at any time without penalty", "issue": "One-sided termination without compensation", "severity": "red", "explanation": "The client can cancel the project at any point without paying for work already completed or providing compensation.", "location": "Section 5"},
        {"id": "rf3", "clauseText": "The Contractor's liability shall be unlimited", "issue": "Unlimited liability exposure", "severity": "red", "explanation": "You could be held liable for damages far exceeding the contract value. This is extremely risky.", "location": "Section 7"}
    ],
    "jurisdiction_info": {
        "governingLaw": "State of California",
        "jurisdiction": "Los Angeles, California",
        "isValid": True,
        "warnings": ["Ensure you understand California contract law", "Arbitration in LA may be costly if you're not local"],
        "recommendations": ["Consider adding a clause for remote arbitration options"]
    },
    "summary": {
        "bulletPoints": [
            "This is a $5,000 web development contract with ABC Corporation",
            "Payment is split 50/50 - half upfront, half on completion",
            "WARNING: You must provide unlimited revisions at no extra cost",
            "WARNING: Client can cancel anytime without paying you",
            "WARNING: You have unlimited liability for any damages"
        ],
        "obligations": [
            "Design and develop company website",
            "Integrate payment systems",
            "Create mobile responsive design",
            "Provide unlimited revisions",
            "Keep client information confidential for 2 years"
        ],
        "rights": [
            "Receive $2,500 upfront payment",
            "Receive $2,500 upon completion",
            "Terminate with 7 days notice"
        ],
        "paymentSummary": "Total $5,000 - $2,500 upfront, $2,500 on completion. No late payment penalties specified.",
        "mainRisks": [
            "Unlimited revisions could mean endless unpaid work",
            "Client can cancel without paying for completed work",
            "You have unlimited liability - could lose more than you earn"
        ]
    }
}

class GeminiClient:
    """Client for interacting with Google's Gemini API"""
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self.base_url = settings.GEMINI_BASE_URL
        self.mock_mode = settings.MOCK_MODE
        
    def _get_url(self) -> str:
        return f"{self.base_url}/models/{self.model}:generateContent"
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Content-Type": "application/json",
            "X-goog-api-key": self.api_key
        }
    
    async def generate(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 8192,
        max_retries: int = 3
    ) -> str:
        """Generate text using Gemini API with retry logic"""
        
        contents = []
        
        if system_instruction:
            contents.append({
                "role": "user",
                "parts": [{"text": f"System: {system_instruction}"}]
            })
            contents.append({
                "role": "model", 
                "parts": [{"text": "Understood. I will follow these instructions."}]
            })
        
        contents.append({
            "role": "user",
            "parts": [{"text": prompt}]
        })
        
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
                "topP": 0.95,
                "topK": 40
            }
        }
        
        last_error = None
        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=120.0) as client:
                    response = await client.post(
                        self._get_url(),
                        headers=self._get_headers(),
                        json=payload
                    )
                    
                    # Handle rate limiting and service unavailable
                    if response.status_code in [429, 503]:
                        retry_after = 10 * (attempt + 1)  # Exponential backoff
                        if response.status_code == 429:
                            try:
                                error_data = response.json()
                                if "error" in error_data:
                                    details = error_data["error"].get("details", [])
                                    for detail in details:
                                        if detail.get("@type", "").endswith("RetryInfo"):
                                            retry_str = detail.get("retryDelay", "60s")
                                            retry_after = int(retry_str.replace("s", "").split(".")[0]) + 5
                            except:
                                pass
                        print(f"API error {response.status_code}. Waiting {retry_after}s before retry {attempt + 1}/{max_retries}")
                        await asyncio.sleep(retry_after)
                        continue
                    
                    response.raise_for_status()
                    result = response.json()
                    
                if "candidates" in result and len(result["candidates"]) > 0:
                    return result["candidates"][0]["content"]["parts"][0]["text"]
                
                raise Exception("No response from Gemini API")
                
            except httpx.HTTPStatusError as e:
                last_error = e
                if e.response.status_code != 429:
                    raise
            except Exception as e:
                last_error = e
                if attempt < max_retries - 1:
                    await asyncio.sleep(5 * (attempt + 1))
                    continue
                raise
        
        raise last_error or Exception("Max retries exceeded")
    
    async def generate_json(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.3
    ) -> Dict[str, Any]:
        """Generate JSON response from Gemini"""
        
        # Mock mode for testing when API quota is exhausted
        if self.mock_mode:
            return self._get_mock_response(prompt)
        
        json_prompt = f"""{prompt}

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanations.
Start your response with {{ and end with }}"""
        
        response = await self.generate(
            prompt=json_prompt,
            system_instruction=system_instruction,
            temperature=temperature
        )
        
        # Clean response
        response = response.strip()
        if response.startswith("```json"):
            response = response[7:]
        if response.startswith("```"):
            response = response[3:]
        if response.endswith("```"):
            response = response[:-3]
        response = response.strip()
        
        return json.loads(response)
    
    def _get_mock_response(self, prompt: str) -> Dict[str, Any]:
        """Return mock response based on prompt content"""
        prompt_lower = prompt.lower()
        
        # Chat/Q&A - check first as it's most specific
        if "contract analysis assistant" in prompt_lower or "answer the user's question" in prompt_lower:
            return {
                "answer": "Based on the contract, the client can terminate at any time without penalty according to Section 5. This is a significant risk as you could lose payment for work already completed.",
                "citations": ["The Client may terminate at any time without penalty"],
                "relatedClauses": ["terminationConditions", "paymentTerms"],
                "followUpQuestions": ["What happens to my payment if the client terminates?", "Can I add a kill fee clause?"]
            }
        elif "classify" in prompt_lower and "document" in prompt_lower:
            return MOCK_RESPONSES["document_type"]
        elif "extract" in prompt_lower and "clause" in prompt_lower:
            return MOCK_RESPONSES["clauses"]
        elif "risk" in prompt_lower and "score" in prompt_lower:
            return MOCK_RESPONSES["risk_score"]
        elif "missing" in prompt_lower and "clause" in prompt_lower:
            return MOCK_RESPONSES["missing_clauses"]
        elif "red flag" in prompt_lower or "dangerous" in prompt_lower:
            return MOCK_RESPONSES["red_flags"]
        elif "jurisdiction" in prompt_lower or "governing law" in prompt_lower:
            return MOCK_RESPONSES["jurisdiction_info"]
        elif "summary" in prompt_lower or "plain-english" in prompt_lower:
            return MOCK_RESPONSES["summary"]
        elif "fix" in prompt_lower and "clause" in prompt_lower:
            return {
                "originalClause": "The Contractor will provide unlimited revisions",
                "fixedClause": "The Contractor will provide up to 3 rounds of revisions. Additional revisions will be billed at $50/hour.",
                "explanation": "Limited revisions protect you from scope creep while still providing reasonable flexibility.",
                "negotiationWording": "I'd like to propose a small adjustment to the revisions clause. To ensure we can deliver the best quality work within the project timeline, I suggest limiting revisions to 3 rounds, with additional revisions available at an hourly rate. This helps us both maintain focus on the project goals."
            }

        
        # Default response
        return {"status": "mock_response", "message": "This is a mock response for testing"}
    
    async def chat(
        self,
        messages: List[Dict[str, str]],
        system_instruction: Optional[str] = None
    ) -> str:
        """Multi-turn chat with Gemini"""
        
        contents = []
        
        if system_instruction:
            contents.append({
                "role": "user",
                "parts": [{"text": f"System: {system_instruction}"}]
            })
            contents.append({
                "role": "model",
                "parts": [{"text": "Understood."}]
            })
        
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg["content"]}]
            })
        
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 4096
            }
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                self._get_url(),
                headers=self._get_headers(),
                json=payload
            )
            response.raise_for_status()
            result = response.json()
        
        if "candidates" in result and len(result["candidates"]) > 0:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        
        raise Exception("No response from Gemini API")

gemini_client = GeminiClient()
