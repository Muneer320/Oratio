# Oratio

Oratio is a debate room prototype built for the Replit Vibeathon. Participants submit text or recorded audio, spectators can join and react, and a Gemini judge can score turns on logic, credibility, and rhetoric. Socket.IO carries live room updates.

## Run locally

Requirements: Python 3.11+, Node.js 22+, and a Gemini API key for AI judging, training opponents, and audio transcription.

```bash
cd backend
python -m venv .venv
# Activate .venv for your shell
pip install -r requirements.txt
# Set GEMINI_API_KEY in your environment or backend/.env
uvicorn app.main:socket_app --reload --host 127.0.0.1 --port 8000
```

In another terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5000`. The Vite server proxies `/api` and `/socket.io` to the backend. `docker compose up --build` builds the same app behind nginx at `http://localhost:8080`; Compose loads the optional, ignored `backend/.env` file.

## How judging works

After a round fills, Gemini receives the topic and earlier turns and returns structured scores from 0 to 10. Final scores weight logic 40%, credibility 35%, and rhetoric 25%. A winner is selected only when every debater has a judged turn and all their turns have valid scores; ties have no winner. If the API key is absent or judging fails, the result says `judged: false` and leaves the winner empty. Serper search, when configured, returns leads for manual fact checking; it does not verify a claim automatically.

Training rooms are identified by topics beginning with `AI Training:`. The AI opponent responds after the human turn. A Gemini key is required for this mode.

## Storage and deployment limits

The backend uses Replit DB when available. Outside Replit it stores accounts, sessions, rooms, and turns in `backend/data/oratio.sqlite3`. Docker Compose keeps the SQLite file and uploaded audio in named volumes. Uploaded audio is available to room members through an authenticated API route. A multi-instance deployment would need shared storage and a coordinated real-time backend.

Local passwords use scrypt hashes and login sessions expire after seven days. Existing plaintext records are upgraded when their owners log in. Debate transcripts, status, and results require a valid session and room membership. Socket.IO room joins enforce the same membership check.

## API and real time

FastAPI documents the active routes at `/docs`. Common routes include `/api/auth/register`, `/api/auth/login`, `/api/rooms/create`, `/api/rooms/code/{code}`, `/api/participants/join`, `/api/spectators/join`, `/api/debate/{room_id}/submit-turn`, `/api/debate/{room_id}/submit-audio`, `/api/debate/{room_id}/status`, `/api/debate/{room_id}/transcript`, `/api/debate/{room_id}/end`, and `/api/ai/summary/{room_id}`. Socket.IO uses `/socket.io/`; clients send their bearer token in the Socket.IO `auth` payload and emit `join_room` with a `room_id`. There are no `/ws/*` routes.

The frontend uses the room, debate, and auth routes. Trainer challenge and resource upload routes are exposed but are prototype features without complete frontend flows. Audio recording uses the browser MediaRecorder API; transcription requires Gemini. See [API documentation](API_DOCUMENTATION.md) and [quick start](QUICKSTART.md).

## Verify

```bash
cd backend && python -m unittest discover -s tests -v
cd ../frontend && npm run build && npm audit
```

Licensed under MIT; see [LICENSE](LICENSE).
