import pytest
import json
from pathlib import Path
from ocr_pipeline.parser import LegalParser
import tempfile

def test_parser_extracts_fields(sample_txt_file):
    """Test parser extracts basic fields."""
    parser = LegalParser()
    result = parser.parse_txt(str(sample_txt_file))
    
    output_path = Path(result['output'])
    data = json.loads(output_path.read_text())
    
    assert 'case_name' in data
    assert data['case_name']  # Non-empty
    assert 'court' in data
    assert 'facts' in data
    assert isinstance(data.get('issues', []), list)

def test_parser_entities(sample_txt_file):
    """Test entity extraction."""
    parser = LegalParser()
    result = parser.parse_txt(str(sample_txt_file))
    data = json.loads(Path(result['output']).read_text())
    
    assert 'entities' in data
    entities = data['entities']
    assert any(k in entities for k in ['judges', 'acts_cited', 'cases_cited'])

def test_parser_sections(sample_txt_file):
    """Test section splitting."""
    parser = LegalParser()
    result = parser.parse_txt(str(sample_txt_file))
    data = json.loads(Path(result['output']).read_text())
    
    sections = data['sections']
    assert isinstance(sections, list)
    assert len(sections) > 0

def test_parser_corrupted_text():
    """Edge case: corrupted OCR text."""
    parser = LegalParser()
    corrupt_file = Path(tempfile.mktemp(suffix='.txt'))
    corrupt_file.write_text("GARBAGE\n\n\n@#$%^&*")
    
    try:
        result = parser.parse_txt(str(corrupt_file))
        assert Path(result['output']).exists()
        data = json.loads(Path(result['output']).read_text())
        assert 'case_name' in data  # Graceful fallback
    finally:
        if corrupt_file.exists():
            corrupt_file.unlink()

def test_parser_missing_fields(sample_txt_file):
    """Test handles missing sections."""
    # Truncate sample to miss sections
    short_content = "CASE NAME ONLY"
    short_file = Path(tempfile.mktemp(suffix='.txt'))
    short_file.write_text(short_content)
    
    try:
        parser = LegalParser()
        result = parser.parse_txt(str(short_file))
        data = json.loads(Path(result['output']).read_text())
        assert data['facts'] == '' or data['facts'] is not None  # Handles missing
    finally:
        short_file.unlink()

