from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import List, Optional, Literal

from pydantic import BaseModel, Field
from .db_models import VerificationLog as DBVerificationLog


class Role(str, Enum):
    free = "free"
    pro = "pro"
    admin = "admin"


class User(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    email: str
    hashed_password: str
    role: Role = Role.free
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserPublic(BaseModel):
    id: uuid.UUID
    email: str
    role: Role
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RegisterRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class QueryRequest(BaseModel):
    query: str = Field(min_length=3, max_length=2000)
    jurisdiction: Optional[str] = None
    year_range: Optional[List[int]] = None


class Citation(BaseModel):
    raw: str
    canonical: Optional[str] = None
    case_name: Optional[str] = None
    court: Optional[str] = None
    date: Optional[str] = None
    status: Optional[str] = None
    match_type: Optional[str] = None
    score: Optional[float] = None
    warning: Optional[str] = None


class ResultPayload(BaseModel):
    request_id: uuid.UUID
    query: str
    answer: str
    citations: List[Citation]
    overall_confidence: float
    unverified_count: int
    processing_time_ms: int
    re_run_count: int


class VerifyRequest(BaseModel):
    citation: str


class VerifyResponse(BaseModel):
    citation: str
    status: str
    score: float
    matched_case: Optional[Citation] = None


class MatchResult(BaseModel):
    raw_citation: str
    matched_case: Optional[dict]  # Using dict for now, will be a Case model
    match_type: Literal["exact", "partial", "not_found"]
    score: float


class VerificationLog(BaseModel):
    id: uuid.UUID
    request_id: uuid.UUID
    raw_citation: str
    matched_case_id: Optional[uuid.UUID]
    match_type: Optional[str]
    score: Optional[float]
    re_run_count: int
    final_status: Optional[str]
    verified_at: datetime

    class Config:
        orm_mode = True


class CitationVerification(BaseModel):
    match_type: str
    score: float
    verified: bool
    warning: Optional[str] = None


class FormattedCitation(BaseModel):
    raw: str
    canonical: str
    case_name: str
    court: str
    date: str
    status: str
    verification: CitationVerification


class FinalResponse(BaseModel):
    request_id: uuid.UUID
    query: str
    answer: str
    citations: List[FormattedCitation]
    overall_confidence: float
    unverified_count: int
    processing_time_ms: int
    re_run_count: int
