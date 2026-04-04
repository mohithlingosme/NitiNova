import pytest
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.crud import create_case, get_case
from backend.models.db_models import Case
from backend.models.schemas import EnrichedCase

@pytest.mark.asyncio
async def test_create_get_case(test_db_session):
    """Test case CRUD operations."""
    # Create
    case_data = EnrichedCase(
        case_name="Test Case DB",
        court="Test Court",
        summary="Test summary",
        issues=["db issue"],
        ratio="db ratio"
    )
    created_case = await create_case(test_db_session, case_data)
    
    assert isinstance(created_case, Case)
    assert created_case.case_name == "Test Case DB"
    
    # Get
    fetched = await get_case(test_db_session, str(created_case.id))
    assert fetched is not None
    assert fetched.summary == "Test summary"

@pytest.mark.asyncio
async def test_case_jsonb_fields(test_db_session):
    """Test JSONB fields (issues, citations)."""
    case_data = EnrichedCase(
        case_name="JSONB Test",
        issues=["issue1", "issue2"],
        citations=["2023 SCC 123"]
    )
    case = await create_case(test_db_session, case_data)
    
    fetched = await get_case(test_db_session, str(case.id))
    assert fetched.issues == ["issue1", "issue2"]

@pytest.mark.asyncio
async def test_get_nonexistent_case(test_db_session):
    """Test get_case returns None."""
    fake_id = str(uuid.uuid4())
    case = await get_case(test_db_session, fake_id)
    assert case is None

