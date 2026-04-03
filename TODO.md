# NitiNova — Complete Build TODO
> Every task required to build NitiNova from zero to production-ready MVP and beyond.
> Tasks are ordered by dependency. Complete each phase before moving to the next.

---

## Legend
- `[ ]` — Not started
- `[~]` — In progress
- `[x]` — Done
- `[!]` — Blocker / needs decision

---

## PHASE 0 — Project Setup & Environment

### 0.1 Repository & Version Control
- [x] Create GitHub repository at `github.com/mohithlingosme/NitiNova`
- [x] Initialise `main` and `dev` branches
- [x] Set up branch protection rules on `main` (require PR + review before merge)
- [x] Create `.gitignore` (Python, Node, env files, secrets)
- [x] Create `CHANGELOG.md` with v0.0.1 initial entry
- [x] Create `LICENSE` file (Proprietary — Mohith M)
- [x] Add `README.md` to root

### 0.2 Local Development Environment
- [ ] Install Python 3.11+ and create a virtual environment (`venv` or `conda`)
- [ ] Install Node.js (for any frontend build tooling if needed)
- [ ] Install Docker and Docker Compose (for local DB + services)
- [x] Create `.env.example` listing all required environment variables
- [x] Create `.env` locally and add to `.gitignore` (never commit secrets)
- [x] Confirm all team members can clone and run the repo locally

### 0.3 Project Structure
- [x] Scaffold the directory layout:
  ```
  NitiNova/
  ├── backend/
  │   ├── api/
  │   ├── core/
  │   ├── rag/
  │   ├── verification/
  │   ├── models/
  │   └── tests/
  ├── frontend/
  │   ├── pages/
  │   ├── components/
  │   ├── static/
  │   └── templates/
  ├── data/
  │   ├── raw/
  │   └── processed/
  ├── scripts/
  ├── docs/
  ├── docker-compose.yml
  ├── requirements.txt
  └── README.md
  ```
- [x] Create `requirements.txt` with all Python dependencies pinned to specific versions
- [x] Create `pyproject.toml` or `setup.py` for project metadata

---

## PHASE 1 — Legal Dataset & Data Pipeline

> The entire platform depends on a clean, structured legal dataset. Build this first.

### 1.1 Dataset Sourcing
- [ ] 
- [ ] Determine which sources are free vs require licensing
- [ ] Decide on data acquisition method: scraping, API, bulk download, or licensing agreement
- [ ] Document the data source decision and any legal/licensing constraints
- [ ] Obtain Supreme Court of India judgments from 1950 to 2025
- [ ] Confirm coverage: all divisions — Constitutional Bench, Civil, Criminal

### 1.2 Raw Data Ingestion
- [ ] Write a data ingestion script (`scripts/ingest_raw.py`) to download/import raw judgment files
- [ ] Store raw files in `data/raw/` (PDF or HTML format)
- [ ] Log every file ingested: source, date, case name, citation
- [ ] Handle duplicates — check by citation string before storing
- [ ] Validate file integrity (non-empty, readable, not corrupted)

### 1.3 Data Parsing & Extraction
- [ ] Write a PDF/HTML parser (`scripts/parse_judgments.py`) to extract:
  - Case name (e.g., *State of Maharashtra v. John Doe*)
  - Neutral citation (e.g., `2023 INSC 456`)
  - Court name and bench
  - Date of judgment
  - Judges on the bench
  - Headnotes / catchwords
  - Full judgment text
  - Acts and sections cited
  - Cases cited within the judgment
- [ ] Handle inconsistent formatting across different decades of judgments
- [ ] Write unit tests for the parser against 10 sample judgments of varying formats

### 1.4 Citation Normalisation
- [ ] Research all common citation formats used in Indian courts:
  - AIR (All India Reporter) format
  - SCC (Supreme Court Cases) format
  - SCR (Supreme Court Reports) format
  - Neutral citation format (post-2014)
- [ ] Write a `CitationNormaliser` class that converts all formats to a single canonical form
- [ ] Handle edge cases: multiple citations for the same case, typos, OCR errors
- [ ] Build a citation lookup index: `canonical_citation → case_id`

### 1.5 Metadata Enrichment
- [ ] Tag each case with:
  - Primary subject area (Constitutional, Criminal, Civil, Tax, Family, etc.)
  - Year
  - Court division
  - Bench strength (3-judge, 5-judge, etc.)
  - Whether it overruled an earlier case
  - Whether it was subsequently overruled
