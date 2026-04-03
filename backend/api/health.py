from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter

from backend.core.config import get_settings

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health():
    settings = get_settings()
    return {
        "status": "ok",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "service": {
            "name": settings.app_name,
            "version": settings.app_version,
            "environment": settings.app_env,
            "edition": settings.product_edition,
        },
        "components": {
            "db": "configured",
            "vector": settings.vector_store_provider,
            "llm": settings.openai_model,
        },
    }
