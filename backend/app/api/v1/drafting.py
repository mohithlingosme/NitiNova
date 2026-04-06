from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict

router = APIRouter()

class DraftRequest(BaseModel):
    template_type: str  # "petition", "notice", "agreement"
    case_details: Dict
    jurisdiction: str = "India"

class DraftResponse(BaseModel):
    generated_text: str
    confidence: float
    suggested_edits: list

@router.post("/generate", response_model=DraftResponse)
async def generate_draft(request: DraftRequest):
    # TODO: Integrate drafting_service
    return DraftResponse(
        generated_text="Sample petition content...",
        confidence=0.88,
        suggested_edits=["Add specific dates"]
    )

