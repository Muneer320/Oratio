from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
from app.config import settings
from app.replit_db import connect_db, disconnect_db, REPLIT_DB_AVAILABLE
from app.gemini_ai import GEMINI_AVAILABLE
from app.replit_auth import REPLIT_AUTH_AVAILABLE

from app.routers import auth, rooms, participants, spectators, debate, ai, trainer, uploads, utils
from app.websockets import debate as ws_debate, spectator as ws_spectator, trainer as ws_trainer

# Create FastAPI app
app = FastAPI(
    title="Oratio - AI Debate Platform",
    description="Backend API for Oratio debate platform with Google Gemini AI judging",
    version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

# Include WebSocket routers
app.include_router(ws_debate.router)
app.include_router(ws_spectator.router)
app.include_router(ws_trainer.router)


# Startup and shutdown events
@app.on_event("startup")
async def startup():
    """Run on application startup"""
    print("=" * 60)
    print("🚀 Oratio API Starting...")
    print("=" * 60)

    # Connect to Replit Database
    await connect_db()

    # Check Replit features availability
    features = {
        "Replit Database":
        "✅" if REPLIT_DB_AVAILABLE else "⚠️  (using fallback)",
        "Gemini AI": "✅" if GEMINI_AVAILABLE else "⚠️  (using fallback)",
        "Replit Auth":
        "✅" if REPLIT_AUTH_AVAILABLE else "⚠️  (using simple auth)",
        "Environment": settings.API_ENV,
        "REPL ID": settings.REPL_ID,
    }

    print("\n📦 Replit Features Status:")
    for feature, status in features.items():
        print(f"   {feature}: {status}")

    print("\n" + "=" * 60)
    print(f"✅ Oratio API ready at http://0.0.0.0:{settings.WS_PORT}")
    print("=" * 60 + "\n")


@app.on_event("shutdown")
async def shutdown():
    """Run on application shutdown"""
    await disconnect_db()


# Health check endpoint
@app.get("/api/utils/health")
async def health():
    return JSONResponse({
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
    })


@app.get("/")
async def root():
    return {
        "message": "Oratio API - Powered by Google Gemini AI",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/utils/health"
    }
