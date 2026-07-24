"""FastAPI and Socket.IO application entry point."""

from contextlib import asynccontextmanager
import asyncio
from datetime import datetime, timezone

import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import ORJSONResponse

from app.config import settings
from app.gemini_ai import GEMINI_AVAILABLE
from app.replit_db import STORAGE_BACKEND
from app.routers import auth, rooms, participants, spectators, debate, ai, trainer, uploads, utils, user
from app.socketio_app import sio
from app.routers.debate import recover_pending_debates


@asynccontextmanager
async def lifespan(_app):
    print(f"Oratio starting: storage={STORAGE_BACKEND}, "
          f"Gemini={'available' if GEMINI_AVAILABLE else 'unavailable'}")
    recovery = asyncio.create_task(recover_pending_debates())
    yield
    recovery.cancel()
    print("Oratio shutting down")


app = FastAPI(
    title="Oratio - AI Debate Platform",
    description="Backend API for debate rooms with optional AI judging",
    version="1.0.0",
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
)
socket_app = socketio.ASGIApp(sio, app)

app.add_middleware(GZipMiddleware, minimum_size=500, compresslevel=6)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in (auth.router, rooms.router, participants.router, spectators.router,
               debate.router, ai.router, trainer.router, uploads.router,
               utils.router, user.router):
    app.include_router(router)


@app.get("/api/utils/health")
async def health():
    return {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "environment": settings.API_ENV,
        "storage": STORAGE_BACKEND,
        "gemini_ai": GEMINI_AVAILABLE,
    }


@app.get("/")
async def root():
    return {"message": "Oratio API", "docs": "/docs", "health": "/api/utils/health"}
