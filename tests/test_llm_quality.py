import pytest
import json
from pathlib import Path
from backend.services.llm_service import LLMService

@pytest.fixture
def sample_case():
    return {
        "case_name": "Test Case",
        "court": "Test Court",
        "facts": "Test facts",
        "issues": ["Test issue"],
        "judgement": "Test judgement"
    }

def test_llm_quality(sample_case, mock_llm_service):
    """Test LLM processing produces valid output."""
    llm = mock_llm_service
    result = llm.process_case(sample_case)
    
    assert hasattr(result, 'summary')
    assert result.summary is not None
    assert len(result.summary) > 10
    assert hasattr(result, 'issues')
    assert len(result.issues) > 0
    assert hasattr(result, 'ratio')

