# ⚖️ NitiNova: Legal AI Operating System (India)

**Verified Legal Intelligence + Drafting + Practice Management**

NitiNova is a unified "Legal OS" specifically designed for the Indian legal ecosystem. It bridges the gap between fragmented legal research, unreliable AI drafting, and manual practice management.

---

## 🚀 The Vision
Most AI tools struggle with "hallucinations" (making up fake case laws). NitiNova is built on an **Anti-Hallucination Layer**, ensuring every citation provided is verified against actual Indian Supreme Court and High Court records.

## 🛠️ Core Modules
1.  **Verified Research (RAG):** AI research grounded in a verified database of Indian Case Law.
2.  **Citation Verification:** A scoring engine that validates the existence of citations (SCC, AIR, etc.).
3.  **Smart Drafting:** Context-aware document generation for petitions, notices, and contracts.
4.  **Matter CRM:** Manage clients, case stages, and deadlines in one place.
5.  **Contract Lifecycle:** AI-powered review and management of commercial agreements.

---

## 🏗️ System Architecture
- **Frontend:** React.js / TypeScript (Modern, fast user interface)
- **Backend:** FastAPI / Python (The "Brain" handling AI logic)
- **Database:** PostgreSQL (Client & Matter data)
- **Vector DB:** Pinecone (Storing and searching through Indian Law)
- **AI Models:** OpenAI GPT-4 / Specialized Legal LLMs

---

## 📂 Project Structure
```text
NitiNova/
├── backend/                # The "Brain" (Python/FastAPI)
│   ├── app/
│   │   ├── api/            # API endpoints (the doors to your app)
│   │   │   ├── v1/
│   │   │   │   ├── research.py
│   │   │   │   ├── drafting.py
│   │   │   │   ├── clients.py
│   │   │   │   └── contracts.py
│   │   ├── core/           # Settings, Security, and Configs
│   │   ├── db/             # Database connection logic
│   │   ├── models/         # Database tables (how data is stored)
│   │   ├── schemas/        # Data validation (rules for the data)
│   │   ├── services/       # The "Logic" (RAG logic, AI prompts)
│   │   │   ├── ai_service.py
│   │   │   ├── rag_service.py
│   │   │   └── verification_service.py
│   │   └── main.py         # Entry point for the backend
│   ├── tests/              # Testing folders
│   ├── .env                # Secret keys (OpenAI API key, etc.)
│   ├── requirements.txt    # List of Python packages needed
│   └── Dockerfile          # For launching the app anywhere
│
├── frontend/               # The "Face" (React.js/TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable UI parts (Buttons, Sidebars)
│   │   ├── pages/          # Full pages (Dashboard, Research Lab)
│   │   ├── services/       # Functions to talk to the backend
│   │   ├── hooks/          # Special React logic
│   │   └── App.tsx         # Main UI entry point
│   ├── public/             # Images and Logos
│   └── package.json        # Frontend configuration
│
├── data/                   # The "Library" (Legal Data)
│   ├── raw/                # Original PDFs/Judgments (Untouched)
│   ├── processed/          # Cleaned text versions
│   └── vector_store/       # Logic for Pinecone/Vector indexing
│
├── scripts/                # One-time tools
│   ├── ingest_judgments.py # Script to upload law to the AI
│   └── seed_db.py          # Setup initial database data
│
├── docs/                   # Documentation
│   ├── architecture.md
│   └── api_spec.md
│
├── .gitignore              # Files to ignore (Security)
├── docker-compose.yml      # Runs Backend + Database together
└── README.md               # Project overview (Already created)

🚦 Getting Started (For Beginners)
1. Prerequisites
Install Python 3.10+
Install Node.js
Get an OpenAI API Key
2. Setting up the Backend
code
Bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
3. Setting up the Frontend
code
Bash
cd frontend
npm install
npm run dev
📅 Roadmap
Phase 1: RAG Search + Case Law Verification (Current Focus)
Phase 2: AI Drafting Engine + Indian Law Templates
Phase 3: Client CRM & Matter Management
Phase 4: Workflow Automation & Legal Copilot
🔐 Intellectual Property
Owner: Mohith M.
Status: Version 2.1 — Production Architecture Edition (2025/26)
