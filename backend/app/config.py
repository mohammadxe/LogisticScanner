"""
Environment configuration
"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Configuration
    api_title: str = "Freight Rate Optimizer"
    api_version: str = "1.0.0"
    debug: bool = os.getenv("DEBUG", "False") == "True"
    
    # Database
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./freight_rates.db")
    
    # OpenAI
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    
    # Freight APIs
    freightos_api_key: str = os.getenv("FREIGHTOS_API_KEY", "")
    shipengine_api_key: str = os.getenv("SHIPENGINE_API_KEY", "")
    easypost_api_key: str = os.getenv("EASYPOST_API_KEY", "")
    xeneta_api_key: str = os.getenv("XENETA_API_KEY", "")
    
    # Frontend
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    class Config:
        env_file = ".env"

settings = Settings()
