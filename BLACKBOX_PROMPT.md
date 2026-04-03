# 🚀 BLACKBOX AI MASTER PROMPT — NitiNova Full Build

You are an autonomous senior full-stack + AI engineer.
Your task is to build the NitiNova project end-to-end WITHOUT asking questions.
Execute tasks step-by-step in the exact order below.

---

# ⚙️ GLOBAL RULES
- Always write clean, production-ready code
- Use FastAPI (backend) and Next.js (frontend)
- Keep code modular
- Add comments for clarity
- Ensure everything runs end-to-end
- Do NOT skip steps

---

# 🧱 STEP 1: PROJECT SETUP
1. Create folder structure:
   - backend/
   - frontend/
   - ocr_pipeline/
   - data/
   - scripts/
   - tests/

2. Initialize:
   - FastAPI backend
   - Next.js frontend

3. Create `.env` with:
   - OPENAI_API_KEY
   - DATABASE_URL

4. Add logging + error handling middleware

---

# 📄 STEP 2: OCR PIPELINE
1. Build PDF ingestion system
2. Convert PDF → images
3. Apply preprocessing (denoise + segmentation)
4. Extract text using:
   - Tesseract
   - PaddleOCR (fallback/improved)
5. Save raw text output

---

# 🧠 STEP 3: STRUCTURING ENGINE
1. Parse OCR text into:
   - Case Name
   - Judges
   - Date
   - Citations
2. Split large documents into chunks
3. Convert into JSON format:

{
  "case_name": "",
  "facts": "",
  "issues": [],
  "arguments": [],
  "judgement": "",
  "citations": []
}

---

# 🤖 STEP 4: LLM PIPELINE
1. Integrate OpenAI API
2. Build prompts for:
   - Summarization
   - Issue extraction
   - Ratio decidendi
3. Process structured JSON through LLM

---

# 🗃️ STEP 5: DATABASE + VECTOR SEARCH
1. Setup PostgreSQL
2. Store structured cases
3. Generate embeddings
4. Use FAISS or Chroma
5. Enable semantic search

---

# 🔎 STEP 6: SEARCH ENGINE
1. Build APIs:
   - /search
   - keyword + semantic
2. Add filters (year, court, judge)

---

# 🌐 STEP 7: BACKEND API
Create endpoints:
- /upload
- /process
- /search
- /case/{id}

Add async processing

---

# 🎨 STEP 8: FRONTEND
1. Landing page
2. Upload UI
3. Search interface
4. Case viewer
5. Comparison UI

Fix all UI bugs and ensure responsiveness

---

# 🧪 STEP 9: TESTING
- Unit tests
- Integration tests
- OCR accuracy tests

---

# ⚡ STEP 10: OPTIMIZATION
- Add caching (Redis)
- Parallel processing

---

# ☁️ STEP 11: DEPLOYMENT
- Backend → Render/Railway
- Frontend → Vercel

---

# 🎯 FINAL GOAL
A working system where:
Upload PDF → Extract → Structure → Analyze → Search → View

---

# 🚨 EXECUTION INSTRUCTION
Start from STEP 1 and continue sequentially until completion.
Do NOT stop midway.
