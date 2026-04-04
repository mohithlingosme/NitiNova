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

    # Load sample cases or use hardcoded LLM-enriched
    cases_file = Path(__file__).parent.parent / 'data' / 'cases.json'
    sample_cases = []
    if cases_file.exists():
        try:
            with open(cases_file, 'r') as f:
                sample_cases = json.load(f)
            print(f"Loaded {len(sample_cases)} cases from data/cases.json")
        except Exception as e:
            print(f"Error loading cases.json: {e}")
    if len(sample_cases) < 5:
        print("Using hardcoded LLM-enriched cases for testing...")
        hardcoded_cases = [
            {
                "case_name": "State of Maharashtra v. John Doe",
                "court": "Supreme Court of India",
                "year": 2023,
                "bench": ["Justice A.K. Singh", "Justice B.C. Patel"],
                "facts": """The Narcotics Control Bureau seized a vehicle used in drug trafficking. 
The Allahabad High Court released the vehicle to the owner pending trial, reasoning that long detention would cause hardship.
The state filed SLP challenging the release order.""",
                "held": """SLP admitted. High Court order stayed. The vehicle is primary evidence in NDPS case.
Release before trial conclusion would prejudice prosecution. Matter listed for final hearing after 4 weeks.""",
                "citations": ["2023 INSC 456", "(2023) 7 SCC 123"]
            },
            {
                "case_name": "State of Punjab v. Davinder Pal Singh",
                "court": "Supreme Court of India",
                "year": 2020,
                "bench": ["Justice D.Y. Chandrachud", "Justice Indu Malhotra"],
                "facts": """Daily wage workers with Municipal Corporation doing same work as regular employees but paid less.
Claimed equal pay for equal work under Article 39(d).""",
                "held": """Equal pay for equal work is constitutional right. Daily wagers cannot be paid 1/3rd wages for same work.
Corporations directed to pay arrears and regularize services.""",
                "citations": ["(2020) 8 SCC 1", "2020 INSC 321"]
            },
            {
                "case_name": "Union of India v. M. Zacharia",
                "court": "Supreme Court of India",
                "year": 2022,
                "bench": ["Justice Sanjiv Khanna"],
                "facts": """Government contract for supply of goods. Supplier failed to deliver, government terminated and forfeited EMD.
Supplier challenged forfeiture.""",
                "held": """Earnest money forfeiture valid for breach. No notice required for commercial contracts when terms clear.
Supplier barred by estoppel from challenging.""",
                "citations": ["2022 INSC 789"]
            },
            {
                "case_name": "State v. Rajesh Kumar",
                "court": "Delhi High Court",
                "year": 2021,
                "bench": ["Justice C. Hari Shankar"],
                "facts": """Accused charged u/s 376 IPC. Trial court acquitted citing insufficient medical evidence and delays.
State appealed.""",
                "held": """Acquittal set aside. Medical evidence corroborative not conclusive. Victim testimony reliable.
Conviction u/s 376 restored.""",
                "citations": ["2021 Delhi HC 456"]
            },
            {
                "case_name": "PQR Ltd. v. DEF Corporation",
                "court": "Supreme Court of India",
                "year": 2019,
                "bench": ["Justice R.F. Nariman", "Justice Vineet Saran"],
                "facts": """Company issued debentures. Defaulted on payment. Debenture trustees sued for recovery.
Company challenged trustee appointment.""",
                "held": """Debenture trustees have locus to sue for investors. Directors personally liable for fraudulent inducement.
Criminal proceedings also maintainable.""",
                "citations": ["(2019) 5 SCC 678", "2019 INSC 234"]
            }
        ]
        sample_cases = hardcoded_cases
        print(f"Seeding with {len(sample_cases)} cases")

    async with engine.begin() as conn:
        for case_data in sample_cases:
            facts = case_data.get('facts', '')
            judgement = case_data.get('held', facts)
            summary = (facts + ' ' + judgement)[:500] + '...' if facts or judgement else 'Case summary'
            issues = [f"Legal issue: {facts[:100]}"] if facts else ['Main legal issue']
            arguments = "Appellant argued violation of law based on facts. Respondent defended actions."
            ratio = "Core ratio: Court applied established principles to facts." if judgement else 'Key principle'
            citations_list = case_data.get('citations', [])
            year = int(case_data.get('year', 2024))

            case = Case(
                case_name=case_data['case_name'],
                court=case_data['court'],
                judges=case_data.get('bench', []),
                date=datetime(year, 1, 1),
                facts=facts,
                issues=issues,
                arguments=arguments,
                judgement=judgement,
                citations=citations_list,
                summary=summary,
                ratio=ratio,
                subject_tags=['constitutional', 'contract', 'criminal'],
                case_status='good_law',
                source_url=case_data.get('url', f"https://example.com/{case_data.get('case_name', 'case')}")
            )
            conn.add(case)
            await conn.flush()

            # Add citation index
            try:
                normalizer = CitationNormaliser()
                for cit in citations_list:
                    normalized = normalizer.normalize(cit)
                    citation_index = CitationIndex(
                        raw_citation=cit,
                        case_id=case.id,
                        confidence=1.0,
                    )
                    conn.add(citation_index)
            except Exception as e:
                print(f"Skipped citation index for {case.case_name}: {e}")

        await conn.commit()
        print(f"Seeded {len(sample_cases)} sample cases.")

if __name__ == '__main__':
    asyncio.run(seed_cases())
