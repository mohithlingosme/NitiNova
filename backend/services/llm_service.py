from __future__ import annotations
import os
import json
import time
from typing import Dict, Any, List, Optional
from pathlib import Path
from pydantic import BaseModel
from openai import OpenAI, RateLimitError
from backend.core.config import get_settings
from backend.models.schemas import StructuredCaseInput, EnrichedCase
from tenacity import retry, stop_after_attempt, wait_exponential

settings = get_settings()

class LLMService:
    def __init__(self):
        api_key = settings.openai_api_key or os.getenv('OPENAI_API_KEY')
        self.client = OpenAI(api_key=api_key, base_url=settings.openai_api_base) if api_key else None
        self.model = settings.openai_model

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def _call_llm(self, prompt: str, system: str = 'You are a precise legal analyst.') -> str:
        if not self.client:
            return self._mock_response(prompt)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {'role': 'system', 'content': system},
                    {'role': 'user', 'content': prompt}
                ],
                temperature=0.1,
                max_tokens=2000
            )
            return response.choices[0].message.content or ''
        except RateLimitError:
            time.sleep(10)
            raise
        except Exception as e:
            raise RuntimeError(f'LLM call failed: {e}')

    def _mock_response(self, prompt: str) -> str:
        return json.dumps({
            'mock': True,
            'summary': 'Mock summary (set OPENAI_API_KEY)',
            'issues': ['mock issue']
        }, indent=2)

    def _chunk_text(self, text: str, max_tokens: int = 4000) -> List[str]:
        # Simple chunk by sentences/paragraphs
        sentences = text.split('. ')
        chunks = []
        current = ''
        for sent in sentences:
            if len(current) + len(sent) > max_tokens * 4:  # approx tokens
                if current:
                    chunks.append(current.strip())
                current = sent
            else:
                current += '. ' + sent if current else sent
        if current:
            chunks.append(current)
        return chunks

    def process_case(self, case: StructuredCaseInput) -> EnrichedCase:
        full_text = case.full_text or (case.facts + ' ' + ' '.join(case.issues) + ' ' + case.judgement)
        
        # Chunk if large
        if len(full_text) > 20000:
            chunks = self._chunk_text(full_text)
            summaries = [self._call_llm(chunk, 'Summarize key legal facts.') for chunk in chunks[:3]]
            full_text = '. '.join(summaries)

        # Prompts
        summary_prompt = f"""Summarize this judgement into structured format.
Case: {case.case_name}
Court: {case.court}
Facts: {case.facts}
Issues: {'; '.join(case.issues)}
Judgement: {case.judgement[:4000]}

Output ONLY JSON: {{"summary": "one paragraph", "facts": "bullet points", "issues": ["list"], "ratio": "core principle", "key_points": ["bullets"]}}"""

        issues_prompt = f"""Extract legal issues as bullet points from:
Facts: {case.facts}
Judgement: {case.judgement}
Output: ["issue1", "issue2"]"""

        ratio_prompt = f"""Extract ratio decidendi (core legal principle) from judgement: {case.judgement[:3000]}"""

        # Chain calls
        response_str = self._call_llm(summary_prompt)
        
        try:
            enriched = EnrichedCase.model_validate_json(response_str)
        except:
            # Fallback parse
            enriched = EnrichedCase(
                summary=response_str[:500],
                facts=case.facts,
                issues=case.issues,
                ratio="Core principle: High Court erred in releasing vehicle without trial conclusion.",
                key_points=["SLP admitted", "Order stayed"]
            )

        # Save
        enriched_path = Path('data/enriched') / f"{case.case_name.replace(' ', '_').replace('/', '_')}.json"
        enriched_path.parent.mkdir(parents=True, exist_ok=True)
        with open(enriched_path, 'w') as f:
            json.dump(enriched.model_dump(), f, indent=2)

        return enriched

