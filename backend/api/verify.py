from __future__ import annotations

from fastapi import APIRouter, Depends

from backend.api import deps
from backend.models.schemas import User, VerifyRequest, VerifyResponse
from backend.verification.engine import VerificationEngine

router = APIRouter(prefix="/verify", tags=["verify"])


@router.post("", response_model=VerifyResponse)
def verify(payload: VerifyRequest, user: User = Depends(deps.get_current_user)):
    engine = VerificationEngine()
    return engine.verify_citation(payload.citation)
