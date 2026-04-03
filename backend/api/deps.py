from __future__ import annotations

import time
import uuid
from datetime import datetime
from typing import Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core import crud
from backend.core.config import get_settings
from backend.core.database import get_db
from backend.models.schemas import Role, UserPublic

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{get_settings().api_prefix}/auth/login", auto_error=False)
settings = get_settings()


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> UserPublic:
    """
    Decode a JWT access token and fetch the corresponding user from the database.
    Falls back to an anonymous user when authentication is disabled for local demos.
    """
    if not token:
        return UserPublic(id=uuid.uuid4(), email="demo@nitinova.ai", role=Role.free, created_at=datetime.utcnow())

    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    user = await crud.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


async def get_current_admin_user(current_user: UserPublic = Depends(get_current_user)) -> UserPublic:
    if current_user.role != Role.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user


QUERY_RESULTS: Dict[uuid.UUID, dict] = {}
RATE_LIMIT_BUCKETS: Dict[str, list] = {}


def rate_limiter(user: UserPublic = Depends(get_current_user)) -> None:
    now = time.time()
    window = 60.0
    limit = settings.rate_limit_pro if user.role == Role.pro else settings.rate_limit_free
    bucket = RATE_LIMIT_BUCKETS.setdefault(str(user.id), [])
    # drop old entries
    RATE_LIMIT_BUCKETS[str(user.id)] = [t for t in bucket if now - t < window]
    if len(RATE_LIMIT_BUCKETS[str(user.id)]) >= limit:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    RATE_LIMIT_BUCKETS[str(user.id)].append(now)


def store_result(request_id: uuid.UUID, data: dict) -> None:
    QUERY_RESULTS[request_id] = data


def get_result(request_id: uuid.UUID) -> dict | None:
    return QUERY_RESULTS.get(request_id)
