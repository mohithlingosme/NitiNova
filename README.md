# NitiNova — Legal AI Verification Platform

**Verified Legal Intelligence for India** — Eliminating hallucinated citations, one query at a time.

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [System Architecture](#system-architecture)
- [Core Modules](#core-modules)
- [Request Lifecycle](#request-lifecycle)
- [API Reference](#api-reference)
- [Verification Scoring](#verification-scoring)
- [Legal Dataset](#legal-dataset)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Data Pipeline](#data-pipeline)
- [Running with Docker](#running-with-docker)
- [Roadmap](#roadmap)
- [Project Status](#project-status)
- [Next Steps](#next-steps)
- [Contributing](#contributing)
- [License & IP](#license--ip)

## Overview

**NitiNova** is a Legal AI Verification SaaS platform for the Indian legal ecosystem. It processes natural language legal queries via RAG (Retrieval-Augmented Generation), generates AI responses, and **verifies every citation** against a curated Supreme Court database before delivery.

Target users:
- Lawyers, advocates, law firms
- Judiciary clerks, researchers
- Law students for case research

## Problem Statement

Legal AI tools often hallucinate fake case citations, risking court penalties and reputational damage. NitiNova's **verification engine** acts as a firewall, ensuring only validated references reach users.

## System Architecture

```
Frontend (React/Vite/TS) ── HTTP ── Backend (FastAPI/Python)
                                    │
                                    ├─ RAG (Pinecone/FAISS + OpenAI)
                                    ├─ Verification (matcher/scorer)
                                    └─ DB (Postgres/Redis)
```

| Component | Tech |
|-----------|------|
| Frontend | React 19, Vite 6, TailwindCSS 4 |
| Backend | FastAPI 0.115, SQLAlchemy 2 |
| Vector DB | Pinecone / FAISS-CPU |
| LLM | OpenAI / Gemini |
| DB/Cache | Postgres 15, Redis |
| Data Processing | Pandas, Sentence-Transformers |

## Core Modules

1. **Query Processing**: Normalize input -> RAG retrieval.
2. **RAG Pipeline**: Embed query, retrieve contexts (backend/rag/).
3. **Verification Engine** (key feature): Extract citations (extractor.py), match (matcher.py), score (scorer.py) against DB.
4. **Response Formatter**: JSON output w/ verified citations (core/formatter.py).

## Request Lifecycle

1. User query (frontend -> /api/query)
2. RAG generation (retriever.py)
3. Citation extraction & verification
4. Score & validate (>0.4 pass)
5. Formatted response

## API Reference

Base: `http://localhost:8000/api`

| Endpoint | Method | Desc |
|----------|--------|------|
| /health | GET | System status |
| /query | POST | Submit query `{"query": "str"}` |
| /results/{id} | GET | Fetch results |
| /verify | POST | Verify citations |

Example:
```bash
curl -X POST http://localhost:8000/api/query -H "Content-Type: application/json" -d '{"query": "Article 21 rights"}'
```

## Verification Scoring

| Type | Score | Action |
|------|-------|--------|
| Exact | ≥0.9 | Pass |
| Partial | 0.5-0.8 | Warn |
| Fail | <0.4 | Re-generate |

## Legal Dataset

Primary: SCI.gov.in (1950-2025, ~150k judgments, public domain).  
Scripts: download_sci.py -> ingest_raw.py -> build_vector_index.py.  
See [data/SOURCES.md](data/SOURCES.md).

## Tech Stack

See requirements.txt, package.json.

## Repository Structure

```
NitiNova/
├── README.md                 # This doc
├── TODO.md                   # Build steps tracker
├── TODO_README.md            # README tracking
├── requirements.txt          # Backend deps
├── package.json              # Frontend deps
├── docker-compose.yml        # Full stack
├── backend/                  # FastAPI (api/, core/, rag/, models/, verification/)
│   ├── main.py
│   └── ...
├── src/                      # React app (components/, pages/, services/)
│   ├── App.tsx
│   └── ...
├── scripts/                  # Data (download_sci.py, parse_judgments.py, etc.)
├── data/                     # Dataset (raw/, processed/, SOURCES.md)
├── alembic/                  # Migrations
├── judgementcopy_management_system/ # Legacy pipeline
└── docs/                     # Planning PDFs
```

(Full scaffold ready for Phase 1.)

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker Desktop (optional)

### 1. Clone & Setup
```bash
git clone https://github.com/mohithlingosme/NitiNova.git
cd "NitiNova Final product"
```

### 2. Backend
```bash
python -m venv .venv
.venv/Scripts/activate  # Windows
pip install -r requirements.txt
```

### 3. Frontend
```bash
npm install
```

### 4. Env Setup
Copy `.env.example` to `.env` (create if missing):
```
OPENAI_API_KEY=your_key
DATABASE_URL=postgresql://user:pass@localhost:5432/nitinova
REDIS_URL=redis://localhost:6379
PINECONE_API_KEY=your_key
```

### 5. Run Local
**Backend:**
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend (new tab):**
```bash
npm run dev
```
Frontend: http://localhost:3000  
Backend/API: http://localhost:8000/docs (Swagger)

## Environment Variables

| Var | Desc | Example |
|-----|------|---------|
| OPENAI_API_KEY | LLM access | sk-... |
| GEMINI_API_KEY | Alt LLM | ... |
| DATABASE_URL | Postgres | postgresql://... |
| REDIS_URL | Cache | redis://... |
| PINECONE_API_KEY | Vector DB | ... |

## Data Pipeline

1. `python scripts/download_sci.py` # Fetch SCI PDFs
2. `python scripts/ingest_raw.py` # Process to JSON
3. `python scripts/build_vector_index.py` # Embed to Pinecone/FAISS
4. `python scripts/seed_db.py` # DB seed

## Running with Docker

```bash
docker compose up -d --build
```
- Frontend: :3000
- Backend: :8000
- DB: :5432
- Redis: :6379

`docker compose logs -f` for monitoring.

## Roadmap

**Phase 0 (Setup)**: 80% [scaffold complete]  
**Phase 1 (MVP)**: RAG + verification  
**Phase 2**: Drafting tools, High Courts  
See TODO.md for details.

## Project Status

**Oct 2024**: Phase 0 ~80% (full scaffold, deps pinned, Docker ready). Dataset ingest next.  
Recent: Verification modules (scorer/matcher), React components.  
Track: [TODO.md](TODO.md)

## Next Steps

1. Dataset ingest (scripts/).
2. DB migrations (`alembic upgrade head`).
3. Test verification engine.
See [TODO.md](TODO.md) Phase 0.2+.

## Contributing

Proprietary dev project. See repo: https://github.com/mohithlingosme/NitiNova  
Refer TODO.md for active tasks.

## License & IP

Proprietary. Dev: Mohith M for Team Tattva Taraka. Non-exclusive license granted.

---
*Updated: Oct 2024 v2.0 | Complete setup instructions added*

