import asyncio
import httpx
import uuid
from pathlib import Path
import os

API_BASE = "http://localhost:8000/api"
SAMPLE_PDF = "data/raw/sample.pdf"  # Add test PDF here

async def test_upload():
    """Test PDF upload."""
    if not Path(SAMPLE_PDF).exists():
        print("❌ No test PDF. Skip upload test.")
        return
    
    with open(SAMPLE_PDF, 'rb') as f:
        files = {'file': f}
        async with httpx.AsyncClient() as client:
            resp = await client.post(f"{API_BASE}/pipeline/upload", files=files)
            print("Upload:", resp.status_code, resp.json())
            return resp.json().get('file_path')

async def test_process(file_path):
    """Test process pipeline."""
    data = {"file_path": file_path}
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{API_BASE}/pipeline/process", json=data)
        print("Process:", resp.status_code, resp.json())
        task_id = resp.json().get('task_id')
        if task_id:
            await asyncio.sleep(30)  # Wait for background task
        return task_id

async def test_search(query="contract breach"):
    """Test search."""
    params = {"q": query, "type": "semantic", "limit": 5}
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{API_BASE}/pipeline/search", params=params)
        print("Search:", resp.status_code, resp.json())
        return resp.json()

async def test_get_case(case_id):
    """Test get case."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{API_BASE}/pipeline/case/{case_id}")
        print("Get case:", resp.status_code, resp.json())

async def main():
    print("🧪 Testing NitiNova Pipeline API...")
    
    # Note: Auth token needed for protected routes - set headers={'Authorization': 'Bearer TOKEN'}
    
    # 1. Upload
    file_path = await test_upload()
    
    # 2. Process
    if file_path:
        task_id = await test_process(file_path)
        # 3. Get case (assume case_id from process result)
        # await test_get_case("some-case-id")
    
    # 4. Search
    await test_search()
    
    print("✅ Tests complete!")

if __name__ == "__main__":
    asyncio.run(main())

