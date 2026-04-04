#!/usr/bin/env python3
"""Test LLM Pipeline (STEP 4) - structured JSON -> enriched JSON"""

import sys
import os
import json
from pathlib import Path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.llm_service import LLMService
from backend.models.schemas import StructuredCaseInput

SAMPLE_STRUCTURED = "data/structured/sample_state_xyz.json"
ENRICHED_PATH = "data/enriched"

    def test_llm():
        """Test LLM enrichment pipeline."""

    # Load structured input
    if not Path(SAMPLE_STRUCTURED).exists():
        print(f"❌ {SAMPLE_STRUCTURED} missing. Run `python scripts/test_parser.py` first!")
        return
    
    with open(SAMPLE_STRUCTURED, 'r') as f:
        data = json.load(f)
    
    case = StructuredCaseInput(**data)
    print(f"📄 Processing: {case.case_name}")
    
    # LLM process
    service = LLMService()
    enriched = service.process_case(case)
    
    enriched_file = Path(ENRICHED_PATH) / f"{'_'.join(case.case_name.split()[:3])}.json"
    print(f"✅ ENRICHED: {enriched.summary[:100]}...")
    print(f"📋 Issues: {len(enriched.issues)}")
    print(f"💾 Saved: {enriched_file}")
    print(f"\n🌐 API Test: curl -X POST http://localhost:8000/api/process -H 'Content-Type: application/json' -d '@{SAMPLE_STRUCTURED}'")
    print(f"💡 Run server: uvicorn backend.main:app --reload --port 8000")
    print(f"🔑 Set OPENAI_API_KEY in .env")

if __name__ == '__main__':
    test_llm()

