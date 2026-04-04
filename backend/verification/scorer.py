from typing import List, Dict
import logging
from backend.models.schemas import MatchResult

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ScoringEngine:

    """
    Applies a scoring scheme to the results of the CitationMatcher.
    """

    def score(self, match_results: List[MatchResult]) -> List[Dict]:
        """
        Scores a list of MatchResult objects and determines the verification status.
        """
        verification_results = []
        
        for result in match_results:
            status = "unverified"
            if result.match_type == "exact" and result.score >= 0.9:
                status = "verified"
            elif result.match_type == "partial" and result.score > 0.8: # Using the same threshold as the matcher
                status = "partial"
            
            verification_results.append({
                "raw_citation": result.raw_citation,
                "matched_case": result.matched_case,
                "status": status,
                "score": result.score
            })
            
        return verification_results

    def needs_rerun(self, verification_results: List[Dict]) -> bool:
        """
        Determines if the RAG pipeline needs to be re-run based on the verification results.
        """
        # Re-run if any citation is unverified
        for result in verification_results:
            if result['status'] == 'unverified':
                # Placeholder for re-run logic
                logger.warning("A citation was unverified. Triggering re-run...")
                return True
        return False

# Example Usage:
if __name__ == '__main__':
    scorer = ScoringEngine()

    # Mock MatchResult objects
    results = [
        MatchResult(raw_citation="2023 INSC 456", matched_case={"case_id": "1"}, match_type="exact", score=1.0),
        MatchResult(raw_citation="2023 INSC 455", matched_case={"case_id": "1"}, match_type="partial", score=0.95),
        MatchResult(raw_citation="1999 XYZ 123", matched_case=None, match_type="not_found", score=0.0),
    ]

    scored_results = scorer.score(results)
    print("Scored Results:")
    for res in scored_results:
        print(res)
    
    if scorer.needs_rerun(scored_results):
        print("\nRe-run is needed.")
    else:
        print("\nNo re-run is needed.")
