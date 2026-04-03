from __future__ import annotations

import argparse
from pathlib import Path

from pipeline.orchestrator import Orchestrator
from pipeline.utils import setup_logging


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Offline judgment -> JSON pipeline")
    parser.add_argument("--input", required=True, help="Folder containing PDF files")
    parser.add_argument("--output", required=True, help="Folder to write JSON files")
    parser.add_argument("--model", default="mistral", help="Ollama model name")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    setup_logging()
    orchestrator = Orchestrator(model=args.model)
    orchestrator.process_batch(Path(args.input), Path(args.output))


if __name__ == "__main__":
    main()