- [ ] Build a `case_status` field: `good_law | overruled | distinguished | per_incuriam`
- [ ] Create a relationships table: `case_id → [cited_cases]` and `case_id → [citing_cases]`

### 1.6 Database Setup
- [ ] Install and configure PostgreSQL locally via Docker
- [ ] Design the database schema:
  ```sql
  Table: cases
    - id (UUID, primary key)
    - case_name (text)
    - canonical_citation (text, unique)
    - alternate_citations (jsonb array)
    - court (text)
    - judgment_date (date)
    - judges (text array)
    - subject_tags (text array)
    - case_status (enum)
    - full_text (text)
    - source_url (text)
    - ingested_at (timestamp)

  Table: citations_index
    - raw_citation (text)
    - case_id (UUID, foreign key → cases.id)
    - confidence (float)

  Table: case_relationships
    - from_case_id (UUID)
    - to_case_id (UUID)
    - relationship_type (enum: cites, overrules, distinguishes)
  ```
- [ ] Write Alembic migration scripts for all tables
- [ ] Seed the database with the processed dataset
- [ ] Add indexes on `canonical_citation`, `case_name`, `judgment_date`, and `subject_tags`
- [ ] Write a data integrity check script to validate no orphan records exist

---

## PHASE 2 — Backend API (FastAPI)

### 2.1 Project Skeleton
- [ ] Install FastAPI and Uvicorn
- [ ] Create `backend/main.py` as the application entry point
- [ ] Set up CORS middleware (restrict to frontend origin in production)
- [ ] Set up request logging middleware (log method, path, response time, status code)
- [ ] Set up a global exception handler (return structured JSON error responses)
- [ ] Configure environment variable loading via `python-dotenv` or `pydantic-settings`

### 2.2 Authentication
- [ ] Install `python-jose` for JWT handling and `passlib` for password hashing
- [ ] Design the User model:
  ```
  User: id, email, hashed_password, role (free | pro | admin), created_at
  ```
- [ ] Create `POST /auth/register` endpoint
- [ ] Create `POST /auth/login` endpoint — returns JWT access token + refresh token
- [ ] Create `POST /auth/refresh` endpoint — issues a new access token
- [ ] Create `POST /auth/logout` endpoint — invalidates refresh token
- [ ] Write a JWT dependency (`get_current_user`) that all protected routes use
- [ ] Enforce token expiry: access token 15 mins, refresh token 7 days
- [ ] Write unit tests for all auth endpoints

### 2.3 Core Query Endpoint
- [ ] Create `POST /query` endpoint:
  - Accept: `{ "query": string, "jurisdiction"?: string, "year_range"?: [int, int] }`
  - Validate input (non-empty, max length 2000 chars)
  - Pass to the Query Processing module
  - Return: structured JSON with verified response and citations
- [ ] Add rate limiting: 10 requests/minute for free users, 60/minute for Pro
- [ ] Add request ID to each query for traceability
- [ ] Log every query (anonymised) for analytics

### 2.4 Results Endpoint
- [ ] Create `GET /results/{request_id}` endpoint:
  - Return cached result for a previously submitted query
  - Handle case where result is not yet ready (return `202 Accepted` with status)
  - Handle case where request ID does not exist (return `404`)

### 2.5 Health Endpoint
- [ ] Create `GET /health` endpoint:
  - Check database connectivity
  - Check vector DB connectivity
  - Check LLM API reachability
  - Return: `{ "status": "ok" | "degraded", "components": {...} }`

### 2.6 Verification Endpoint
- [ ] Create `POST /verify` endpoint:
  - Accept: `{ "citation": string }`
  - Run citation through the verification engine
  - Return: `{ "citation": string, "status": "verified|partial|unverified", "score": float, "matched_case": {...} }`
  - Useful for standalone citation checking without a full query

### 2.7 API Documentation
- [ ] Ensure all endpoints have Pydantic request/response models
- [ ] Add docstrings to all route functions
- [ ] Verify auto-generated Swagger UI (`/docs`) is accurate and complete
- [ ] Add example request/response bodies to all endpoints

### 2.8 Rate Limiting & Security
- [ ] Integrate `slowapi` for rate limiting
- [ ] Add API key support for B2B integrations (alongside JWT)
- [ ] Sanitise all user inputs to prevent injection
- [ ] Set secure HTTP headers (Content-Security-Policy, X-Frame-Options, etc.)
- [ ] Enable HTTPS only in production (redirect HTTP → HTTPS)

