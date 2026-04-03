from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import get_settings

settings = get_settings()

db_url = settings.ASYNC_DATABASE_URL
# Support both async and sync URLs from .env by upgrading psycopg2 URLs to asyncpg
if db_url.startswith("postgresql+psycopg2"):
    db_url = db_url.replace("postgresql+psycopg2", "postgresql+asyncpg")

engine = create_async_engine(db_url, echo=False)
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()

async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session
