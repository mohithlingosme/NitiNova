from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api import deps
from backend.core.config import get_settings
from backend.core.security import create_token, verify_password
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
async def refresh(token: str):
    # This is a simplified refresh token implementation.
    # In a real application, you would validate the refresh token against a database.
    # For now, we will just re-issue tokens.
    settings = get_settings()
    # Here you would decode the refresh token to get the user's email
    # For simplicity, we are not implementing full refresh token logic here.
    # A proper implementation would involve a token blacklist or a database of valid refresh tokens.
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Refresh token functionality not fully implemented")

@router.post("/logout")
async def logout(current_user: UserPublic = Depends(deps.get_current_user)):
    # In a real application, you would invalidate the refresh token.
    return {"detail": f"Logout successful for {current_user.email}"}
