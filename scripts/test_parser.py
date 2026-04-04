#!/usr/bin/env python3
"""Test Legal Parser for STEP 3 - raw OCR .txt -> structured JSON."""

import sys
import os
import json
import logging
from pathlib import Path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ocr_pipeline.parser import LegalParser

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SAMPLE_TXT = "data/output/sample_judgment.txt"
OUTPUT_DIR = "data/structured"

def test_parser():
    \"\"\"Test parse_txt on sample OCR text.\"\"\"
    # Ensure directories
    Path("data/output").mkdir(parents=True, exist_ok=True)
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
    
    if not os.path.exists(SAMPLE_TXT):
        print(f"❌ {SAMPLE_TXT} missing - created earlier by BLACKBOXAI")
        return
    
    parser = LegalParser()
    result = parser.parse_txt(SAMPLE_TXT, OUTPUT_DIR)
    
    output_file = Path(result['output'])
    
    # Validate
    assert output_file.exists(), f"Output not created: {output_file}"
    
    with open(output_file, 'r', encoding='utf-8') as f:
        structured = json.load(f)
    
    # Check schema
    required_keys = ['case_name', 'court', 'judges', 'date', 'facts', 'issues', 'arguments', 'judgement', 'citations']
    missing = [k for k in required_keys if k not in structured]
    assert not missing, f"Missing keys: {missing}"
    
    print(f"✅ STEP 3 PARSER TEST PASSED!")
    print(f"📄 Output: {output_file}")
    print(f"🏷️  Case: {structured.get('case_name', 'N/A')[:50]}...")
    print(f"👨‍⚖️ Judges: {len(structured.get('judges', []))}")
    print(f"📋 Sections: facts={len(str(stripped('facts')))}, issues={len(structured.get('issues', []))}")
    print(f"📚 Citations: {len(structured.get('citations', []))}")
    
    print(f"\n💡 View JSON: cat {output_file}")
    print(f"💡 Next: python scripts/test_ocr.py to process real PDFs")

if __name__ == "__main__":
    test_parser()

