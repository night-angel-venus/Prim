from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.utils.rate_limit import limiter

# ! API ROUTERS
from app.api import auth_router

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from starlette.middleware.base import BaseHTTPMiddleware
import os


app = FastAPI(title="Prim", version="0.1.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

class SecurityHeader(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        return response

app.add_middleware(SecurityHeader)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"Welcome to PRIM"}

app.include_router(auth_router)