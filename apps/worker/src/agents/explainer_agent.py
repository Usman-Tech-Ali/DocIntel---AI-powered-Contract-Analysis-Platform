"""
Features 2, 7, 8, 9: Explainer Agent
- Plain-English Contract Summary
- One-Click Clause Fixer
- Legal Q&A Chat
- Annotated Contract Report
"""
from typing import Any, Dict, List, Optional
from .base_agent import BaseAgent

class ExplainerAgent(BaseAgent):
    """Agent for explanations, summaries, chat, and report generation"""
    
    def __init__(self):
        super().__init__(
            name="explainer",
            description="Generates summaries, answers questions, fixes clauses, creates reports"
        )
    
    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Route to appropriate explanation task"""
        task = input_data.get("task", "summary")
        
        if task == "summary":
            return await self.generate_summary(input_data)
        elif task == "chat":
            return await self.answer_question(input_data)
        elif task == "fix_clause":
            return await self.fix_clause(input_data)
        elif task == "report":
            return await self.generate_report_data(input_data)
        
        return {"error": "Unknown task"}
    
    async def generate_summary(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Feature 2: Generate plain-English summary"""
        text = input_data.get("text", "")
        clauses = input_data.get("extracted_clauses", {})
        doc_type = input_data.get("document_type", "contract")
        language = input_data.get("language", "en")
        
        lang_instruction = ""
        if language != "en":
            lang_map = {"ur": "Urdu", "hi": "Hindi", "ar": "Arabic", "es": "Spanish", "fr": "French", "de": "German", "zh": "Chinese"}
            lang_instruction = f"Respond in {lang_map.get(language, 'English')}."
        
        prompt = f"""Create a plain-English summary of this {doc_type} for a freelancer/service provider.
{lang_instruction}

Contract text: {text[:5000]}
Key clauses: {clauses}

Provide:
1. 3-5 bullet points summarizing what this contract means
2. Key obligations (what you must do)
3. Key rights (what you're entitled to)
4. Payment summary
5. Main risks in simple terms

Use simple language a non-lawyer can understand. No legal jargon.

Return JSON:
{{
    "bulletPoints": ["point1", "point2", "point3"],
    "obligations": ["obligation1", "obligation2"],
    "rights": ["right1", "right2"],
    "paymentSummary": "simple payment explanation",
    "mainRisks": ["risk1", "risk2"]
}}"""
        
        return await self.generate_json(prompt, temperature=0.5)
    
    async def answer_question(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Feature 8: Legal Q&A Chat"""
        question = input_data.get("question", "")
        text = input_data.get("text", "")
        clauses = input_data.get("extracted_clauses", {})
        history = input_data.get("history", [])
        language = input_data.get("language", "en")
        
        lang_instruction = ""
        if language != "en":
            lang_map = {"ur": "Urdu", "hi": "Hindi", "ar": "Arabic", "es": "Spanish", "fr": "French", "de": "German", "zh": "Chinese"}
            lang_instruction = f"Respond in {lang_map.get(language, 'English')}."
        
        history_text = ""
        if history:
            history_text = "Previous conversation:\n" + "\n".join([f"{m['role']}: {m['content']}" for m in history[-5:]])
        
        prompt = f"""You are a contract analysis assistant. Answer the user's question about this contract.
{lang_instruction}

Contract text: {text[:4000]}
Key clauses: {clauses}
{history_text}

User question: {question}

Rules:
1. Answer in plain, simple language
2. Quote the exact clause when relevant
3. Explain what it means for the user
4. If the answer isn't in the contract, say so
5. Be helpful and practical

Return JSON:
{{
    "answer": "your detailed answer",
    "citations": ["exact quote 1", "exact quote 2"],
    "relatedClauses": ["clause name 1", "clause name 2"],
    "followUpQuestions": ["suggested question 1", "suggested question 2"]
}}"""
        
        return await self.generate_json(prompt, temperature=0.6)
    
    async def fix_clause(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Feature 7: One-Click Clause Fixer"""
        original_clause = input_data.get("clause_text", "")
        issue = input_data.get("issue", "")
        context = input_data.get("context", "")
        
        prompt = f"""You are a contract negotiation expert. Fix this problematic clause.

Original clause: "{original_clause}"
Issue: {issue}
Context: {context}

Provide:
1. A fixed version that protects the freelancer/service provider
2. Explanation of changes
3. Polite negotiation wording to send to the client

Return JSON:
{{
    "originalClause": "the original text",
    "fixedClause": "the improved clause text",
    "explanation": "what was changed and why",
    "negotiationWording": "polite email/message text to propose this change"
}}"""
        
        return await self.generate_json(prompt, temperature=0.5)
    
    async def generate_report_data(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Feature 9: Generate data for annotated report"""
        analysis = input_data.get("analysis", {})
        
        # Structure the report data
        report_data = {
            "title": f"Contract Analysis Report",
            "generatedAt": input_data.get("timestamp", ""),
            "documentType": analysis.get("document_type", "Unknown"),
            "riskScore": analysis.get("risk_score", {}),
            "summary": analysis.get("summary", {}),
            "extractedClauses": analysis.get("extracted_clauses", {}),
            "redFlags": analysis.get("red_flags", []),
            "missingClauses": analysis.get("missing_clauses", []),
            "suggestedFixes": [],
            "jurisdictionInfo": analysis.get("jurisdiction_info", {})
        }
        
        # Generate fixes for each red flag
        for flag in analysis.get("red_flags", [])[:5]:  # Limit to 5 fixes
            if flag.get("severity") in ["red", "yellow"]:
                fix = await self.fix_clause({
                    "clause_text": flag.get("clauseText", ""),
                    "issue": flag.get("issue", ""),
                    "context": analysis.get("document_type", "")
                })
                report_data["suggestedFixes"].append(fix)
        
        return report_data
