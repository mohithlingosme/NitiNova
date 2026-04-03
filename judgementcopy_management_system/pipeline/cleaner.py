"""
Lightweight cleaners tailored for noisy Indian court judgments.
"""
from __future__ import annotations

import re
from typing import List


PAGE_NUMBER_LINE = re.compile(r"^\s*\d+\s*$")
HEADER_FOOTER = re.compile(r"^\s*(IN THE|BEFORE THE).{0,40}(COURT|HIGH COURT|SUPREME COURT)", re.IGNORECASE)
MULTISPACE = re.compile(r"[ \t]{2,}")


class TextCleaner:
    def clean_pages(self, pages: List[str]) -> str:
        """
        Remove obvious noise while preserving paragraph breaks.
        """
        cleaned_lines: List[str] = []
        for page in pages:
            for raw_line in page.splitlines():
                line = raw_line.strip()
                if not line:
                    continue
                if PAGE_NUMBER_LINE.match(line):
                    continue
                if HEADER_FOOTER.match(line):
                    # drop likely repeated headers
                    continue
                line = MULTISPACE.sub(" ", line)
                cleaned_lines.append(line)
            cleaned_lines.append("")  # page break -> blank line
        text = "\n".join(cleaned_lines)
        # normalize multiple blank lines
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

