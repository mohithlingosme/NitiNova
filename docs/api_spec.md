# API Specification

## /api/v1/research/search POST
Verified case law search.

**Body:**
```json
{
  "query": "fundamental rights article 21",
  "court": "Supreme Court",
  "citation_type": "SCC"
}
```

**Response:**
```json
{
  "results": [...],
  "verified_citations": 5,
  "score": 0.92
}
```

More endpoints coming...

