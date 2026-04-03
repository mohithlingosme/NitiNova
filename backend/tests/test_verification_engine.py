import pytest
import uuid
from unittest.mock import AsyncMock
from backend.verification.engine import VerificationEngine

@pytest.mark.asyncio
async def test_verification_engine():
    # Mock the database session
    mock_db = AsyncMock()
    
    engine = VerificationEngine(mock_db)
    
    # Mock the crud function
    engine.db.commit = AsyncMock()
    engine.db.refresh = AsyncMock()
    
    request_id = uuid.uuid4()
    llm_output = "The case 2023 INSC 456 is relevant."
    
    result = await engine.verify(request_id, llm_output)
    
    assert not result['needs_rerun']
    assert len(result['verified_citations']) == 1
    assert result['verified_citations'][0]['status'] == 'verified'
    
    # Check that the log function was called
    assert mock_db.add.called
    assert mock_db.commit.called
