from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health():
    # In real deployment, add DB/vector/LLM checks
    return {"status": "ok", "components": {"db": "mock", "vector": "mock", "llm": "mock"}}
