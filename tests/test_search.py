import pytest
from unittest.mock import patch, AsyncMock
import asyncio
from backend.services.search_service import keyword_search_dep, semantic_search_dep

@pytest.mark.asyncio
@patch('backend.services.search_service.keyword_search')
async def test_keyword_search(mock_keyword, test_db_session):
    """Test keyword search calls DB correctly."""
    mock_keyword.return_value = [{"case_name": "Found Case"}]
    
    results = await keyword_search_dep("test query", limit=5)
    mock_keyword.assert_called_once()
    assert len(results) == 1
    assert results[0]["case_name"] == "Found Case"

@pytest.mark.asyncio
@patch('backend.services.search_service.RAGRetriever')
async def test_semantic_search(mock_retriever):
    """Test semantic search uses retriever."""
    mock_retriever_instance = AsyncMock()
    mock_retriever.return_value = mock_retriever_instance
    mock_retriever_instance.retrieve.return_value = [{"case_name": "Semantic Match"}]
    
    results = await semantic_search_dep("semantic query")
    mock_retriever_instance.retrieve.assert_called_once()
    assert len(results) > 0

def test_search_empty_query():
    """Empty query returns empty."""
    import asyncio
    loop = asyncio.get_event_loop()
    with pytest.raises(ValueError):
        loop.run_until_complete(keyword_search_dep("", limit=1))

@pytest.mark.parametrize("query_type", ["keyword", "semantic"])
@pytest.mark.asyncio
async def test_search_results_format(query_type):
    """Results have expected structure."""
    if query_type == "keyword":
        with patch('backend.services.search_service.keyword_search_dep') as mock:
            mock.return_value = [{"case_name": "test"}]
            results = await keyword_search_dep("test")
    else:
        with patch('backend.services.search_service.semantic_search_dep') as mock:
            mock.return_value = [{"case_name": "test"}]
            results = await semantic_search_dep("test")
    
    assert isinstance(results, list)
    assert all('case_name' in r for r in results)

