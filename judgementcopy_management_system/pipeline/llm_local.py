"""
Wrapper for local Ollama text generation.
"""
from __future__ import annotations

import json
import logging
from typing import Dict, Optional

import requests

logger = logging.getLogger(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"

SYSTEM_PROMPT = """You are a legal judgment structuring assistant.
Given excerpts from an Indian court judgment, extract and return ONLY strict JSON with the fields:
facts, procedural_history, issues (list), arguments {petitioner, respondent},
judgment_summary, reasoning, ratio, legal_principles (list), final_order, citations (list).
Do not add extra keys, do not include explanations, and ensure valid JSON."""


class LocalLLM:
    def __init__(self, model: str = "mistral"):
        self.model = model

    def generate(self, payload: Dict) -> Optional[dict]:
        """
        payload contains metadata and sections to be sent to the LLM.
        """
        prompt = self._build_prompt(payload)
        body = {"model": self.model, "prompt": prompt, "stream": False}
        try:
            resp = requests.post(OLLAMA_URL, json=body, timeout=120)
            resp.raise_for_status()
            data = resp.json()
            text = data.get("response") or data.get("output") or ""
            return self._extract_json(text)
        except Exception as err:  # noqa: BLE001
            logger.error("Ollama call failed: %s", err)
            return None

    def _build_prompt(self, payload: Dict) -> str:
        meta = payload.get("metadata", {})
        sections = payload.get("sections", {})
        parts = [
            SYSTEM_PROMPT,
            "Metadata:",
            json.dumps(meta, ensure_ascii=False, indent=2),
            "Sections:",
        ]
        for key, value in sections.items():
            if not value:
                continue
            parts.append(f"{key.upper()}:\n{value}\n")
        parts.append("Return JSON only.")
        return "\n\n".join(parts)

    def _extract_json(self, text: str) -> Optional[dict]:
        try:
            # text may include leading/trailing noise; find first { ... }
            start = text.find("{")
            end = text.rfind("}")
            if start == -1 or end == -1 or end <= start:
                return None
            return json.loads(text[start : end + 1])
        except json.JSONDecodeError:
            logger.warning("Received invalid JSON from LLM.")
            return None

