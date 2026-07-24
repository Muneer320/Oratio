# Quick start

See [README](README.md) for features and storage limits.

1. Install Python 3.11+ and Node.js 22+.
2. In `backend`, create a virtual environment and install `pip install -r requirements.txt`.
3. Set `GEMINI_API_KEY` in `backend/.env` or your shell for judging, AI opponents, and transcription. Without it, normal text rooms still work but results stay unjudged.
4. Start the backend with `uvicorn app.main:socket_app --reload --host 127.0.0.1 --port 8000` from `backend`.
5. In `frontend`, run `npm ci` then `npm run dev`.
6. Open `http://localhost:5000`, register an account, and create or join a room.

The backend stores local data in `backend/data/oratio.sqlite3`. Docker Compose keeps data and uploaded audio in named volumes and serves the app at `http://localhost:8080`.
