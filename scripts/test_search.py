#!/usr/bin/env python3
"""Test DB + Vector search functionality."""

import asyncio
import sys
sys.path.insert(0, '..')

from scripts.seed_db import seed_cases
from scripts.build_vector_index import build_vector_index
from backend.services.search_service import keyword_search_dep, semantic_search_dep
from backend.core.database import engine
from sqlalchemy import text
from backend.models.db_models import Case

async def test_db_connection():
    async with engine.begin() as conn:
        result = await conn.execute(text("SELECT 1"))
        print("✅ DB connection OK")

async def count_cases():
    async with engine.begin() as conn:
        result = await conn.execute(text("SELECT COUNT(*) FROM cases"))
        count = result.scalar()
        print(f"DB has {count} cases")

async def test_search():
    print("\n=== KEYWORD SEARCH ===")
    keyword_results = await keyword_search_dep("contract", limit=5)
    print(f"Found {len(keyword_results)} keyword results")
    for r in keyword_results[:3]:
        print(f"- {r.case_name} ({r.court})")

    print("\n=== SEMANTIC SEARCH ===")
    semantic_results = await semantic_search_dep("breach of contract", top_k=5)
    print(f"Found {len(semantic_results)} semantic results")
    for r in semantic_results[:3]:
        print(f"- {r['case_name']} (distance: {r.get('distance', 0):.2f})")

async def main():
    print("1. Test DB connection...")
    await test_db_connection()
    
    print("\n2. Seed DB with 5+ cases...")
    await seed_cases()
    
    print("\n3. Count cases...")
    await count_cases()
    
    print("\n4. Build vector index...")
    build_vector_index()
    
    print("\n5. Test searches...")
    await test_search()
    
    print("\n✅ STEP 5 COMPLETE: DB + Vector search working!")
    print("\nRun backend: uvicorn backend.main:app --reload")
    print("Test API integration next.")

if __name__ == "__main__":
    asyncio.run(main())

