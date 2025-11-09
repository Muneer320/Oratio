from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import ORJSONResponse
from datetime import datetime
from app.config import settings
from app.replit_db import REPLIT_DB_AVAILABLE
from app.gemini_ai import GEMINI_AVAILABLE, REPLIT_AI_AVAILABLE
from app.replit_auth import REPLIT_AUTH_AVAILABLE
import os

from app.routers import auth, rooms, participants, spectators, debate, ai, trainer, uploads, utils, user
from app.socketio_app import sio
import socketio

# Create FastAPI app with orjson for 3-5x faster JSON serialization
app = FastAPI(
    title="Oratio - AI Debate Platform",
    description="Backend API for Oratio debate platform with AI judging",
    version="1.0.0",
    default_response_class=ORJSONResponse  # Use orjson for all responses (3-5x faster)
)

# Mount Socket.IO
socket_app = socketio.ASGIApp(sio, app)

# Performance Middlewares (order matters - GZIP should be first)
# GZIP Compression - reduces payload size by 60-80% for responses >500 bytes
app.add_middleware(GZipMiddleware, minimum_size=500, compresslevel=6)

# CORS Middleware - Production & Development origins
allowed_origins = [
    "https://orat-io.replit.app",  # Production
    "http://localhost:5000",  # Local dev
    "http://127.0.0.1:5000",  # Local dev alternative
]

# Add Replit dev domains if available
replit_domains = os.getenv("REPLIT_DOMAINS", "").split(",")
for domain in replit_domains:
    if domain.strip():
        allowed_origins.append(f"https://{domain.strip()}")
        allowed_origins.append(f"http://{domain.strip()}")

print(f"🔗 Allowed CORS origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(rooms.router)
app.include_router(participants.router)
app.include_router(spectators.router)
app.include_router(debate.router)
app.include_router(ai.router)
app.include_router(trainer.router)
app.include_router(uploads.router)
app.include_router(utils.router)
app.include_router(user.router)


# Startup and shutdown events
@app.on_event("startup")
async def startup():
    """Run on application startup"""
    print("=" * 60)
    print("🚀 Oratio API Starting...")
    print("=" * 60)

    # Detect if running on Render
    is_render = os.getenv("RENDER") == "true"

    # Check features availability
    features = {
        "Database": "✅ Replit DB" if REPLIT_DB_AVAILABLE else "⚠️  In-memory",
        "AI Provider": "✅ Gemini AI (Primary)" if GEMINI_AVAILABLE else
        ("✅ Replit AI (Fallback)" if REPLIT_AI_AVAILABLE else "⚠️  Static responses"),
        "Backend": "✅ Render (Production)" if is_render else "✅ Replit (Dev)",
        "Replit Auth": "✅" if REPLIT_AUTH_AVAILABLE else "⚠️  (using simple auth)",
        "Environment": settings.API_ENV,
        "REPL ID": settings.REPL_ID,
    }

    print("\n📦 Features Status:")
    for feature, status in features.items():
        print(f"   {feature}: {status}")

    print("\n" + "=" * 60)
    print(f"✅ Oratio API ready at http://0.0.0.0:{settings.WS_PORT}")
    print("=" * 60 + "\n")


@app.on_event("shutdown")
async def shutdown():
    """Run on application shutdown"""
    print("👋 Shutting down Oratio API...")


# Health check endpoint
@app.get("/api/utils/health")
async def health():
    return {
        "status": "ok",
        "message": "Oratio backend is healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": settings.API_ENV,
        "replit_features": {
            "database": REPLIT_DB_AVAILABLE,
            "gemini_ai": GEMINI_AVAILABLE,
            "auth": REPLIT_AUTH_AVAILABLE
        },
        "repl_info": {
            "id": settings.REPL_ID,
            "slug": settings.REPL_SLUG,
            "owner": settings.REPL_OWNER
        }
    }


@app.get("/")
async def root():
    return {
        "message": "Oratio API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/utils/health"
    }
