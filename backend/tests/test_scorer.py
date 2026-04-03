import pytest
from backend.verification.scorer import ScoringEngine
from backend.models.schemas import MatchResult

@pytest.fixture
def scorer():
    return ScoringEngine()

def test_scoring(scorer):
    results = [
        MatchResult(raw_citation="2023 INSC 456", matched_case={"case_id": "1"}, match_type="exact", score=1.0),
        MatchResult(raw_citation="2023 INSC 455", matched_case={"case_id": "1"}, match_type="partial", score=0.95),
        MatchResult(raw_citation="1999 XYZ 123", matched_case=None, match_type="not_found", score=0.0),
    ]
    scored_results = scorer.score(results)
    assert scored_results[0]['status'] == 'verified'
    assert scored_results[1]['status'] == 'partial'
    assert scored_results[2]['status'] == 'unverified'

def test_needs_rerun(scorer):
    results = [
        {"status": "verified"},
        {"status": "partial"},
    ]
    assert not scorer.needs_rerun(results)
    
    results.append({"status": "unverified"})
    assert scorer.needs_rerun(results)
