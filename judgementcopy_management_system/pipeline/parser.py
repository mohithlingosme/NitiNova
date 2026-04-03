"""
Metadata parsing using regex with simple fallbacks.
"""
from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from typing import List, Optional

logger = logging.getLogger(__name__)


DATE_RE = re.compile(r"(?:(\d{1,2})[\\/.\-\s])?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*[\\/.\-\s]?(\d{2,4})",
                     re.IGNORECASE)
CITATION_RE = re.compile(r"\((\d{4})\)\s*\d+\s*[A-Z.]+\s*\d+")
COURT_RE = re.compile(r"(SUPREME COURT OF INDIA|DELHI HIGH COURT|BOMBAY HIGH COURT|MADRAS HIGH COURT)", re.IGNORECASE)
BENCH_RE = re.compile(r"Coram[:\-]\s*(.+)", re.IGNORECASE)
CASE_NAME_RE = re.compile(r"([A-Z][A-Za-z0-9 .,&/]+ v\.?s?\.? [A-Z][A-Za-z0-9 .,&/]+)", re.IGNORECASE)


@dataclass
class Metadata:
    case_name: str = ""
    date: str = ""
    citation: str = ""
    court: str = ""
    bench: List[str] = None  # type: ignore


class MetadataParser:
    def parse(self, text: str) -> Metadata:
        meta = Metadata(bench=[])
        meta.case_name = self._first_match(CASE_NAME_RE, text) or ""
        meta.citation = self._first_match(CITATION_RE, text) or ""
        meta.court = self._first_match(COURT_RE, text) or ""
        meta.date = self._extract_date(text)
        bench = self._first_match(BENCH_RE, text)
        if bench:
            meta.bench = [p.strip() for p in re.split(r"[,&]|\band\b", bench) if p.strip()]
        return meta

    def _first_match(self, pattern: re.Pattern, text: str) -> Optional[str]:
        m = pattern.search(text)
        return m.group(0) if m else None

    def _extract_date(self, text: str) -> str:
        m = DATE_RE.search(text[:2000])
        if not m:
            return ""
        day, mon, year = m.groups()
        day = day or "01"
        month_map = {
            "jan": "01", "feb": "02", "mar": "03", "apr": "04", "may": "05", "jun": "06",
            "jul": "07", "aug": "08", "sep": "09", "sept": "09", "oct": "10", "nov": "11", "dec": "12",
        }
        month = month_map.get(mon.lower()[:3], "01")
        year = year if len(year) == 4 else f"20{year}"
        return f"{year}-{month}-{int(day):02d}"

