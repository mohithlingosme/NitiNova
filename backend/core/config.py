from __future__ import annotations

from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = Field(default="NitiNova", alias="APP_NAME")
    app_version: str = Field(default="1.0.0", alias="APP_VERSION")
    api_prefix: str = Field(default="/api", alias="API_PREFIX")
    jwt_secret: str = Field(default="change-me", alias="SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=15, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_minutes: int = Field(default=60 * 24 * 7, alias="REFRESH_TOKEN_EXPIRE_MINUTES")
    cors_origins: str = Field(default="*", alias="CORS_ALLOW_ORIGINS")

    rate_limit_free: int = 10  # per minute
    rate_limit_pro: int = 60

    # Commercial product metadata (COTS)
    product_edition: str = Field(default="community", alias="PRODUCT_EDITION")
    support_email: str = Field(default="support@nitinova.ai", alias="SUPPORT_EMAIL")
    docs_url: str = Field(default="https://docs.nitinova.ai", alias="DOCS_URL")
    sla_tier: str = Field(default="standard", alias="SLA_TIER")

    # Database
    POSTGRES_HOST: str = Field(default="localhost")
    POSTGRES_PORT: int = Field(default=5432)
    POSTGRES_DB: str = Field(default="nitinova")
    POSTGRES_USER: str = Field(default="nitinova")
    POSTGRES_PASSWORD: str = Field(default="password")
    DATABASE_URL: str = Field(default="")

    @property
    def ASYNC_DATABASE_URL(self):
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Environment
    app_env: str = Field(default="development", alias="APP_ENV")
    api_host: str = Field(default="0.0.0.0", alias="API_HOST")
    api_port: int = Field(default=8000, alias="API_PORT")
    log_level: str = Field(default="info", alias="LOG_LEVEL")
    frontend_url: str = Field(default="http://localhost:3000", alias="FRONTEND_URL")
    cors_allow_origins: str = Field(default="*", alias="CORS_ALLOW_ORIGINS")
    secret_key: str = Field(default="change-me", alias="SECRET_KEY")
    refresh_token_expire_days: int = Field(default=7, alias="REFRESH_TOKEN_EXPIRE_DAYS")
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    vector_store_provider: str = Field(default="faiss", alias="VECTOR_STORE_PROVIDER")
    pinecone_environment: str = Field(default="", alias="PINECONE_ENVIRONMENT")
    pinecone_index_name: str = Field(default="nitinova", alias="PINECONE_INDEX_NAME")
    faiss_index_path: str = Field(default="data/processed/faiss.index", alias="FAISS_INDEX_PATH")
    openai_api_base: str = Field(default="https://api.openai.com/v1", alias="OPENAI_API_BASE")
    openai_api_key: str = Field(default=None, alias="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4o-mini", alias="OPENAI_MODEL")
    anthropic_model: str = Field(default="claude-3-opus", alias="ANTHROPIC_MODEL")
    embedding_model: str = Field(default="text-embedding-3-large", alias="EMBEDDING_MODEL")
    enable_rag: bool = Field(default=True, alias="ENABLE_RAG")
    enable_verification: bool = Field(default=True, alias="ENABLE_VERIFICATION")

    class Config:
        env_file = ".env"
        populate_by_name = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
