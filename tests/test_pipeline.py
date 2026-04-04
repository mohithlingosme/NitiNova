import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from backend.services.pipeline_service import PipelineService, handle_end_to_end_flow
from pathlib import Path

@pytest.fixture
def pipeline_service():
    return PipelineService()

@pytest.mark.asyncio
@patch.object(PipelineService, 'ocr')
@patch.object(PipelineService, 'parser')
@patch.object(PipelineService, 'llm')
async def test_pipeline_full_flow(mock_llm, mock_parser, mock_ocr, tmp_path, test_db_session):
    """Test complete pipeline with mocks."""
    # Mock chain
    mock_ocr.process_pdf.return_value = {'output': '/mock.txt'}
    mock_parser.parse_txt.return_value = {'output': '/mock.json'}
    mock_llm.process_case.return_value = MagicMock()
    
    pdf_path = tmp_path / "test.pdf"
    pdf_path.touch()
    
    service = PipelineService()
    result = await service.run_full_pipeline(str(pdf_path), test_db_session)
    
    assert result['success']
    assert 'case_id' in result
    mock_ocr.process_pdf.assert_called()
    mock_parser.parse_txt.assert_called()
    mock_llm.process_case.assert_called()

@pytest.mark.asyncio
async def test_pipeline_file_save(tmp_path):
    """Test PDF upload save."""
    service = PipelineService()
    pdf_bytes = b"%PDF test"
    filename = "test.pdf"
    
    file_path = await service.save_uploaded_pdf(pdf_bytes, filename)
    
    saved_path = Path(file_path)
    assert saved_path.exists()
    assert saved_path.name == filename
    assert saved_path.read_bytes() == pdf_bytes
    assert 'data/input' in str(saved_path.parent)

def test_pipeline_handles_ocr_failure():
    """Test pipeline graceful failure."""
    service = PipelineService()
    with patch.object(service.ocr, 'process_pdf', side_effect=Exception("OCR fail")):
        result = asyncio.run(service.run_full_pipeline("bad.pdf", AsyncMock()))
        assert not result['success']
        assert 'error' in result

@pytest.mark.asyncio
async def test_end_to_end_handler():
    """Test convenience handler."""
    with patch('backend.services.pipeline_service.pipeline_service', AsyncMock()):
        result = await handle_end_to_end_flow("test.pdf")
        assert isinstance(result, dict)

