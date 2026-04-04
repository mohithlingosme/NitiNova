from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
import logging
import uuid
from pathlib import Path

logger = logging.getLogger(__name__)

from backend.api.deps import get_db, get_current_user
from backend.core.crud import get_case
from backend.core.database import get_db
from backend.models.schemas import UserPublic
from pydantic import BaseModel

class ProcessRequest(BaseModel):
    file_path: str

class ProcessResponse(BaseModel):
    task_id: str
    status: str
    file_path: str
    message: str

class SearchRequest(BaseModel):
    q: str
    type: str = "semantic"
    limit: int = 10

class SearchResponse(BaseModel):
    results: list

class CaseResponse(BaseModel):
    case_name: str

from backend.services.pipeline_service import handle_end_to_end_flow
from backend.services.search_service import keyword_search_dep, semantic_search_dep

router = APIRouter(prefix="/pipeline", tags=["Pipeline"])

@router.post("/upload", response_model=dict)
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: UserPublic = Depends(get_current_user)
):
    \"\"\"Upload PDF file, save to data/input, return file_path.\"\"\"
    if not file.content_type == "application/pdf":
        raise HTTPException(status_code=400, detail="File must be PDF")
    
    pdf_bytes = await file.read()
    file_path = Path("data/input") / file.filename
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, "wb") as f:
        f.write(pdf_bytes)
    logger.info(f"Saved uploaded PDF: {file_path}")
    
    return {"file_path": file_path, "message": "File uploaded successfully"}

@router.post("/process", response_model=ProcessResponse)
async def process_pdf(
    request: ProcessRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: UserPublic = Depends(get_current_user)
):
    \"\"\"Process PDF: OCR → Parse → LLM → Store → Embed. Runs async.\"\"\"
    # Validate file
    if not Path(request.file_path).exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    task_id = uuid.uuid4()
    
    async def run_pipeline():
        try:
            result = await handle_end_to_end_flow(request.file_path)
            logger.info(f"Task {task_id} completed: {result}")
        except Exception as e:
            logger.error(f"Task {task_id} failed: {e}")
    
    background_tasks.add_task(run_pipeline)
    
    return ProcessResponse(
        task_id=task_id,
        status="processing",
        file_path=request.file_path,
        message="Pipeline started in background"
    )

@router.get("/search", response_model=SearchResponse)
async def search_cases(
    q: str = Query(..., min_length=1),
    type: str = Query("semantic", regex="^(keyword|semantic)$"),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: UserPublic = Depends(get_current_user)
):
    \"\"\"Search cases by keyword or semantic similarity.\"\"\"
    if type == "keyword":
        results = await keyword_search_dep(q, limit)
    else:
        results = await semantic_search_dep(q, limit)
    
    return SearchResponse(results=results)

@router.get("/case/{case_id}", response_model=CaseResponse)
async def get_case_detail(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: UserPublic = Depends(get_current_user)
):
    \"\"\"Get full case details by ID.\"\"\"
    case = await get_case(db, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return CaseResponse.from_orm(case)  # Or dict(case)

# Task status endpoint (bonus)
@router.get("/task/{task_id}", response_model=dict)
async def get_task_status(task_id: str):
    # TODO: Redis/task queue for status
    return {"task_id": task_id, "status": "completed"}  # Placeholder

