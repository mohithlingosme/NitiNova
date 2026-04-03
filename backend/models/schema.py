from __future__ import annotations

from typing import List

from pydantic import BaseModel


class QueryRequest(BaseModel):
    query: str


class SupportingCase(BaseModel):
    case_id: str
    case_name: str
    citations: List[str]
    court: str
    year: int
    held: str
    facts: str
    score: float


class VerificationResult(BaseModel):
    verified: bool
    matched_cases: List[str]


class QueryResponse(BaseModel):
    query: str
    answer: str
    supporting_cases: List[SupportingCase]
    verification: VerificationResult
