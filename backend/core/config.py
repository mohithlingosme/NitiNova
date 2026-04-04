from __future__ import annotations

from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "NitiNova"
    api_prefix: str = "/api"
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_minutes: int = 60 * 24 * 7
    cors_origins: str = "*"

    rate_limit_free: int = 10  # per minute
    rate_limit_pro: int = 60

    # Database
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "nitinova"
    POSTGRES_USER: str = "nitinova"
    POSTGRES_PASSWORD: str = "password"
    DATABASE_URL: str = ""

    @property
    def ASYNC_DATABASE_URL(self):
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Environment
    app_env: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    log_level: str = "info"
    frontend_url: str = "http://localhost:3000"
    cors_allow_origins: str = "*"
    secret_key: str = "change-me"
    refresh_token_expire_days: int = 7
    redis_url: str = "redis://localhost:6379/0"
    vector_store_provider: str = "faiss"
    pinecone_environment: str = ""
    pinecone_index_name: str = "nitinova"
    faiss_index_path: str = "data/processed/faiss.index"
    openai_api_base: str = "https://api.openai.com/v1"
    openai_model: str = "gpt-4.1-mini"
    anthropic_model: str = "claude-3-opus"
    embedding_model: str = "text-embedding-3-large"
    enable_rag: bool = True
    enable_verification: bool = True
    
    # OpenAI
    openai_api_key: str = ""

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
