import time
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.schemas import QueryRequest, FinalResponse
from backend.rag.pipeline import RAGPipeline
from backend.api.deps import get_current_user
from backend.models.schemas import UserPublic
from backend.core.database import get_db
from backend.verification.engine import VerificationEngine
from backend.core.formatter import ResponseFormatter

router = APIRouter()

@router.post("/query", response_model=FinalResponse)
async def submit_query(
    payload: QueryRequest, 
    current_user: UserPublic = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    start_time = time.time()
    request_id = uuid.uuid4()
    
    # 1. RAG Pipeline
    pipeline = RAGPipeline()
    rag_result = pipeline.run(payload.query)
    
    # Placeholder for LLM answer
    llm_answer = rag_result['answer']

    # 2. Verification Engine
    verification_engine = VerificationEngine(db)
    verification_result = await verification_engine.verify(request_id, llm_answer)
    
    # 3. Response Formatter
    formatter = ResponseFormatter()
    processing_time_ms = int((time.time() - start_time) * 1000)
    
    return formatter.format_response(
        request_id=request_id,
        query=payload.query,
        answer=llm_answer,
        verified_citations=verification_result['verified_citations'],
        processing_time_ms=processing_time_ms,
    )
