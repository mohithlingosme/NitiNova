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
- [Roadmap](#roadmap)
- [Development Timeline](#development-timeline)
- [Project Status Report (as of Apr 1, 2026)](#project-status-report-as-of-apr-1-2026)
- [Current Status](#current-status)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Next Steps](#next-steps)
- [Contributing](#contributing)
- [License & IP](#license--ip)

---

## Overview

**NitiNova** is a Legal AI Verification SaaS platform built for the Indian legal ecosystem. It accepts natural language legal queries, generates AI-powered responses via a RAG (Retrieval-Augmented Generation) pipeline, and validates every case citation against a curated legal database — before surfacing results to the user.

The platform is purpose-built for:
- **Legal professionals** — lawyers, advocates, and law firm associates
- **Judiciary clerks and researchers** — requiring reliable, citable precedents
- **Law students** — for case research and argument building

---

## Problem Statement

Existing legal AI tools suffer from a critical flaw: they generate plausible-sounding but **fabricated case citations** — commonly known as "hallucinations." This exposes users to:

- Court penalties for citing non-existent judgments
- Reputational damage to legal professionals
- Compliance violations in formal submissions

NitiNova addresses this by introducing a **post-generation verification layer** that acts as a firewall against fake or unverifiable legal references.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│              (PHP + CSS + JavaScript)                   │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  Backend (Python)                       │
│              REST API — FastAPI / Django                │
└──────┬────────────────────────────────┬─────────────────┘
       │                                │
┌──────▼──────────┐          ┌──────────▼──────────────┐
│   RAG Pipeline  │          │   Verification Engine   │
│ Vector DB +     │          │  Citation Validation    │
│ LLM (via API)   │          │  Confidence Scoring     │
└──────┬──────────┘          └──────────┬──────────────┘
       │                                │
┌──────▼────────────────────────────────▼──────────────┐
│              Legal Dataset                           │
│      Supreme Court Precedents (1950–2025)            │
└──────────────────────────────────────────────────────┘
```

| Layer              | Technology                          |
|--------------------|-------------------------------------|
| Frontend           | PHP, CSS, JavaScript                |
| Backend            | Python (FastAPI / Django)           |
| RAG Layer          | Vector Database + Retriever         |
| AI Integration     | OpenAI / Claude / Open-source LLMs  |
| Legal Dataset      | Supreme Court Precedents (1950–2025)|
| Verification Engine| Custom citation validation module   |
| Response Formatter | JSON-based structured output        |
| Database           | PostgreSQL / Pinecone / FAISS       |
| Cloud              | AWS / GCP / Azure                   |

---

## Core Modules

### Module 1 — Query Processing
- Accepts raw natural language legal queries
- Normalises input (lowercasing, punctuation, legal term standardisation)
- Forwards the processed query to the backend pipeline

### Module 2 — RAG Pipeline
- Converts queries into **vector embeddings**
- Retrieves semantically relevant documents from the Vector Database
- Injects retrieved context into the LLM prompt
- Supports **hybrid search** — keyword + semantic
- Metadata tagging by court, year, and topic

### Module 3 — Verification Engine *(Core Differentiator)*
The verification engine validates every citation present in the LLM-generated response before surfacing results.

**Current validation checks:**
- Case name accuracy
- Citation format correctness
- Jurisdiction validation

**Planned (future patch):**
- Obiter Dictum classification
- Ratio Decidendi extraction
- Additional precedent metadata

### Module 4 — Response Formatter
- Receives validated output from the verification engine
- Formats into a clean, structured JSON payload
- Delivers the final result to the frontend

### Module 5 — Legal Drafting *(Phase 2)*
- Petition drafting and legal notice generation
- Contract templates with verified citation injection
- Export to DOCX and PDF

### Module 6 — Research & Analysis Tools *(Phase 2)*
- Case detail view and case comparison
- Timeline of judgments
- Argument builder and research summaries

### Module 7 — Productivity & Workspace *(Phase 2)*
- Save queries, folder organisation, bookmarked cases
- Query history and citation export

---

## Request Lifecycle

```
User Query
    │
    ▼
Query Processing (normalisation)
    │
    ▼
RAG Pipeline (vector retrieval + LLM)
    │
    ▼
Verification Engine (citation cross-check)
    │
    ▼
Confidence Scoring & Validation
    │
    ▼
Response Formatter (JSON)
    │
    ▼
Result Displayed to User
```

---

## API Reference

| Method | Endpoint  | Description                              |
|--------|-----------|------------------------------------------|
| POST   | /query    | Submit a legal query for processing      |
| GET    | /results  | Retrieve the processed, verified result  |
| GET    | /health   | Check system health and availability     |

> Authentication is JWT-based. Rate limiting and request logging are enforced.

---

## Verification Scoring

Every AI-generated citation is assigned a confidence score before being returned to the user.

| Match Type                  | Score Range | Action                         |
|-----------------------------|-------------|--------------------------------|
| Exact match with database   | ≥ 0.9       | Pass — return result           |
| Partial match               | 0.5 – 0.8   | Pass with confidence indicator |
| Below threshold             | < 0.4       | Re-run verification loop       |
| Not found                   | < 0.3       | Flag as unverified             |

> If the score falls below **0.4**, the system automatically re-runs the pipeline to attempt a higher-confidence response before delivery.

---

## Legal Dataset

| Coverage        | Status                     |
|-----------------|----------------------------|
| Supreme Court of India (1950–2025) | Planned                    |
| High Court Precedents              | Planned — Future Patch     |
| Obiter Dictum Classification       | Planned — Future Patch     |
| Ratio Decidendi Extraction         | Planned — Future Patch     |

---

## Tech Stack

```
Backend:    Python — FastAPI / Django
Frontend:   PHP, CSS, JavaScript (MVP) → React.js (planned)
AI:         OpenAI / Claude / Open-source LLMs
Vector DB:  Pinecone / FAISS
Database:   PostgreSQL
Cloud:      AWS / GCP / Azure
Auth:       JWT
```

---

## Roadmap

### Phase 1 — MVP *(Planned)*
- [ ] Natural language legal query input
- [ ] LLM-powered legal response generation
- [ ] Citation verification engine (Supreme Court DB)
- [ ] Verification scoring scheme (Exact / Partial / Not Found)
- [ ] Re-run loop for low-confidence responses (score < 0.4)
- [ ] RAG pipeline with Vector DB retrieval
- [ ] REST API layer (POST /query, GET /results, GET /health)
- [ ] PHP + JS Frontend with input and result display

### Phase 2 — Professional Tooling
- [ ] Legal drafting module (petitions, notices, contracts)
- [ ] Research and analysis tools
- [ ] High Court precedent integration
- [ ] Obiter Dictum & Ratio Decidendi classification

### Phase 3 — Scale & Collaboration
- [ ] Team collaboration features for law firms
- [ ] Vernacular / regional language support
- [ ] Voice queries
- [ ] Enterprise API integrations (SCC Online, Manupatra)
- [ ] Subscription-based premium tiers

---

## Development Timeline

| Day | Date   | Focus                  | Deliverable                    |
|-----|--------|------------------------|--------------------------------|
| 1   | Mar 31 | Planning               | MVP Definition + Plan          |
| 2   | Apr 1  | Product Documentation  | PRD + User Flow                |
| 3   | Apr 2  | System Design          | Architecture Diagram           |
| 4   | Apr 3  | Backend Setup          | Backend skeleton ready         |
| 5   | Apr 4  | AI + RAG Integration   | Basic AI response working      |
| 6   | TBD    | Verification Logic     | Core feature working          |
| 7   | TBD    | Frontend + UI          | Usable MVP interface           |
| 8   | TBD    | Testing + Refinement   | Stable MVP                     |
| 9   | TBD    | Documentation + Pitch  | Client-ready package           |
| —   | TBD    | Demo Day               | Final Delivery                |

---

## Contributing

This is a proprietary project under active development. All version history, changelogs, and developer updates are maintained in the official repository.

**Repository:** [github.com/mohithlingosme/NitiNova](https://github.com/mohithlingosme/NitiNova)

Developers and reviewers are requested to refer to the repository for the latest implementation status, branch activity, and release notes.

---

## License & IP

This software is developed by **Mohith M** (Independent Contractor) on behalf of **Team Tattva Taraka**.

- All core intellectual property — including source code, system architecture, and proprietary logic — remains the exclusive property of the Developer unless otherwise agreed in writing.
- The Client is granted a **non-exclusive, non-transferable license** to use the software for its intended business purposes.
- Transfer of IP rights may only occur through a separate written agreement signed by both parties.

> NitiNova is a proprietary platform. Unauthorised reproduction or distribution is prohibited.

---

## Project Status Report (as of Apr 1, 2026)

- **Overall**: Planning/documentation wrapped; build has not started.
- **Phase 0 (Setup)**: Repo, structure, env files, requirements, pyproject done; local tool installs still pending.
- **Phase 1 (Dataset)**: Sourcing, ingestion, parsing not started; requires source decision/licensing.
- **Phase 2-5 (API, RAG, Verification, Formatter)**: Not started; scheduled after backend skeleton lands.
- **Phase 6 (Frontend)**: Not started.
- **Upcoming 7 days**: Apr 3 - scaffold backend; Apr 4 - hook basic AI/RAG call; Apr 6 - begin verification logic; Apr 8 - wire simple frontend to `/query`.
- **Risks/Needs**: Dataset licensing decision; choose embedding model + vector DB; confirm cloud target for DB.

## Current Status

The codebase is now implementation-active with a working FastAPI backend, React frontend, and verification modules committed in this repository. Use [TODO.md](./TODO.md) as the long-term product plan, but treat the source tree as the primary truth for shipped behavior.

## Repository Structure

```
NitiNova/
├── README.md              # This document
├── TODO.md                # Complete MVP build plan
├── TODO_README.md         # Tracking for this README reorganization
├── docs/                  # Planning documents (PDFs)
│   ├── Development Note (1).pdf
│   ├── Development Note nitinova version 1.0 (mvp).pdf
│   ├── Feature list.pdf
│   └── TattvaTarama_SaaSProposal.pdf
├── archive.zip            # (archived files)
├── archive (1).zip
└── New Microsoft Word Document.docx
```

## Getting Started

**Prerequisites (install once):** Python 3.11+, Node.js LTS, and Docker Desktop (for Postgres/Redis during local runs).

1. Clone the repository:
   ```
   git clone https://github.com/mohithlingosme/NitiNova.git
   cd NitiNova
   ```

2. Prepare your Python environment:
   ```
   python -m venv .venv
   .\\.venv\\Scripts\\Activate.ps1   # PowerShell on Windows
   ```
   > Requirements files land in PHASE 2; once present, run `pip install -r requirements.txt`.

3. Copy and fill environment variables:
   ```
   Copy-Item .env.example .env
   ```
   Populate values for `OPENAI_API_KEY`, `POSTGRES_*`, `PINECONE_API_KEY`, etc. `.env` is already gitignored.

4. (When docker-compose.yml arrives) start backing services:
   ```
   docker compose up -d
   ```

5. (When backend scaffold is committed) start the API:
   ```
   uvicorn backend.main:app --reload
   ```

6. Review planning documents anytime:
   - [TODO.md](./TODO.md) for the 10-phase MVP build plan.
   - [docs/](./docs/) PDFs for detailed notes and proposals.

## Commercial Off-the-Shelf (COTS) Readiness

NitiNova is now structured to run as a packaged commercial product profile:

- **Versioned service metadata** through environment variables (`APP_VERSION`, `PRODUCT_EDITION`, `SLA_TIER`).
- **Support metadata endpoint** at `GET /api/product/about` for deployment inventory and customer handoff docs.
- **Operational health endpoint** at `GET /api/health` exposing environment, version, and configured providers.
- **JWT auth lifecycle support** including login, refresh token rotation, and logout endpoint.
- **Environment-driven deployment** via `.env.example` for repeatable installs across staging/production.

For enterprise distribution, pin release tags and attach deployment manifests plus customer-specific `.env` profiles.

## Next Steps

- Execute PHASE 0 (Project Setup) from [TODO.md](./TODO.md).
- Monitor TODO_README.md for README-specific updates.
- Once backend scaffolded, expand "Running Locally" section here.

---

*Document version: v1.0.1 | Organized | October 2024*
