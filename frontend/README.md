# Frontend (Static HTML + JS)

Serves a single-page experience that talks to the FastAPI backend at `/api`.

## Quick run (dev)
- Serve the static files: `python -m http.server 3000 --directory frontend/pages`
- Backend must be running on the same host/port or proxied so `/api` resolves.

### NitiNova MVP UI (`frontend/`)
- Serve: `python -m http.server 3000 --directory frontend`
- Backend: `uvicorn backend.main:app --reload --port 8000`
- If using a different backend URL, set `window.API_BASE` before loading `app.js` in `index.html`.

## Features
- Auth (register/login) with JWT using the backend endpoints.
- Query form with jurisdiction/year filters.
- Result panel with confidence, processing time, citation badges, progress bars.
- Copy buttons for answer and citations.

