"""Pytest configuration and fixtures for Nitinova tests."""
import pytest
import pytest_asyncio
from unittest.mock import Mock, patch, MagicMock
from pathlib import Path
import tempfile
import shutil
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import sqlalchemy
from sqlalchemy.orm import declarative_base
Base = declarative_base()
from backend.core.database import engine
from backend.services.llm_service import LLMService

@pytest.fixture(scope="session")
def sample_txt_file():
    """Sample judgment text file."""
    content = """STATE OF XYZ VERSUS ABC PVT. LTD.
SUPREME COURT OF INDIA
HON'BLE MR. JUSTICE PANKALA GHOSH

1. The facts of the case are...

2. The main issues are...
"""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write(content)
        yield Path(f.name)
    Path(f.name).unlink()

@pytest.fixture
def mock_openai_client():
    """Mock OpenAI client."""
    with patch('openai.OpenAI') as mock:
        client = Mock()
        response = Mock()
        response.choices[0].message.content = '{"summary": "Test summary", "issues": ["test issue"], "ratio": "Test ratio"}'
        client.chat.completions.create.return_value = response
        mock.return_value = client
        yield client

@pytest.fixture
def mock_llm_service(mock_openai_client):
    """Mocked LLMService."""
    with patch.object(LLMService, '_call_llm', return_value='{"summary": "mock", "issues": ["mock"], "ratio": "mock ratio"}'):
        yield LLMService()

@pytest_asyncio.fixture
async def test_db_session():
    """Temporary in-memory async DB."""
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)
    
    async with TestingSessionLocal() as session:
        yield session
    
    await engine.dispose()

@pytest.hookimpl(tryfirst=True)
def pytest_configure(config):
    """Configure pytest."""
    config.addinivalue_line("markers", "asyncio: mark test as async")