---

## PHASE 3 — RAG Pipeline

### 3.1 Embedding Model Setup
- [ ] Evaluate embedding models for Indian legal text:
  - OpenAI `text-embedding-3-small`
  - `sentence-transformers/all-MiniLM-L6-v2`
  - Custom fine-tuned model (future)
- [ ] Select and document the chosen model with justification
- [ ] Install the embedding library and write a wrapper class `EmbeddingService`
- [ ] Test embedding quality on 20 sample legal queries

### 3.2 Vector Database Setup
- [ ] Choose vector DB: Pinecone (cloud) for MVP or FAISS (local) for development
- [ ] Set up the vector DB locally with Docker (FAISS) and in cloud (Pinecone)
- [ ] Define index schema:
  - Vector dimension (matches embedding model output)
  - Metadata fields: `case_id`, `case_name`, `citation`, `year`, `court`, `subject`
- [ ] Write `scripts/build_vector_index.py`:
  - Iterates over all cases in PostgreSQL
  - Chunks long judgment texts into ~512-token segments
  - Generates embeddings for each chunk
  - Upserts into the vector DB with metadata
- [ ] Run the indexing script and verify the index is populated correctly
- [ ] Write a test: given a known query, does the retriever return the expected case?

### 3.3 Retrieval Module
- [ ] Write `RAGRetriever` class in `backend/rag/retriever.py`:
  - `retrieve(query: str, top_k: int = 5) → List[Document]`
  - Converts query to embedding
  - Queries vector DB for top-k nearest neighbors
  - Returns matched documents with metadata and similarity scores
- [ ] Implement hybrid search (keyword + semantic):
  - Keyword: PostgreSQL full-text search (`tsvector` / `tsquery`)
  - Semantic: vector similarity from the vector DB
  - Merge and re-rank results using Reciprocal Rank Fusion (RRF)
- [ ] Add metadata filtering: allow filtering by `year`, `court`, `subject` at retrieval time
- [ ] Write unit tests for the retriever with mock vector DB responses

### 3.4 LLM Integration
- [ ] Set up LLM client (`openai` SDK or `anthropic` SDK)
- [ ] Write `LLMService` class in `backend/core/llm_service.py`:
  - `generate(query: str, context: List[Document]) → str`
  - Constructs a legal-domain prompt with retrieved context injected
  - Sends request to LLM API
  - Returns raw LLM response text
- [ ] Design the system prompt for legal reasoning:
  - Instruct the model to cite only cases present in the provided context
  - Instruct the model to use correct citation format
  - Instruct the model to indicate uncertainty when context is insufficient
- [ ] Implement retry logic with exponential backoff for API failures
- [ ] Log all LLM calls: model, token count, latency, cost estimate
- [ ] Write unit tests with mocked LLM responses

### 3.5 RAG Pipeline Orchestration
- [ ] Write `RAGPipeline` class in `backend/rag/pipeline.py`:
  - `run(query: str) → RawLLMResponse`
  - Step 1: Normalise query
  - Step 2: Retrieve relevant documents
  - Step 3: Construct prompt with context
  - Step 4: Call LLM
  - Step 5: Return raw response for verification
- [ ] Add pipeline-level error handling: if retrieval returns 0 results, fall back gracefully
- [ ] Write integration tests for the full pipeline with real (or realistic mock) data

---

## PHASE 4 — Verification Engine

> This is the core differentiator of NitiNova. Build it with extreme care.

### 4.1 Citation Extractor
- [ ] Write `CitationExtractor` class in `backend/verification/extractor.py`:
  - Parses raw LLM output text
  - Extracts all candidate citations using regex patterns for known formats
  - Returns: `List[RawCitation]`
- [ ] Define regex patterns for:
  - AIR format: `AIR \d{4} SC \d+`
  - SCC format: `\(\d{4}\) \d+ SCC \d+`
  - Neutral citation: `\d{4} INSC \d+`
  - SCR format: `\[\d{4}\] \d+ SCR \d+`
- [ ] Handle edge cases: citations split across lines, partial citations, OCR errors
- [ ] Write unit tests covering all citation formats and edge cases

### 4.2 Citation Matcher
- [ ] Write `CitationMatcher` class in `backend/verification/matcher.py`:
  - `match(raw_citation: str) → MatchResult`
  - First attempt: exact lookup in `citations_index` table
  - Second attempt: normalise citation and retry exact lookup
  - Third attempt: fuzzy match using `rapidfuzz` library
  - Return match result with score and matched database record
