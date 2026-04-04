from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import uuid
from typing import List
from backend.services.llm_service import LLMService
from backend.models.schemas import StructuredCaseInput, EnrichedCase, UserPublic
from backend.api.deps import get_current_user
from backend.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
import json
from pathlib import Path

router = APIRouter()

@router.post("/process", response_model=EnrichedCase)
async def process_case(
    payload: StructuredCaseInput,
    current_user: UserPublic = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Process structured case JSON from parser -> LLM enrichment -> save enriched JSON
    """
    service = LLMService()
    enriched = service.process_case(payload)
    
    # Also save response for API (already saved in service)
    enriched_path = Path('data/enriched') / f"{payload.case_name.replace(' ', '_').replace('/', '_')}.json"
    
    return enriched

