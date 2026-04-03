import pytest
from fastapi import HTTPException

from backend.api.auth import refresh
from backend.core.security import create_token, decode_token


@pytest.mark.asyncio
async def test_refresh_reissues_access_and_refresh_tokens():
    refresh_token = create_token("demo@nitinova.ai", minutes=30, token_type="refresh")

    token_response = await refresh(refresh_token)

    access_payload = decode_token(token_response.access_token, token_type="access")
    refreshed_payload = decode_token(token_response.refresh_token, token_type="refresh")

    assert access_payload["sub"] == "demo@nitinova.ai"
    assert refreshed_payload["sub"] == "demo@nitinova.ai"


@pytest.mark.asyncio
async def test_refresh_rejects_non_refresh_token():
    access_token = create_token("demo@nitinova.ai", minutes=30, token_type="access")

    with pytest.raises(HTTPException) as exc:
        await refresh(access_token)

    assert exc.value.status_code == 401
