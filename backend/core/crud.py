from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
# from backend.models.db_models import VerificationLog

# Disabled verification logs to break circular import
# async def get_verification_logs(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[VerificationLog]:
#     """
#     Retrieve verification logs with pagination.
#     """
#     stmt = select(VerificationLog).offset(skip).limit(limit).order_by(VerificationLog.verified_at.desc())
#     result = await db.execute(stmt)
#     return result.scalars().all()

from backend.models.db_models import Case
from backend.models.schemas import EnrichedCase
import uuid
from typing import Optional

async def create_case(db: AsyncSession, case_data: EnrichedCase) -> Case:
    """
    Create new case from enriched data.
    """
    # Map EnrichedCase to Case model
    case_dict = case_data.model_dump(exclude_unset=True)
    case_dict['issues'] = case_data.issues  # List to JSONB
    case_dict['citations'] = case_data.citations if hasattr(case_data, 'citations') else []
    case = Case(**case_dict)
    db.add(case)
    await db.commit()
    await db.refresh(case)
    return case

async def get_case(db: AsyncSession, case_id: str) -> Optional[Case]:
    """
    Get case by ID.
    """
    return await db.get(Case, uuid.UUID(case_id))


