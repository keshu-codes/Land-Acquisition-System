import os
import re
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from .routers import projects, parcels, beneficiaries, dashboard, auth

# Application instance
app = FastAPI(title="National Land Acquisition System API", version="1.0.0")

# Strict CORS configuration using Origin Regex validation
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.trycloudflare\.com|http://localhost:\d+|http://127\.0\.0\.1:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to sanitize string parameters recursively (Stored XSS mitigation)
def sanitize_value(val):
    if isinstance(val, str):
        # Strips HTML/Script tags to prevent execution in database
        clean = re.sub(r'<[^>]*>', '', val)
        return clean
    elif isinstance(val, dict):
        return {k: sanitize_value(v) for k, v in val.items()}
    elif isinstance(val, list):
        return [sanitize_value(i) for i in val]
    return val

# Custom XSS Sanitization Middleware
class XSSSanitizationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Only sanitize write payloads with JSON bodies
        if request.method in ["POST", "PUT", "PATCH"] and "application/json" in request.headers.get("content-type", ""):
            body_bytes = await request.body()
            if body_bytes:
                try:
                    data = json.loads(body_bytes.decode('utf-8'))
                    sanitized_data = sanitize_value(data)
                    sanitized_body = json.dumps(sanitized_data).encode('utf-8')
                    
                    # Override request receiver with sanitized payload
                    async def receive():
                        return {"type": "http.request", "body": sanitized_body, "more_body": False}
                    
                    request._receive = receive
                except Exception:
                    pass
        
        response = await call_next(request)
        return response

app.add_middleware(XSSSanitizationMiddleware)

# Include routers under /api/v1
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(projects.router, prefix="/api/v1", tags=["projects"])
app.include_router(parcels.router, prefix="/api/v1", tags=["parcels"])
app.include_router(beneficiaries.router, prefix="/api/v1", tags=["beneficiaries"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["dashboard"])

# Initialize database on startup
@app.on_event("startup")
def on_startup():
    from .database import init_db
    init_db()
