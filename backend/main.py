from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import time

from backend.core.config import get_settings
from backend.api import health, query, results, verify, auth, deps, admin, product

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    openapi_url=f"{settings.api_prefix}/openapi.json"
)

# Set all CORS enabled origins
if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred."}
    )

app.include_router(health.router, prefix=settings.api_prefix, tags=["Health"])
app.include_router(auth.router, prefix=f"{settings.api_prefix}/auth", tags=["Auth"])
app.include_router(query.router, prefix=settings.api_prefix, tags=["Query"])
app.include_router(results.router, prefix=settings.api_prefix, tags=["Results"])
app.include_router(verify.router, prefix=settings.api_prefix, tags=["Verify"])
app.include_router(admin.router, prefix=f"{settings.api_prefix}/admin", tags=["Admin"])
app.include_router(product.router, prefix=settings.api_prefix, tags=["Product"])

@app.get("/")
def read_root():
    return {"message": "Welcome to NitiNova API"}
