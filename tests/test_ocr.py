import pytest
from pathlib import Path
import tempfile
from ocr_pipeline.ocr_engine import OCRPipeline

@pytest.fixture(scope="module")
def ocr_pipeline():
    return OCRPipeline()

def test_ocr_pipeline_txt_output(ocr_pipeline, sample_txt_file):
    """Test OCR generates text output file."""
    # Simulate PDF path with text file for unit test
    result = ocr_pipeline.process_pdf(str(sample_txt_file))
    
    output_path = Path(result['output'])
    assert output_path.exists(), f"Output file not created: {output_path}"
    assert output_path.stat().st_size > 100, "Output too small"
    assert 'method' in result
    assert result['pages'] > 0

def test_ocr_preprocess_image(ocr_pipeline):
    """Test image preprocessing works."""
    from PIL import Image
    img = Image.new('RGB', (100, 100), color='white')
    processed = ocr_pipeline.preprocess_image(img)
    assert processed.mode == 'L'  # Grayscale
    assert processed.size == (100, 100)

def test_ocr_empty_pdf(ocr_pipeline, tmp_path):
    """Edge case: empty PDF path."""
    empty_pdf = tmp_path / "empty.pdf"
    with pytest.raises((FileNotFoundError, Exception)):
        ocr_pipeline.process_pdf(str(empty_pdf))

def test_ocr_non_pdf(ocr_pipeline, sample_txt_file):
    """Test non-PDF input handled gracefully."""
    result = ocr_pipeline.process_pdf(str(sample_txt_file))  # txt as pdf
    assert 'output' in result

@pytest.mark.skip(reason="Requires actual PDF and pdf2image deps")
def test_full_pdf_ocr(ocr_pipeline):
    """Full PDF OCR test (manual run)."""
    pdf_path = "data/raw/download_1.pdf"
    if Path(pdf_path).exists():
        result = ocr_pipeline.process_pdf(pdf_path)
        assert len(result['output']) > 20  # Valid path

