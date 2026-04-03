"""
PDF text extraction layer using PyMuPDF (fitz).
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import List

import fitz  # type: ignore

logger = logging.getLogger(__name__)


class PDFExtractor:
    def extract_text(self, pdf_path: Path) -> List[str]:
        """
        Returns list of page strings. Skips pages that fail extraction but continues.
        """
        pages: List[str] = []
        try:
            with fitz.open(pdf_path) as doc:
                for i, page in enumerate(doc):
                    try:
                        pages.append(page.get_text("text"))
                    except Exception as page_err:  # noqa: BLE001
                        logger.warning("Failed to extract page %s in %s: %s", i + 1, pdf_path.name, page_err)
        except Exception as err:  # noqa: BLE001
            logger.error("Could not open PDF %s: %s", pdf_path, err)
            return []
        return pages

