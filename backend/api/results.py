from __future__ import annotations

import uuid

from fastapi import APIRouter, HTTPException

from backend.api import deps
from backend.models.schemas import ResultPayload

router = APIRouter(prefix="/results", tags=["results"])


@router.get("/{request_id}", response_model=ResultPayload)
def get_result(request_id: uuid.UUID):
    result = deps.get_result(request_id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    return ResultPayload(**result)
