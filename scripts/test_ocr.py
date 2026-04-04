#!/usr/bin/env python3
"""
Test OCR Pipeline on sample judgment PDF.
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pathlib import Path
from ocr_pipeline.ocr_engine import OCRPipeline
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_ocr_pipeline():
    pdf_path = "data/raw/download_1.pdf"
    if not Path(pdf_path).exists():
        print(f"❌ Test PDF not found: {pdf_path}")
        print("Available: check data/raw/")
        return False
    
    print(f"🚀 Testing OCR on {pdf_path}")
    pipeline = OCRPipeline()
    result = pipeline.process_pdf(pdf_path, output_dir="data/processed")
    
    print("✅ OCR Complete:", result)
    
    output_file = Path(result['output'])
    if output_file.exists() and output_file.stat().st_size > 1000:
        print(f"✅ Output saved: {output_file}")
        print(f"📊 Chars: {result.get('char_count', 0):,}")
        return True
    else:
        print("❌ Output too small or missing")
        return False

if __name__ == '__main__':
    success = test_ocr_pipeline()
    sys.exit(0 if success else 1)

