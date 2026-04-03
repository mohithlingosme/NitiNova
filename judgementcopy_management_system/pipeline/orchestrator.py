"""
Pipeline orchestration: PDF -> cleaned text -> metadata -> sections -> LLM -> JSON output.
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

from .cleaner import TextCleaner
from .extractor import PDFExtractor
from .llm_local import LocalLLM
from .parser import MetadataParser
from .section_detector import SectionDetector
from .utils import discover_pdfs, write_json
from .validator import JSONValidator

logger = logging.getLogger(__name__)


class Orchestrator:
    def __init__(self, model: str = "mistral"):
        self.extractor = PDFExtractor()
        self.cleaner = TextCleaner()
        self.parser = MetadataParser()
        self.section_detector = SectionDetector()
        self.validator = JSONValidator(LocalLLM(model=model))

    def process_pdf(self, pdf_path: Path, output_dir: Path) -> Optional[Path]:
        pages = self.extractor.extract_text(pdf_path)
        if not pages:
            logger.error("Skipping %s: no pages extracted", pdf_path.name)
            return None
        text = self.cleaner.clean_pages(pages)
        metadata = self.parser.parse(text)
        sections = self.section_detector.detect(text)
        payload = {"metadata": metadata.__dict__, "sections": sections}

        llm_json = self.validator.generate_and_validate(payload)
        if not llm_json:
            logger.error("Failed to obtain valid JSON for %s", pdf_path.name)
            return None

        # merge metadata into final output
        llm_json.update(
            {
                "case_name": metadata.case_name,
                "citation": metadata.citation,
                "court": metadata.court,
                "date": metadata.date,
                "bench": metadata.bench,
            }
        )

        output_path = output_dir / f"{pdf_path.stem}.json"
        write_json(llm_json, output_path)
        logger.info("Saved %s", output_path)
        return output_path

    def process_batch(self, input_dir: Path, output_dir: Path) -> None:
        pdfs = discover_pdfs(input_dir)
        if not pdfs:
            logger.warning("No PDFs found in %s", input_dir)
            return
        for pdf in pdfs:
            try:
                self.process_pdf(pdf, output_dir)
            except Exception as err:  # noqa: BLE001
                logger.exception("Unexpected failure while processing %s: %s", pdf.name, err)

