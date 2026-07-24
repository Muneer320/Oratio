# Oratio — AI-Powered Debate Arena

**Built for Replit Vibeathon. Real-time voice/text debates judged by AI using the LCR Model (Logic, Credibility, Rhetoric).**

Oratio transforms traditional debates into interactive, AI-enhanced experiences — with WebSocket rooms, live AI judging, spectator gamification, and personalized AI training feedback.

---

## Features

- **Voice + Text Debate:** Speak or type arguments with real-time WebSocket broadcast
- **AI Judge (LCR Model):** Logic (40%), Credibility (35%), Rhetoric (25%) — with fact-checking via Serper API
- **Spectator Gamification:** Join rooms in view-only mode, send emoji rewards, view live analytics
- **AI Trainer Mode:** Post-debate personalized feedback, XP progression, badges, leaderboards
- **Multi-Tier Fallback:** Gemini AI → Replit AI → Static fallback. Replit DB → In-Memory Dict

## Tech Stack

- **Frontend:** React 18, TailwindCSS, Framer Motion, Web Speech API, WebSockets
- **Backend:** FastAPI 0.95+, Pydantic 2.0+, Uvicorn, WebSockets, ORJSONResponse
- **AI:** Google Gemini (gemini-2.5-pro) → Replit AI (chat-bison) → Static fallback
- **Database:** Replit DB (key-value) / In-Memory Dict
- **Auth:** Replit Auth / Simple JWT
- **Deployment:** Replit, Docker + Docker Compose

## Quick Start

```bash
git clone https://github.com/Muneer320/Oratio.git
cd Oratio

# Docker (recommended)
docker compose up --build

# Or manual:
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000
cd frontend && npm install && npm run dev
```

## System Architecture

```
Frontend (React + TailwindCSS + WebSockets)
    ↕ REST + WebSocket
Backend (FastAPI + WebSockets)
    ↕ API calls
AI Layer (Gemini → Replit AI → Static Fallback)
Database (Replit DB → In-Memory Dict)
```

## API

40+ endpoints across Auth, Room Management, Participants, Spectators, Debate Flow, AI Judging, Trainer, Uploads, and Utilities. Full WebSocket support for live debate updates.

---

*Built for Replit Vibeathon by Muneer Alam. MIT License.*