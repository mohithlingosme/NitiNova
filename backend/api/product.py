from __future__ import annotations

from fastapi import APIRouter

from backend.core.config import get_settings

router = APIRouter(prefix="/product", tags=["product"])


@router.get("/about")
def product_about():
    settings = get_settings()
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "edition": settings.product_edition,
        "deployment": settings.app_env,
        "support": {
            "email": settings.support_email,
            "docs_url": settings.docs_url,
            "sla_tier": settings.sla_tier,
        },
        "capabilities": {
            "rag": settings.enable_rag,
            "citation_verification": settings.enable_verification,
            "api_auth": True,
            "rate_limiting": True,
        },
    }
