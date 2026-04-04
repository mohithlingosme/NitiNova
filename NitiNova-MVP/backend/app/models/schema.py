from pydantic import BaseModel
from typing import List
from datetime import datetime

class QueryRequest(BaseModel):
    query: str

class Verification(BaseModel):
    match_type: str
    score: float
    verified: bool
    warning: str | None = None

class Citation(BaseModel):
    raw: str
    canonical: str
    case_name: str
    court: str
    date: str
    verification: Verification

class ApiResponse(BaseModel):
    request_id: str
    query: str
    answer: str
    citations: List[Citation]
    overall_confidence: float
    unverified_count: int
    processing_time_ms: float

