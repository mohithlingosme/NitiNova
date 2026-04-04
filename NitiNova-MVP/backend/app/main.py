from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime
import json
import os

app = FastAPI(title="NitiNova MVP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

class Verification(BaseModel):
    match_type: str
    score: float
    verified: bool

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

# Load sample cases
with open('backend/data/cases.json', 'r') as f:
    cases = json.load(f)

@app.post("/query", response_model=ApiResponse)
async def query_endpoint(request: QueryRequest):
    # Mock RAG + LLM + verification
    request_id = f"req_{int(datetime.now().timestamp())}"
    
    answer = f"""Based on your query '{request.query}', the key precedent is Kesavananda Bharati v. State of Kerala (1973).
    
This established the Basic Structure doctrine of the Constitution. The case limited Parliament's amendment powers under Article 368."""

    citations = [
        Citation(
            raw="(1973) 4 SCC 225",
            canonical="Kesavananda Bharati v. State of Kerala, (1973) 4 SCC 225",
            case_name="Kesavananda Bharati v. State of Kerala",
            court="Supreme Court of India",
            date="24-Apr-1973",
            verification=Verification(match_type="exact", score=0.98, verified=True)
        )
    ]
    
    return ApiResponse(
        request_id=request_id,
        query=request.query,
        answer=answer,
        citations=citations,
        overall_confidence=0.95,
        unverified_count=0,
        processing_time_ms=1250.0
    )

@app.get("/")
def root():
    return {"message": "NitiNova MVP API - POST /query for verification"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

