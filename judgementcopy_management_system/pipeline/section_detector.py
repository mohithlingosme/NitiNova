"""
Rule-based section detection to minimize tokens sent to the LLM.
"""
from __future__ import annotations

import logging
import re
from typing import Dict, List, Tuple

logger = logging.getLogger(__name__)


class SectionDetector:
    HEADNOTE_KEY = "HEADNOTE"
    FACT_KEYWORDS = ("facts", "background", "brief facts")
    ISSUE_KEYWORDS = ("issue", "points for determination", "question")
    REASON_KEYWORDS = ("reasoning", "analysis", "discussion", "findings")

    def detect(self, text: str) -> Dict[str, str]:
        """
        Returns a dictionary with headnote (optional), facts, issues, reasoning,
        and key_paragraphs for LLM prompt selection.
        """
        lowered = text.lower()
        headnote = self._extract_headnote(text) if self.HEADNOTE_KEY.lower() in lowered else ""
        paragraphs = [p.strip() for p in re.split(r"\n{2,}", text) if p.strip()]

        def capture_by_keywords(keywords: Tuple[str, ...]) -> str:
            for i, para in enumerate(paragraphs):
                if any(k in para.lower() for k in keywords):
                    # take the paragraph and a couple following for context
                    snippet = "\n\n".join(paragraphs[i : min(len(paragraphs), i + 3)])
                    return snippet
            return ""

        facts = capture_by_keywords(self.FACT_KEYWORDS)
        issues = capture_by_keywords(self.ISSUE_KEYWORDS)
        reasoning = capture_by_keywords(self.REASON_KEYWORDS)

        key_paragraphs = self._select_key_paragraphs(paragraphs)

        return {
            "headnote": headnote,
            "facts": facts,
            "issues": issues,
            "reasoning": reasoning,
            "key_paragraphs": key_paragraphs,
        }

    def _extract_headnote(self, text: str) -> str:
        pattern = re.compile(r"HEADNOTE[:\s]+", re.IGNORECASE)
        m = pattern.search(text)
        if not m:
            return ""
        start = m.end()
        # assume headnote ends before first double newline after the marker
        remainder = text[start:]
        split = re.split(r"\n{2,}", remainder, maxsplit=1)
        return split[0].strip() if split else ""

    def _select_key_paragraphs(self, paragraphs: List[str], limit: int = 8) -> str:
        """
        Picks top paragraphs by presence of legal cue words and length.
        """
        cues = ("held", "therefore", "hence", "court", "tribunal", "appeal", "petition", "ratio")
        scored = []
        for para in paragraphs:
            score = sum(1 for c in cues if c in para.lower()) + min(len(para) // 400, 2)
            scored.append((score, para))
        scored.sort(key=lambda x: x[0], reverse=True)
        selected = [p for _, p in scored[:limit]]
        return "\n\n".join(selected)

