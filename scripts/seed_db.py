#!/usr/bin/env python3
\"\"\"Seed the database with sample cases for testing.\"\"\"

import asyncio
import json
from pathlib import Path
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine

from backend.core.database import engine
from backend.models.db_models import Base, Case, CitationIndex
from backend.rag.citation_normalizer import CitationNormaliser

async def seed_cases():
    # Create tables if not exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Load sample cases
    cases_file = Path(__file__).parent.parent / 'data' / 'cases.json'
    with open(cases_file) as f:
        sample_cases = json.load(f)

    async with engine.begin() as conn:
        for case_data in sample_cases:
            case = Case(
                case_name=case_data['case_name'],
                canonical_citation=case_data['citations'][0] if case_data['citations'] else 'unknown',
                alternate_citations=case_data['citations'],
                court=case_data['court'],
                judgment_date=datetime(year=case_data['year'], month=1, day=1),
                judges=case_data['bench'],
                subject_tags=['constitutional'],
                full_text=case_data['facts'] + case_data['held'],
                case_status='good_law',
            )
            conn.add(case)

            # Add citation index
            normalizer = CitationNormaliser()
            for cit in case_data['citations']:
                normalized = normalizer.normalize(cit)
                citation_index = CitationIndex(
                    raw_citation=cit,
                    case_id=case.id,
                    confidence=1.0,
                )
                conn.add(citation_index)

        await conn.commit()
        print(f"Seeded {len(sample_cases)} sample cases.")

if __name__ == '__main__':
    asyncio.run(seed_cases())
