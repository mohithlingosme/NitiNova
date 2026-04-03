import re

class CitationNormaliser:
    """
    Normalises different legal citation formats to a canonical form.
    """

    def __init__(self):
        # Maps raw citations to a canonical form.
        self.citation_index = {}

    def normalise(self, raw_citation):
        """
        Converts a raw citation string to a canonical format.
        """
        # Attempt to match known formats in a specific order.
        if self._is_air_format(raw_citation):
            return self._normalise_air(raw_citation)
        elif self._is_scc_format(raw_citation):
            return self._normalise_scc(raw_citation)
        elif self._is_scr_format(raw_citation):
            return self._normalise_scr(raw_citation)
        elif self._is_neutral_citation(raw_citation):
            return self._normalise_neutral(raw_citation)
        else:
            # If no format matches, return the original citation.
            # In a real system, you might add more sophisticated fuzzy matching here.
            return raw_citation

    def build_index(self, case_id, citations):
        """
        Builds a lookup index for citations.
        """
        for citation in citations:
            canonical_form = self.normalise(citation)
            self.citation_index[canonical_form] = case_id

    def _is_air_format(self, citation):
        """Checks for All India Reporter (AIR) format."""
        return re.match(r'AIR \d{4} SC \d+', citation)

    def _normalise_air(self, citation):
        """Normalises AIR format."""
        # For now, we'll consider the AIR format as canonical if found.
        return citation

    def _is_scc_format(self, citation):
        """Checks for Supreme Court Cases (SCC) format."""
        return re.match(r'\(\d{4}\) \d+ SCC \d+', citation)

    def _normalise_scc(self, citation):
        """Normalises SCC format."""
        # Placeholder for conversion logic.
        return citation

    def _is_scr_format(self, citation):
        """Checks for Supreme Court Reports (SCR) format."""
        return re.match(r'\[\d{4}\] \d+ SCR \d+', citation)

    def _normalise_scr(self, citation):
        """Normalises SCR format."""
        # Placeholder for conversion logic.
        return citation

    def _is_neutral_citation(self, citation):
        """Checks for neutral citation format."""
        return re.match(r'\d{4} INSC \d+', citation)

    def _normalise_neutral(self, citation):
        """Normalises neutral citation format."""
        # Placeholder for conversion logic.
        return citation

# Example Usage:
if __name__ == '__main__':
    normaliser = CitationNormaliser()
    
    citations = [
        "AIR 1980 SC 17",
        "(1978) 4 SCC 494",
        "[1950] 1 SCR 88",
        "2023 INSC 100"
    ]

    for c in citations:
        print(f"'{c}' -> '{normaliser.normalise(c)}'")
