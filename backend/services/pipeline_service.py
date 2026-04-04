import os
import uuid
import asyncio
import logging
from pathlib import Path
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.models.schemas import StructuredCaseInput, EnrichedCase
from backend.services.llm_service import LLMService
from backend.services.search_service import semantic_search
from backend.core.crud import create_case, get_case  # Will be added
from backend.core.embedding_service import EmbeddingService  # Assume exists or use RAG
from ocr_pipeline.ocr_engine import OCRPipeline
from ocr_pipeline.parser import LegalParser

logger = logging.getLogger(__name__)

class PipelineService:
    def __init__(self):
        self.ocr = OCRPipeline()
        self.parser = LegalParser()
        self.llm = LLMService()
        self.embedding_service = EmbeddingService()  # Or from core

    async def save_uploaded_pdf(self, pdf_bytes: bytes, filename: str = None) -> str:
        """Save uploaded PDF to data/input/."""
        input_dir = Path('data/input')
        input_dir.mkdir(parents=True, exist_ok=True)
        
        if not filename:
            filename = f"{uuid.uuid4()}.pdf"
        file_path = input_dir / filename
        
        with open(file_path, 'wb') as f:
            f.write(pdf_bytes)
        
        logger.info(f"Saved PDF: {file_path}")
        return str(file_path)

    async def run_full_pipeline(self, pdf_path: str, db: AsyncSession) -> Dict[str, Any]:
        """End-to-end: PDF → OCR → Parse → LLM → DB → Embeddings."""
        try:
            # 1. OCR
            logger.info(f"Step 1/5: OCR {pdf_path}")
            ocr_result = self.ocr.process_pdf(pdf_path)
            txt_path = ocr_result['output']
            
            # 2. Parse
            logger.info(f"Step 2/5: Parse {txt_path}")
            parse_result = self.parser.parse_txt(txt_path)
            structured_data = parse_result  # Assume dict with case_name, court, facts, etc.
            
            # Convert to StructuredCaseInput
            structured_case = StructuredCaseInput(
                case_name=structured_data.get('case_name', 'Unknown'),
                court=structured_data.get('court', 'Unknown'),
                judges=structured_data.get('judges', []),
                date=structured_data.get('date', ''),
                facts=structured_data.get('facts', ''),
                issues=structured_data.get('issues', []),
                arguments=structured_data.get('arguments', {}),
                judgement=structured_data.get('judgement', ''),
                citations=structured_data.get('citations', []),
                full_text=structured_data.get('full_text', '')
            )
            
            # 3. LLM Enrich
            logger.info("Step 3/5: LLM Enrichment")
            enriched_case = self.llm.process_case(structured_case)
            
            # 4. Store in DB
            logger.info("Step 4/5: Store in DB")
            case_record = await create_case(db, enriched_case)
            case_id = case_record.id
            
            # 5. Generate embeddings
            logger.info("Step 5/5: Generate embeddings")
            await self.embedding_service.embed_and_store(case_id, enriched_case.summary)
            
            logger.info(f"✅ Pipeline complete. Case ID: {case_id}")
            return {
                "success": True,
                "case_id": str(case_id),
                "case_name": structured_case.case_name,
                "status": "completed"
            }
            
        except Exception as e:
            logger.error(f"Pipeline failed: {str(e)}", exc_info=True)
            return {"success": False, "error": str(e), "status": "failed"}

# Global instance
pipeline_service = PipelineService()

async def handle_end_to_end_flow(pdf_path: str):
    """Convenience function."""
    async for db in get_db():
        return await pipeline_service.run_full_pipeline(pdf_path, db)

