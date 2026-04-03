"""
Utility helpers for the judgment processing pipeline.
"""
from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Iterable, List


LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s - %(message)s"
DEFAULT_LOG_PATH = Path("logs/pipeline.log")


def setup_logging(log_path: Path = DEFAULT_LOG_PATH, level: int = logging.INFO) -> None:
    """
    Configure a rotating file logger and stderr handler.
    """
    log_path.parent.mkdir(parents=True, exist_ok=True)
    handlers = [
        RotatingFileHandler(log_path, maxBytes=2 * 1024 * 1024, backupCount=3),
        logging.StreamHandler(),
    ]
    logging.basicConfig(level=level, format=LOG_FORMAT, handlers=handlers, force=True)


def discover_pdfs(input_dir: Path) -> List[Path]:
    """
    Return all PDF files in the directory (non-recursive) sorted by name.
    """
    return sorted(p for p in input_dir.glob("*.pdf") if p.is_file())


def write_json(data: dict, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


@dataclass
class RetryConfig:
    attempts: int = 3
    backoff_seconds: float = 0.5

