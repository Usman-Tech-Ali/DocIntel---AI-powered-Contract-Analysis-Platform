"""
Feature 12: Supervisor Agent - Routes tasks to appropriate agents
Part of Multi-Agent AI Orchestration (LangGraph-style)
"""
from typing import Any, Dict, List
from .base_agent import BaseAgent

class SupervisorAgent(BaseAgent):
    """Supervisor Agent that routes tasks to specialized agents"""
    
    def __init__(self):
        super().__init__(
            name="supervisor",
            description="Routes tasks to appropriate specialized agents"
        )
        self.task_routing = {
            "ingest": "ingestion",
            "extract_clauses": "clause_extractor",
            "analyze_risk": "risk_engine",
            "explain": "explainer",
            "chat": "explainer",
            "fix_clause": "explainer",
            "generate_report": "explainer"
        }
    
    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Determine which agent should handle the task"""
        task_type = input_data.get("task_type", "")
        
        if task_type in self.task_routing:
            return {
                "route_to": self.task_routing[task_type],
                "task_type": task_type,
                "input_data": input_data
            }
        
        # Use AI to determine routing for ambiguous tasks
        prompt = f"""Analyze this task and determine which agent should handle it:
Task: {input_data.get('task', '')}
Context: {input_data.get('context', '')}

Available agents:
- ingestion: Document parsing, OCR, text extraction
- clause_extractor: Extract specific clauses and terms from contracts
- risk_engine: Analyze risks, red flags, missing clauses
- explainer: Answer questions, generate summaries, fix clauses, create reports

Respond with JSON: {{"route_to": "agent_name", "reason": "explanation"}}"""
        
        result = await self.generate_json(prompt)
        return {
            "route_to": result.get("route_to", "explainer"),
            "reason": result.get("reason", ""),
            "task_type": task_type,
            "input_data": input_data
        }
    
    def get_workflow_plan(self, document_type: str) -> List[str]:
        """Get the workflow plan for analyzing a document"""
        return [
            "ingestion",      # Step 1: Extract and clean text
            "clause_extractor", # Step 2: Extract all clauses
            "risk_engine",    # Step 3: Analyze risks
            "explainer"       # Step 4: Generate summary and report
        ]