- [ ] Define `MatchResult` model:
  ```python
  class MatchResult:
      raw_citation: str
      matched_case: Optional[Case]
      match_type: Literal["exact", "partial", "not_found"]
      score: float  # 0.0 to 1.0
  ```
- [ ] Tune fuzzy match threshold to minimise false positives
- [ ] Write unit tests: exact match, partial match, no match, near-duplicate citations

### 4.3 Scoring Engine
- [ ] Write `ScoringEngine` class in `backend/verification/scorer.py`:
  - Applies the scoring scheme:
    - Exact match → score ≥ 0.9 → **PASS**
    - Partial match → score 0.5–0.8 → **PASS WITH INDICATOR**
    - Below threshold → score < 0.4 → **TRIGGER RE-RUN**
    - Not found → score < 0.3 → **FLAG AS UNVERIFIED**
  - Returns `VerificationResult` for each citation
- [ ] Implement the **re-run loop**:
  - If any citation scores < 0.4, re-run the RAG pipeline with modified prompt
  - Limit re-runs to 2 attempts to prevent infinite loops
  - If still failing after 2 attempts, flag citations as unverified and return anyway
- [ ] Attach case status to verified citations: `good_law | overruled | distinguished`
  - If a cited case is marked `overruled` in the database, add a prominent warning

### 4.4 Verification Audit Trail
- [ ] Create `verification_logs` table in PostgreSQL:
  ```sql
  Table: verification_logs
    - id (UUID)
    - request_id (UUID)
    - raw_citation (text)
    - matched_case_id (UUID, nullable)
    - match_type (text)
    - score (float)
    - re_run_count (int)
    - final_status (text)
    - verified_at (timestamp)
  ```
- [ ] Write to this table after every verification run
- [ ] Create `GET /admin/verification-logs` endpoint (admin only) for audit access

### 4.5 Verification Unit & Integration Tests
- [ ] Test: known valid citation → exact match → score ≥ 0.9
- [ ] Test: slightly misspelled citation → partial match → score 0.5–0.8
- [ ] Test: completely fabricated citation → not found → score < 0.3
- [ ] Test: overruled case citation → pass but with overruled warning
- [ ] Test: re-run loop triggers on score < 0.4 and resolves correctly
- [ ] Test: re-run loop stops after 2 attempts and returns unverified flag

---

## PHASE 5 — Response Formatter

### 5.1 Response Schema Design
- [ ] Define the final API response JSON schema:
  ```json
  {
    "request_id": "uuid",
    "query": "original query text",
    "answer": "AI-generated legal response",
    "citations": [
      {
        "raw": "AIR 2021 SC 123",
        "canonical": "2021 INSC 456",
        "case_name": "State of X v. Y",
        "court": "Supreme Court of India",
        "date": "2021-03-15",
        "status": "good_law",
        "verification": {
          "match_type": "exact",
          "score": 0.97,
          "verified": true,
          "warning": null
        }
      }
    ],
    "overall_confidence": 0.92,
    "unverified_count": 0,
    "processing_time_ms": 1240,
    "re_run_count": 0
  }
  ```
- [ ] Write the Pydantic response models for all fields above
- [ ] Ensure the schema handles partial and unverified citations gracefully

### 5.2 Response Formatter Implementation
- [ ] Write `ResponseFormatter` class in `backend/core/formatter.py`
- [ ] Inject citation metadata from the database into each citation object
- [ ] Calculate `overall_confidence` as a weighted average of all citation scores
- [ ] Clearly flag `unverified_count` so the frontend can display warnings
- [ ] Ensure the raw LLM answer text is sanitised (remove any markdown artifacts if needed)

---

## PHASE 6 — Frontend Interface

### 6.1 Setup
- [ ] Set up the PHP + CSS + JavaScript frontend directory structure
- [ ] Create a base HTML template with header, main content area, and footer
- [ ] Link a CSS reset and base stylesheet
- [ ] Set up JavaScript module structure (vanilla JS or lightweight bundler)
- [ ] Create a `.env` config file for the frontend (API base URL, etc.)

### 6.2 Query Input Interface
- [ ] Build the main search page (`index.php`):
  - Large, prominent text area for natural language query input
  - Character counter (max 2000 chars)
  - Optional filters: jurisdiction dropdown, year range picker
  - Submit button with loading state
