# NitiNova MVP

Minimal working Legal AI Verification platform.

## Folder Structure ✅

```
NitiNova-MVP/
├── backend/
│   ├── app/                 # FastAPI app
│   │   ├── main.py          # API server
│   │   ├── core/config.py
│   │   ├── models/schema.py
│   │   ├── services/
│   │   └── routes/
│   ├── data/cases.json      # Sample legal data
│   ├── requirements.txt
│   └── run.py
├── frontend/                # Static HTML/JS/CSS
│   ├── index.html
│   ├── app.js
│   └── style.css
├── .env
├── .gitignore
└── README.md
```

## Quick Start

1. **Backend** (Terminal 1):
```
cd NitiNova-MVP/backend
pip install -r requirements.txt
python run.py
```
API at http://localhost:8000 (docs: http://localhost:8000/docs)

2. **Frontend** (Terminal 2):
```
cd NitiNova-MVP
# Open frontend/index.html in browser
# Or use live server: npx live-server frontend/
```

3. **Test Flow**:
- Frontend search → POST /query → mock verified response
- Displays answer, 95% confidence, verified citations

## API

**POST /query**
```json
{
  "query": "Basic Structure Doctrine"
}
```

**Response**:
```json
{
  "request_id": "req_...",
  "answer": "Kesavananda Bharati (1973)...",
  "overall_confidence": 0.95,
  "citations": [...]
}
```

## Expand

- Replace mock LLM/verifier with real OpenAI/RAG
- Add auth (JWT)
- Real vector DB (Pinecone/Chroma)
- More cases in data/cases.json

MVP structure complete!

