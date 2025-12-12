"""Base Agent class for all AI agents"""
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from ..utils.gemini_client import gemini_client

class BaseAgent(ABC):
    """Base class for all AI agents in the system"""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.gemini = gemini_client
    
    @abstractmethod
    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the agent's main task"""
        pass
    
    async def generate(self, prompt: str, system_instruction: Optional[str] = None, temperature: float = 0.7) -> str:
        """Generate text using Gemini"""
        return await self.gemini.generate(prompt, system_instruction, temperature)
    
    async def generate_json(self, prompt: str, system_instruction: Optional[str] = None, temperature: float = 0.3) -> Dict[str, Any]:
        """Generate JSON response using Gemini"""
        return await self.gemini.generate_json(prompt, system_instruction, temperature)
