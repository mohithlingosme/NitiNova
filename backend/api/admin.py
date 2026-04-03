from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from backend.api.deps import get_current_admin_user
from backend.core.database import get_db
from backend.core import crud
from backend.models.schemas import UserPublic, VerificationLog

router = APIRouter()

@router.get("/verification-logs", response_model=List[VerificationLog], dependencies=[Depends(get_current_admin_user)])
async def read_verification_logs(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Retrieve verification logs.
    """
    logs = await crud.get_verification_logs(db, skip=skip, limit=limit)
    return logs
