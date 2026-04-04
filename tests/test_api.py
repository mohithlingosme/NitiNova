import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from backend.main import app  # Assume creates app

client = TestClient(app)

def test_health_endpoint():
    """Test health check."""
    response = client.get("/health")  # From backend/api/health.py
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_pipeline_upload_no_file():
    """Test upload without file."""
    response = client.post("/pipeline/upload")
    assert response.status_code == 422  # Validation error

def test_search_empty_query():
    """Test search with empty query."""
    response = client.get("/pipeline/search?q=")
    assert response.status_code == 422  # Query param required

def test_search_valid():
    """Test search endpoint."""
    response = client.get("/pipeline/search?q=contract&type=keyword&limit=5")
    assert response.status_code == 200
    assert "results" in response.json()

@pytest.mark.asyncio
async def test_get_case_not_found():
    """Test case retrieval 404."""
    response = client.get("/pipeline/case/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404

# Note: Full API tests require auth mocks and DB setup

