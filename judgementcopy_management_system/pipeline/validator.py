"""
Validation of LLM outputs with retry support.
"""
from __future__ import annotations

import logging
import time
from typing import Dict, Optional

from .llm_local import LocalLLM
from .utils import RetryConfig

logger = logging.getLogger(__name__)

REQUIRED_FIELDS = {
    "facts": str,
    "procedural_history": str,
    "issues": list,
    "arguments": dict,
    "judgment_summary": str,
    "reasoning": str,
    "ratio": str,
    "legal_principles": list,
    "final_order": str,
    "citations": list,
}


class JSONValidator:
    def __init__(self, llm: LocalLLM, retry: RetryConfig = RetryConfig()):
        self.llm = llm
        self.retry = retry

    def generate_and_validate(self, payload: Dict) -> Optional[dict]:
        for attempt in range(1, self.retry.attempts + 1):
            result = self.llm.generate(payload)
            if result and self._is_valid(result):
                return result
            logger.warning("LLM output invalid (attempt %s/%s)", attempt, self.retry.attempts)
            time.sleep(self.retry.backoff_seconds * attempt)
        return None

    def _is_valid(self, data: dict) -> bool:
        for field, expected_type in REQUIRED_FIELDS.items():
            if field not in data:
                return False
            if not isinstance(data[field], expected_type):
                return False
        # nested arguments keys
        args = data.get("arguments", {})
        if not all(k in args for k in ("petitioner", "respondent")):
            return False
        return True

