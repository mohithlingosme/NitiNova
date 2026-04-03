from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from backend.models.db_models import VerificationLog

async def get_verification_logs(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[VerificationLog]:
    """
    Retrieve verification logs with pagination.
    """
    stmt = select(VerificationLog).offset(skip).limit(limit).order_by(VerificationLog.verified_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

