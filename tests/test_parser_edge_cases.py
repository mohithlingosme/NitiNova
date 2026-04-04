import pytest
import json
from pathlib import Path
from ocr_pipeline.parser import LegalParser
from unittest.mock import patch

def test_parser_basic(sample_txt_file):
    """Basic parser test."""
    parser = LegalParser()
    result = parser.parse_txt(str(sample_txt_file))
    
    output_path = Path(result['output'])
    assert output_path.exists()
    
    data = json.loads(output_path.read_text())
    assert 'case_name' in data
    assert data['case_name']  # Not empty

def test_parser_edge_empty():
    """Test parser handles empty input."""
    parser = LegalParser()
    empty_file = Path('tests/empty.txt')
    empty_file.write_text('')
    try:
        result = parser.parse_txt(str(empty_file))
        assert Path(result['output']).exists()
    finally:
        empty_file.unlink()

@pytest.mark.parametrize("bad_text", [
    "garbage!!!@#$%^&*()",
    "NO FACTS NO ISSUES",
    "\n\n\n"
])
def test_parser_robust(tmp_path, bad_text):
    """Test parser handles bad input."""
    bad_file = tmp_path / "bad.txt"
    bad_file.write_text(bad_text)
    parser = LegalParser()
    result = parser.parse_txt(str(bad_file))
    assert Path(result['output']).exists()


