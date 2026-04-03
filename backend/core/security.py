from __future__ import annotations

import datetime as dt
from typing import Any, Dict, Optional

from jose import jwt
from passlib.context import CryptContext

from .config import get_settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_token(subject: str, minutes: int, token_type: str) -> str:
    settings = get_settings()
    expire = dt.datetime.utcnow() + dt.timedelta(minutes=minutes)
    to_encode: Dict[str, Any] = {"sub": subject, "exp": expire, "type": token_type}
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str, token_type: Optional[str] = None) -> Dict[str, Any]:
    settings = get_settings()
    payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    if token_type and payload.get("type") != token_type:
        raise jwt.JWTError("Invalid token type")
    return payload
