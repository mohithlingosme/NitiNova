from rapidfuzz import process, fuzz
from typing import List, Dict, Optional
from backend.models.schemas import MatchResult

class CitationMatcher:
    """
    Matches extracted citations against a database of known citations.
    """

    def __init__(self, citations_db: List[Dict]):
        """
        Initializes the CitationMatcher with a mock database of citations.
        In a real application, this would connect to a database.
        """
        self.citations_db = citations_db
        self.citation_texts = [c['canonical_citation'] for c in citations_db]

    def match(self, raw_citation: str) -> MatchResult:
        """
        Matches a raw citation against the database.
        """
        # 1. Exact match
        for case in self.citations_db:
            if raw_citation == case['canonical_citation']:
                return MatchResult(
                    raw_citation=raw_citation,
                    matched_case=case,
                    match_type="exact",
                    score=1.0
                )

        # 2. Fuzzy match
        # Using rapidfuzz to find the best match
        best_match = process.extractOne(raw_citation, self.citation_texts, scorer=fuzz.WRatio)
        
        if best_match and best_match[1] > 80: # Using a threshold of 80
            matched_case = next((c for c in self.citations_db if c['canonical_citation'] == best_match[0]), None)
            return MatchResult(
                raw_citation=raw_citation,
                matched_case=matched_case,
                match_type="partial",
                score=best_match[1] / 100.0
            )
            
        return MatchResult(
            raw_citation=raw_citation,
            matched_case=None,
            match_type="not_found",
            score=0.0
        )

# Example Usage:
if __name__ == '__main__':
    mock_db = [
        {"case_id": "1", "canonical_citation": "2023 INSC 456", "case_name": "State of Maharashtra v. John Doe"},
        {"case_id": "2", "canonical_citation": "(2020) 8 SCC 1", "case_name": "State of Punjab v. Davinder Singh"},
    ]
    
    matcher = CitationMatcher(mock_db)
    
    # Test exact match
    exact_citation = "2023 INSC 456"
    result = matcher.match(exact_citation)
    print(f"Matching '{exact_citation}': {result}")

    # Test partial match
    partial_citation = "2023 INSC 455" # Slight typo
    result = matcher.match(partial_citation)
    print(f"Matching '{partial_citation}': {result}")
    
    # Test no match
    no_match_citation = "1999 XYZ 123"
    result = matcher.match(no_match_citation)
    print(f"Matching '{no_match_citation}': {result}")

