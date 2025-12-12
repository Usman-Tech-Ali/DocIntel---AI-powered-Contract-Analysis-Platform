"""Configuration for the AI Worker Service"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Gemini API
    GEMINI_API_KEY: str = "AIzaSyCHiTmPf-D2XJ-78y4zV2KlbgBl0lMY7Sc"
    GEMINI_MODEL: str = "gemma-3-4b-it"
    GEMINI_BASE_URL: str = "https://generativelanguage.googleapis.com/v1beta"
    
    # Mock mode for testing when API quota is exhausted
    MOCK_MODE: bool = os.getenv("MOCK_MODE", "false").lower() == "true"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # File storage
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    
    # MongoDB
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = "docintel"
    
    class Config:
        env_file = ".env"

settings = Settings()
