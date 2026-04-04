#!/usr/bin/env python3
"""
Run NitiNova MVP backend.
"""
import os
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent / "app"))

import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

