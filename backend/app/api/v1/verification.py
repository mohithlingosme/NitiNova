from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter()

class CitationCheck(BaseModel):
    citations: list

@router.post("/citations")
async def verify_citations(check: CitationCheck):
    # TODO: verification_service
    return {"verified": 8, "total": 10, "score": 0.8}