- [ ] On submit, call `POST /query` via `fetch` API
- [ ] Show a loading spinner while the query is being processed
- [ ] Handle API errors gracefully (show user-friendly error messages)

### 6.3 Results Display
- [ ] Build the results page / results section:
  - Display the AI-generated answer text prominently
  - Below the answer, list all citations as cards
  - Each citation card shows: case name, citation string, date, court
  - Each citation card has a clear **verification badge**:
    - ✅ Green badge → Verified (score ≥ 0.9)
    - 🟡 Yellow badge → Partial match (score 0.5–0.8)
    - 🔴 Red badge → Unverified (score < 0.3)
  - Show a confidence score bar for each citation
  - Show a warning banner if the cited case has been overruled
- [ ] Show overall confidence score at the top of the results
- [ ] Show `processing_time_ms` as a subtle footnote

### 6.4 Copy & Export
- [ ] Add a "Copy Answer" button that copies the AI answer to the clipboard
- [ ] Add a "Copy All Citations" button that copies formatted citations
- [ ] Add a "Download as PDF" button (basic browser print-to-PDF or use a library)

### 6.5 Responsiveness
- [ ] Test layout on mobile (375px width), tablet (768px), and desktop (1280px+)
- [ ] Ensure text areas and result cards are readable on all screen sizes
- [ ] Test on Chrome, Firefox, and Safari

---

## PHASE 7 — Integration & End-to-End Testing

### 7.1 Integration Tests
- [ ] Write end-to-end test: submit a query → receive verified response with correct citations
- [ ] Write test: submit a query that produces hallucinated citations → all flagged as unverified
- [ ] Write test: submit a query → one citation triggers re-run → re-run resolves correctly
- [ ] Write test: API rate limit is enforced after 10 requests/minute
- [ ] Write test: invalid JWT returns 401; expired JWT returns 401

### 7.2 Load Testing
- [ ] Use `locust` or `k6` to simulate 50 concurrent users
- [ ] Measure: median response time, p95 response time, error rate
- [ ] Target: p95 response time < 5 seconds under 50 concurrent users
- [ ] Identify and fix any bottlenecks found

### 7.3 Data Quality Testing
- [ ] Manually verify 50 random cases from the dataset for correctness
- [ ] Check 20 known valid citations return exact match with score ≥ 0.9
- [ ] Check 10 known fabricated citations return `not_found` with score < 0.3
- [ ] Verify the overruled case flag is correctly set for at least 5 known overruled cases

---

## PHASE 8 — DevOps & Deployment

### 8.1 Containerisation
- [ ] Write `Dockerfile` for the backend (multi-stage build for small image size)
- [ ] Write `Dockerfile` for the frontend
- [ ] Write `docker-compose.yml` for local development:
  - Services: `backend`, `frontend`, `postgres`, `redis` (for rate limiting cache)
- [ ] Test that `docker-compose up` starts the full stack with no errors

### 8.2 Cloud Infrastructure
- [ ] Choose cloud provider: AWS / GCP / Azure
- [ ] Provision a managed PostgreSQL instance (RDS / Cloud SQL)
- [ ] Set up a managed vector DB (Pinecone cloud account)
- [ ] Provision a compute instance or container service (EC2 / Cloud Run / App Service)
- [ ] Set up a CDN for static frontend assets
- [ ] Configure environment variables in the cloud environment (not in code)

### 8.3 CI/CD Pipeline
- [ ] Set up GitHub Actions workflow:
  - On every PR to `dev`: run linting, unit tests, integration tests
  - On merge to `main`: run all tests + deploy to staging
  - On manual trigger: deploy staging → production
- [ ] Add test coverage check: fail CI if coverage drops below 70%
- [ ] Add a secrets scanner (e.g., `gitleaks`) to prevent accidental credential commits

### 8.4 Monitoring & Alerting
- [ ] Integrate Sentry for error tracking (backend + frontend)
- [ ] Set up uptime monitoring (e.g., BetterUptime or UptimeRobot) on `/health`
- [ ] Configure alerts: notify on Slack/email if error rate > 1% or uptime < 99.9%
- [ ] Set up basic metrics dashboard: query volume, average latency, verification pass rate

