from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_clients():
    return [{"id": 1, "name": "Sample Client"}]

@router.post("/")
async def create_client():
    return {"id": 2, "name": "New Client"}

