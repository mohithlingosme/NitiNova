"""
Pipeline API endpoint.
Temporary working version with broken imports commented.
"""
from fastapi import APIRouter, Depends
from backend.services.pipeline_service import run_verification_pipeline
# from backend.services.search_service import search_cases  # Commented

router = APIRouter()

@router.post("/pipeline")
async def pipeline_endpoint(query: str):
    """
    Run verification pipeline.
    """
    result = run_verification_pipeline(query)
    return {"result": result}