### 8.5 Security Hardening
- [ ] Enable HTTPS with a valid TLS certificate (Let's Encrypt or cloud provider)
- [ ] Set up a Web Application Firewall (WAF) to block common attack patterns
- [ ] Configure database: no public internet access, only accessible from backend
- [ ] Rotate all secrets and API keys before first production deployment
- [ ] Review and apply DPDP Act (India) data handling requirements

---

## PHASE 9 — Documentation & Launch Preparation

### 9.1 Technical Documentation
- [ ] Write architecture decision records (ADRs) for major choices (embedding model, vector DB, etc.)
- [ ] Document all environment variables in `.env.example` with descriptions
- [ ] Write a developer onboarding guide (`docs/DEVELOPER_GUIDE.md`)
- [ ] Document the data ingestion pipeline with step-by-step instructions

### 9.2 API Documentation
- [ ] Verify Swagger UI is complete and accurate
- [ ] Write a standalone API reference (`docs/API_REFERENCE.md`) with cURL examples
- [ ] Create a Postman collection for all endpoints and share with stakeholders

### 9.3 User Documentation
- [ ] Write a user guide for legal professionals (`docs/USER_GUIDE.md`)
- [ ] Create a FAQ covering: What does the confidence score mean? What does "unverified" mean? What courts are covered?
- [ ] Write an explanation of the verification scoring system in plain English

### 9.4 Demo Preparation
- [ ] Identify 5–10 real, well-known legal queries for the demo
- [ ] Run each query end-to-end and verify results are correct and impressive
- [ ] Record a 3–5 minute demo video (screen recording) of the full workflow
- [ ] Prepare a 1-page product summary sheet for non-technical stakeholders

---

## PHASE 10 — Post-MVP: Future Patches

> These items are out of scope for v1.0 MVP but must be planned and tracked.

### 10.1 High Court Integration *(Planned)*
- [ ] Source and ingest High Court precedents (all 25 High Courts)
- [ ] Extend the citation normaliser to handle High Court citation formats
- [ ] Update the vector index to include High Court judgments
- [ ] Update the verification engine to validate High Court citations

### 10.2 Obiter Dictum & Ratio Decidendi *(Planned)*
- [ ] Research NLP approaches to automatically classify judgment passages
- [ ] Build a classifier model to identify *ratio decidendi* vs *obiter dictum*
- [ ] Add `ratio_decidendi` and `obiter_dictum` fields to the `cases` table
- [ ] Expose classification in the API response and citation cards

### 10.3 Legal Drafting Module *(Phase 2)*
- [ ] Build petition drafting interface
- [ ] Build legal notice generator
- [ ] Build contract template system with verified citation injection
- [ ] Add export to DOCX and PDF

### 10.4 Research & Analysis Tools *(Phase 2)*
- [ ] Case comparison view (side-by-side)
- [ ] Timeline of judgments on a topic
- [ ] Argument builder — structure arguments around verified cases
- [ ] Research summaries — auto-summarise a line of cases

### 10.5 Collaboration & Enterprise *(Phase 3)*
- [ ] Team workspaces and shared folders
- [ ] Role-based access control (Admin, Senior Associate, Junior)
- [ ] Audit trail exports for law firm compliance
- [ ] Vernacular / regional language support (Hindi as first target)
- [ ] Voice query input
- [ ] Enterprise API (B2B) with dedicated rate limits and SLAs

### 10.6 SCC Online / Manupatra Integration *(Phase 3)*
- [ ] Evaluate API availability and licensing costs
- [ ] Integrate as a supplementary verification source
- [ ] Fall back to integrated source if primary DB does not match

---

## Quick Reference — MVP Checklist

The absolute minimum required for a functional, demo-ready v1.0:

- [ ] Dataset: Supreme Court cases 1950–2025 ingested and indexed
- [ ] Backend: `/query`, `/results`, `/health`, `/verify` endpoints working
- [ ] Auth: JWT login and registration working
- [ ] RAG: Vector retrieval returning relevant cases for legal queries
- [ ] LLM: Generating coherent legal responses with citation references
- [ ] Verification Engine: Exact + partial + not-found scoring working
- [ ] Re-run Loop: Triggers on score < 0.4 and resolves
- [ ] Response: Structured JSON with scores and case metadata returned
- [ ] Frontend: Input box, result display, verification badges visible
- [ ] Deployment: Running on cloud with HTTPS and `/health` returning `ok`

---

*TODO version: v1.0 | NitiNova | March 2026*
*Maintained by: Mohith M | github.com/mohithlingosme/NitiNova*
