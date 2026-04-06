from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# from .api.v1 import research  # Enable once services ready
from .core.config import settings

app = FastAPI(title=settings.PROJECT_NAME, version="0.1.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(research.router, prefix="/api/v1/research", tags=["research"])

@app.get("/")
def read_root():
    return {"message": "NitiNova Legal AI OS - Backend Running 🚀"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

