#!/usr/bin/env python3
\"\"\"Bulk download Supreme Court judgments from sci.gov.in (1950-2025).\"\"\"

import os
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import argparse
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = 'https://sci.gov.in'
RAW_DIR = Path(__file__).parent.parent / 'data' / 'raw'
ARCHIVE_DIR = RAW_DIR.parent / 'archive (1)' / 'supreme_court_judgments'

def download_pdf(url, filepath):
    headers = {'User-Agent': 'Mozilla/5.0 (compatible; NitiNova/1.0)'}
    resp = requests.get(url, headers=headers, timeout=30)
    if resp.status_code == 200:
        with open(filepath, 'wb') as f:
            f.write(resp.content)
        logger.info(f'Downloaded: {filepath.name}')
        return True
    logger.warning(f'Failed {url}: {resp.status_code}')
    return False

def scrape_year(year):
    archive_year = ARCHIVE_DIR / str(year)
    archive_year.mkdir(exist_ok=True)
    
    # Example: Browse recent judgments page (adapt for historical)
    # sci.gov.in structure: /recent-judgments /judgement-search (params: from_date, to_date)
    search_url = urljoin(BASE_URL, f'/judgement-search/?from_date={year}-01-01&to_date={year}-12-31')
    resp = requests.get(search_url, timeout=30)
    soup = BeautifulSoup(resp.text, 'html.parser')
    
    links = soup.find_all('a', href=lambda h: h and ('pdf' in h.lower() or 'judgment' in h.lower()))
    for a in links[:50]:  # Limit per year for testing
        pdf_url = urljoin(BASE_URL, a['href'])
        filename = Path(urlparse(pdf_url).path).name or f'{year}_judgment.pdf'
        filepath = archive_year / filename
        if not filepath.exists():
            if download_pdf(pdf_url, filepath):
                time.sleep(1)  # Rate limit

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--start_year', type=int, default=1950)
    parser.add_argument('--end_year', type=int, default=2025)
    args = parser.parse_args()
    
    RAW_DIR.mkdir(exist_ok=True)
    ARCHIVE_DIR.mkdir(exist_ok=True)
    
    for year in range(args.start_year, args.end_year + 1):
        logger.info(f'Scraping {year}...')
        scrape_year(year)

