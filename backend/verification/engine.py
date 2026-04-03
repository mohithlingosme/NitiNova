import uuid
from typing import List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from backend.verification.extractor import CitationExtractor
from backend.verification.matcher import CitationMatcher
from backend.verification.scorer import ScoringEngine
from backend.core import crud

class VerificationEngine:
    """
    Orchestrates the citation verification process.
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        self.extractor = CitationExtractor()
        
        # Using a mock citation database for now
        mock_db = [
            {"case_id": "1", "canonical_citation": "2023 INSC 456", "case_name": "State of Maharashtra v. John Doe"},
            {"case_id": "2", "canonical_citation": "(2020) 8 SCC 1", "case_name": "State of Punjab v. Davinder Singh"},
        ]
        self.matcher = CitationMatcher(mock_db)
        self.scorer = ScoringEngine()

    async def verify(self, request_id: uuid.UUID, llm_output: str) -> Dict:
        """
        Runs the full verification process on the output of an LLM.
        """
        # 1. Extract citations
        raw_citations = self.extractor.extract(llm_output)
        
        # 2. Match citations
        match_results = [self.matcher.match(c.text) for c in raw_citations]
        
        # 3. Score citations
        scored_results = self.scorer.score(match_results)
        
        # 4. Log results to the audit trail
        for res in scored_results:
            log_data = {
                "request_id": request_id,
                "raw_citation": res['raw_citation'],
                "matched_case_id": res['matched_case']['case_id'] if res['matched_case'] else None,
                "match_type": res['status'],
                "score": res['score'],
                "final_status": res['status']
            }
            await crud.create_verification_log(self.db, log_data=log_data)
            
        # 5. Check if a re-run is needed
        needs_rerun = self.scorer.needs_rerun(scored_results)
        
        return {
            "verified_citations": scored_results,
            "needs_rerun": needs_rerun
        }
