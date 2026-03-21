from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str
    clerk_secret_key: str = ""
    ai_provider: str = "anthropic"
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    environment: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()