from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Tech Nest Intelligence OS"
    VERSION: str = "1.0.0"
    
    # Use standard names (Service Key is needed for backend ops)
    SUPABASE_URL: str = "https://xyz.supabase.co"
    SUPABASE_SERVICE_KEY: str = "your-service-role-key-here"
    
    # ML & AI Environment
    OPENAI_API_KEY: str = "sk-..."
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    
    # Internal
    REDIS_URL: str = "redis://localhost:6379"
    PORT: int = 8000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False
    )


settings = Settings()

