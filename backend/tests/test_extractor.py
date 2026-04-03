import pytest
from backend.verification.extractor import CitationExtractor

@pytest.fixture
def extractor():
    return CitationExtractor()

def test_extract_all_citation_types(extractor):
    sample_text = (
        "As held in the case of State of Punjab v. Davinder Singh, (2020) 8 SCC 1, "
        "the court laid down the principles of equal pay for equal work. "
        "This was further clarified in AIR 2021 SC 123. The neutral citation is 2023 INSC 456. "
        "Also refer to [1986] 1 SCR 25."
    )
    citations = extractor.extract(sample_text)
    assert len(citations) == 4
    assert citations[0].text == "(2020) 8 SCC 1"
    assert citations[1].text == "AIR 2021 SC 123"
    assert citations[2].text == "2023 INSC 456"
    assert citations[3].text == "[1986] 1 SCR 25"

def test_no_citations(extractor):
    text = "This is a sample text with no legal citations."
    citations = extractor.extract(text)
    assert len(citations) == 0

def test_citation_at_start(extractor):
    text = "2023 INSC 456 is a neutral citation."
    citations = extractor.extract(text)
    assert len(citations) == 1
    assert citations[0].text == "2023 INSC 456"

def test_citation_at_end(extractor):
    text = "A neutral citation is 2023 INSC 456"
    citations = extractor.extract(text)
    assert len(citations) == 1
    assert citations[0].text == "2023 INSC 456"
