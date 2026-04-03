from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api import deps
from backend.core.config import get_settings
from backend.core.security import create_token, decode_token, verify_password
from backend.models.schemas import LoginRequest, RegisterRequest, TokenResponse, UserPublic
from backend.core.database import get_db
from backend.core import crud

router = APIRouter()


@router.post("/register", response_model=UserPublic, status_code=201)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)) -> UserPublic:
    user = await crud.get_user_by_email(db, email=payload.email)
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    user = await crud.create_user(db, user=payload)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    user = await crud.get_user_by_email(db, email=payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect credentials")
    settings = get_settings()
    access = create_token(user.email, settings.access_token_expire_minutes, "access")
    refresh = create_token(user.email, settings.refresh_token_expire_minutes, "refresh")
    # In a real application, you would store and manage refresh tokens in the database
    return TokenResponse(access_token=access, refresh_token=refresh)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(token: str) -> TokenResponse:
    settings = get_settings()
    try:
        payload = decode_token(token, token_type="refresh")
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc

    subject = payload.get("sub")
    if not subject:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    access = create_token(subject, settings.access_token_expire_minutes, "access")
    refresh_token = create_token(subject, settings.refresh_token_expire_minutes, "refresh")
    return TokenResponse(access_token=access, refresh_token=refresh_token)

@router.post("/logout")
async def logout(current_user: UserPublic = Depends(deps.get_current_user)):
    # In a real application, you would invalidate the refresh token.
    return {"detail": f"Logout successful for {current_user.email}"}
