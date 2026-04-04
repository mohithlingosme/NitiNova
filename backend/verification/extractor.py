import re
import logging
from typing import List, NamedTuple

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RawCitation(NamedTuple):
    text: str
    start: int
    end: int

class CitationExtractor:
    """
    Extracts candidate legal citations from raw text using regex patterns.
    """

    def __init__(self):
        # Regex patterns for various Indian legal citation formats
        self.patterns = {
            "AIR": r"AIR \d{4} SC \d+",
            "SCC": r"\(\d{4}\) \d+ SCC \d+",
            "INSC": r"\d{4} INSC \d+",
            "SCR": r"\[\d{4}\] \d+ SCR \d+",
        }
        # Combine all patterns into a single regex for efficient searching
        self.combined_pattern = re.compile("|".join(self.patterns.values()))

    def extract(self, text: str) -> List[RawCitation]:
        """
        Parses raw text and extracts all matching citations.

        Args:
            text: The raw text output from the LLM.

        Returns:
            A list of RawCitation objects found in the text.
        """
        citations = []
        for match in self.combined_pattern.finditer(text):
            citations.append(
                RawCitation(
                    text=match.group(0),
                    start=match.start(),
                    end=match.end(),
                )
            )
        return citations

# Example Usage:
if __name__ == '__main__':
    extractor = CitationExtractor()
    sample_text = (
        "As held in the case of State of Punjab v. Davinder Singh, (2020) 8 SCC 1, "
        "the court laid down the principles of equal pay for equal work. "
        "This was further clarified in AIR 2021 SC 123. The neutral citation is 2023 INSC 456. "
        "Also refer to [1986] 1 SCR 25."
    )
    
    extracted_citations = extractor.extract(sample_text)
    
    print(f"Found {len(extracted_citations)} citations:")
    for citation in extracted_citations:
        print(f"- Text: '{citation.text}', Start: {citation.start}, End: {citation.end}")

    # Test with no citations
    no_citation_text = "This is a sample text with no legal citations."
    print(f"\nTesting with text containing no citations...")
    extracted_citations = extractor.extract(no_citation_text)
    print(f"Found {len(extracted_citations)} citations.")

