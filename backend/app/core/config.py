from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Supabase Configuration
    supabase_url: str
    supabase_key: str
    supabase_service_key: str
    
    # JWT Configuration
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    
    # Database Configuration
    database_url: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()