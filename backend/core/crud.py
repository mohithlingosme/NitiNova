from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.models.db_models import User, VerificationLog
from backend.models.schemas import RegisterRequest
from backend.core.security import get_password_hash

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: RegisterRequest):
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def create_verification_log(db: AsyncSession, log_data: dict):
    db_log = VerificationLog(**log_data)
    db.add(db_log)
    await db.commit()
    await db.refresh(db_log)
    return db_log

async def get_verification_logs(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(VerificationLog).offset(skip).limit(limit))
    return result.scalars().all()
