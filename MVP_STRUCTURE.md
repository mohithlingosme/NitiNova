# 🚀 NitiNova Clean MVP Structure

## Recommended Folder Structure

```
NitiNova-MVP/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   │   └── query.py
│   │   ├── services/
│   │   │   ├── llm.py
│   │   │   └── verifier.py
│   │   ├── models/
│   │   │   └── schema.py
│   │   └── core/
│   │       └── config.py
│   │
│   ├── data/
│   │   └── cases.json
│   │
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
│
├── .env
├── README.md
└── .gitignore
```

## Goal

Minimal working flow:

Frontend → Backend (/query) → AI → Verified Response

## Build Strategy

1. Start with backend/main.py + frontend/index.html
2. Add services (llm + verifier)
3. Add dataset (cases.json)
4. Refactor into routes

Keep it simple. Do not overbuild.
