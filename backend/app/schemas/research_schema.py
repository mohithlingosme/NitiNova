from pydantic import BaseModel
from typing import List, Optional

class ResearchQuery(BaseModel):
    query: str
    court: Optional[str] = "Supreme Court"
    citation_type: Optional[str] = "SCC"
    limit: int = 10

class ResearchResult(BaseModel):
    title: str
    citation: str
    summary: str
    verified: bool
    score: float

class ResearchResponse(BaseModel):
    results: List[ResearchResult]
    total_found: int
    search_time: float

