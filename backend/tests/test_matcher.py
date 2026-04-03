import pytest
from backend.verification.matcher import CitationMatcher

@pytest.fixture
def mock_db():
    return [
        {"case_id": "1", "canonical_citation": "2023 INSC 456", "case_name": "State of Maharashtra v. John Doe"},
        {"case_id": "2", "canonical_citation": "(2020) 8 SCC 1", "case_name": "State of Punjab v. Davinder Singh"},
    ]

@pytest.fixture
def matcher(mock_db):
    return CitationMatcher(mock_db)

def test_exact_match(matcher):
    result = matcher.match("2023 INSC 456")
    assert result.match_type == "exact"
    assert result.score == 1.0
    assert result.matched_case['case_id'] == "1"

def test_partial_match(matcher):
    result = matcher.match("2023 INSC 455") # Typo
    assert result.match_type == "partial"
    assert result.score > 0.8
    assert result.matched_case['case_id'] == "1"

def test_no_match(matcher):
    result = matcher.match("1999 XYZ 123")
    assert result.match_type == "not_found"
    assert result.score == 0.0
    assert result.matched_case is None
