import pytest
from backend.services.llm_service import LLMService
from backend.models.schemas import StructuredCaseInput, EnrichedCase

def test_llm_process_case(mock_llm_service, sample_case):
    """Test LLM enrichment with mock."""
    llm = mock_llm_service
    result = llm.process_case(sample_case)
    
    assert isinstance(result, EnrichedCase)
    assert result.summary is not None
    assert len(result.summary) > 0
    assert result.issues is not None
    assert len(result.issues) > 0
    assert result.ratio is not None

def test_llm_mock_fallback(mock_llm_service):
    """Test mock response format."""
    sample = StructuredCaseInput(
        case_name="Mock Case",
        court="Mock Court",
        facts="Mock facts",
        issues=["mock"],
        judgement="mock judgement"
    )
    result = mock_llm_service.process_case(sample)
    assert '"mock"' in result.summary  # From mock response

def test_llm_long_text_chunking(mock_llm_service):
    """Test text chunking for long inputs."""
    long_facts = "A" * 50000  # > token limit
    long_case = StructuredCaseInput(
        case_name="Long",
        facts=long_facts,
        issues=[],
        judgement="short"
    )
    result = mock_llm_service.process_case(long_case)
    assert len(result.summary) < 2000  # Should be chunked

def test_llm_no_api_key(mock_llm_service):
    """Test fallback when no API key."""
    with pytest.raises(AttributeError):  # Client is None
        llm = LLMService()
        llm.process_case(StructuredCaseInput(case_name="test"))

