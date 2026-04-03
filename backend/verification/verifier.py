from __future__ import annotations

from typing import List, Dict

from backend.rag.retriever import RetrievedCase


class Verifier:
    """
    Simple verifier: checks if returned cases exist in dataset.
    """

    def verify_response(self, supporting: List[RetrievedCase], dataset: List[dict]) -> Dict:
        ids = {c.get("case_id") for c in dataset}
        matched = [c.case_id for c in supporting if c.case_id in ids]
        return {
            "verified": len(matched) == len(supporting) and len(supporting) > 0,
            "matched_cases": matched,
        }
