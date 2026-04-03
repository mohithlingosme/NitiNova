# Judgment PDF → JSON Pipeline (Offline)

Offline, Ollama-backed pipeline that converts Indian court judgment PDFs into structured JSON.

## Quick Start
- Install dependencies (inside repo root): `pip install -r judgementcopy_management_system/requirements.txt`
- Ensure Ollama is running locally at `http://localhost:11434` with a model pulled (e.g., `mistral`): `ollama pull mistral`
- Run batch pipeline: `python judgementcopy_management_system/main.py --input ./pdfs --output ./json`

## Pipeline Stages
- **extractor.py**: PyMuPDF page-wise text extraction with graceful failure handling.
- **cleaner.py**: Removes page numbers, repeated headers, normalizes whitespace.
- **parser.py**: Regex-based metadata for case name, date, citation, court, bench.
- **section_detector.py**: Finds headnote if present; otherwise heuristically captures facts, issues, reasoning and scores key paragraphs to minimize LLM input.
- **llm_local.py**: Calls local Ollama (`/api/generate`) with a strict JSON prompt; no external network calls.
- **validator.py**: Validates required fields and retries up to 3 times on malformed JSON.
- **orchestrator.py**: Wires the full flow and writes JSON outputs.

## Minimal API hook (for frontend)
Expose an endpoint `/pipeline/process` (e.g., FastAPI) that accepts `file: UploadFile` and `model: str`, runs `Orchestrator.process_pdf`, and returns the JSON. The supplied frontend expects this route.

Pseudo-handler:
```python
@router.post("/pipeline/process")
async def process(file: UploadFile, model: str = "mistral"):
    tmp = Path(tempfile.mkstemp(suffix=".pdf")[1])
    tmp.write_bytes(await file.read())
    orch = Orchestrator(model=model)
    out = orch.process_pdf(tmp, Path(tempfile.gettempdir()))
    return json.loads(out.read_text())
```

## Frontend
- Static HTML UI at `judgementcopy_management_system/frontend/index.html`.
- Serve locally: `python -m http.server 8080 --directory judgementcopy_management_system/frontend`.
- Points to `/pipeline/process` on the same origin; adjust if proxying.

## Output Schema
```json
{
  "case_name": "",
  "citation": "",
  "court": "",
  "date": "",
  "bench": [],
  "facts": "",
  "procedural_history": "",
  "issues": [],
  "arguments": {
    "petitioner": "",
    "respondent": ""
  },
  "judgment_summary": "",
  "reasoning": "",
  "ratio": "",
  "legal_principles": [],
  "citations": [],
  "final_order": ""
}
```

## Notes
- Works completely offline; only connects to local Ollama.
- Skips PDFs that fail to open/extract instead of crashing.
- Logging is written to `logs/pipeline.log`.
- Designed for future multiprocessing; current version processes sequentially for simplicity.
