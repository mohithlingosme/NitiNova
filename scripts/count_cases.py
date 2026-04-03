#!/usr/bin/env python3
\"\"\"Count and analyze SCI judgments coverage.\"\"\"

import os
from pathlib import Path
from collections import Counter
import json

ARCHIVE_DIR = Path(__file__).parent.parent / 'data' / 'archive (1)' / 'supreme_court_judgments'
RAW_DIR = Path(__file__).parent.parent / 'data' / 'raw'

def count_by_year(dir_path):
    counts = Counter()
    benches = Counter()
    for year_dir in dir_path.iterdir():
        if year_dir.is_dir() and year_dir.name.isdigit():
            count = len(list(year_dir.glob('*.pdf')))
            counts[year_dir.name] = count
            # Sample bench parse (full in pipeline)
            benches[year_dir.name] = 'TBD (parse PDFs)'
    return counts, benches

print('Archive Coverage:')
archive_counts, archive_benches = count_by_year(ARCHIVE_DIR)
total_archive = sum(archive_counts.values())
print(json.dumps({'years': dict(archive_counts), 'total': total_archive, 'benches_sample': dict(archive_benches)}, indent=2))

print('\\nRaw Coverage:')
raw_counts = len(list(RAW_DIR.glob('*.pdf')))
print(f'Total raw PDFs: {raw_counts}')

