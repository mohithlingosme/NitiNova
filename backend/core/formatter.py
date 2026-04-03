from typing import List, Dict
import uuid

from backend.models.schemas import FinalResponse, FormattedCitation, CitationVerification

class ResponseFormatter:
    """
    Formats the raw output from the RAG pipeline and Verification Engine
    into the final API response structure.
    """

    def format_response(
        self,
        request_id: uuid.UUID,
        query: str,
        answer: str,
        verified_citations: List[Dict],
        processing_time_ms: int,
        re_run_count: int = 0,
    ) -> FinalResponse:
        """
        Constructs the final response object.
        """
        formatted_citations = []
        unverified_count = 0
        total_score = 0

        for vc in verified_citations:
            is_verified = vc['status'] == 'verified'
            if not is_verified:
                unverified_count += 1
            
            total_score += vc['score']

            formatted_citations.append(
                FormattedCitation(
                    raw=vc['raw_citation'],
                    canonical=vc['matched_case']['canonical_citation'] if vc['matched_case'] else vc['raw_citation'],
                    case_name=vc['matched_case']['case_name'] if vc['matched_case'] else 'N/A',
                    court="Supreme Court of India", # Placeholder
                    date="N/A", # Placeholder
                    status="good_law", # Placeholder
                    verification=CitationVerification(
                        match_type=vc['status'],
                        score=vc['score'],
                        verified=is_verified,
                    ),
                )
            )

        overall_confidence = (total_score / len(verified_citations)) if verified_citations else 0

        return FinalResponse(
            request_id=request_id,
            query=query,
            answer=answer,
            citations=formatted_citations,
            overall_confidence=overall_confidence,
            unverified_count=unverified_count,
            processing_time_ms=processing_time_ms,
            re_run_count=re_run_count,
        )
