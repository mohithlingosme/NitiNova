import asyncio
from typing import List, Dict, Any
from sqlalchemy import text, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.database import get_db
from backend.rag.retriever import RAGRetriever
from backend.models.db_models import Case

async def keyword_search(query: str, db: AsyncSession, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Keyword search using SQL LIKE on case_name, court, summary.
    """
    like_query = f"%{query}%"
    result = await db.execute(
        text("""
            SELECT id, case_name, court, summary, ratio 
            FROM cases 
            WHERE case_name ILIKE :q 
               OR court ILIKE :q 
               OR summary ILIKE :q 
            ORDER BY case_name 
            LIMIT :limit
        """),
        {"q": like_query, "limit": limit}
    )
    return result.fetchall()

async def semantic_search(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Semantic vector search using FAISS retriever.
    """
    retriever = RAGRetriever()
    results = retriever.retrieve(query, top_k=top_k)
    # Map to case-like dict (retriever returns chunks, extract case info)
    cases = []
    for res in results:
        doc = res['document']
        cases.append({
            'case_name': doc.get('case_name', 'Unknown'),
            'citation': doc.get('citation', 'Unknown'),
            'court': doc.get('court', 'Unknown'),
            'summary': doc.get('text', '')[:200] + '...' if 'text' in doc else '',
            'distance': res.get('distance', 0.0),
            'rrf_score': res.get('rrf_score', 0.0)
        })
    return cases

# Dependency-injected versions
async def keyword_search_dep(query: str, limit: int = 10):
    async for db in get_db():
        return await keyword_search(query, db, limit)

async def semantic_search_dep(query: str, top_k: int = 5):
    return await semantic_search(query, top_k)

if __name__ == "__main__":
    async def test():
        print("Keyword search:", await keyword_search_dep("contract"))
        print("Semantic search:", await semantic_search_dep("breach of contract"))
    asyncio.run(test())

