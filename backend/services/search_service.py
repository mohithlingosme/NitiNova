"""
Mock search service for RAG.
"""
def search(query: str, k: int = 5):
    """
    Mock vector search.
    """
    # Mock results
    return [
        {"content": "Mock legal case 1 for " + query, "metadata": {"case_id": 1}},
        {"content": "Mock legal case 2 for " + query, "metadata": {"case_id": 2}},
    ][:k]
