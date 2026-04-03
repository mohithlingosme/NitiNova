from __future__ import annotations

import os
from typing import List

from openai import OpenAI

from backend.rag.retriever import RetrievedCase


class LLMService:
    """
    Uses OpenAI if key is present; otherwise falls back to a deterministic template.
    """

    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key else None

    def generate(self, query: str, cases: List[RetrievedCase]) -> str:
        if not self.client:
            return self._fallback_answer(query, cases)

        cases_text = "\n".join(
            f"- {c.case_name} ({c.citations[0] if c.citations else 'n/a'}): {c.held}"
            for c in cases
        )
        prompt = f"""You are a legal assistant. Answer ONLY using the provided cases.

Question:
{query}

Cases:
{cases_text}

Return a concise answer that cites the cases."""
        completion = self.client.responses.create(
            model="gpt-4.1-mini",
            input=prompt,
            max_output_tokens=300,
        )
        return completion.output[0].content[0].text

    def _fallback_answer(self, query: str, cases: List[RetrievedCase]) -> str:
        if not cases:
            return "No supporting cases found in the local dataset."
        parts = [f"Based on {cases[0].case_name} ({', '.join(cases[0].citations)}): {cases[0].held}"]
        if len(cases) > 1:
            parts.append(f"Additional support from {', '.join(c.case_name for c in cases[1:])}.")
        return " ".join(parts)
