# ⚡ Oratio Quick Start

**Get up and running in 5 minutes!**

---

## 🚀 Option 1: Automated Setup (Windows)

```powershell
# 1. Clone and navigate
git clone https://github.com/muneer320/oratio.git
cd oratio

# 2. Run setup script
.\setup.ps1

# 3. Add your API keys to backend/.env (see below)

# 4. Start backend
.\start-backend.ps1

# 5. Start frontend (new terminal)
.\start-frontend.ps1
```

**Done!** Open http://localhost:5173

---

## 📝 API Keys Setup

Create `backend/.env` file:

```env
# Get from: https://supabase.com → Your Project → Settings → API
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc...

# Get from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSyB...

# Local development
API_ENV=development
WS_PORT=8000
CORS_ORIGINS=["http://localhost:5173"]
```

---

## 🗄️ Supabase Database Setup

### One-Command Setup

1. Go to https://supabase.com and create a project
2. Open **SQL Editor** → **New Query**
3. Copy and paste this **entire script**:

```sql
-- Create all tables
CREATE TABLE users (id BIGSERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, full_name VARCHAR(255), avatar_url TEXT, bio TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE rooms (id BIGSERIAL PRIMARY KEY, room_code VARCHAR(10) UNIQUE NOT NULL, topic TEXT NOT NULL, host_id BIGINT REFERENCES users(id), status VARCHAR(50) DEFAULT 'waiting', max_participants INTEGER DEFAULT 2, time_limit INTEGER DEFAULT 300, resources JSONB DEFAULT '[]'::jsonb, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE participants (id BIGSERIAL PRIMARY KEY, room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE, user_id BIGINT REFERENCES users(id), role VARCHAR(50) DEFAULT 'participant', position VARCHAR(50), is_ready BOOLEAN DEFAULT FALSE, score INTEGER DEFAULT 0, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE turns (id BIGSERIAL PRIMARY KEY, room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE, speaker_id BIGINT REFERENCES participants(id), turn_number INTEGER NOT NULL, content TEXT NOT NULL, duration INTEGER, ai_feedback JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE results (id BIGSERIAL PRIMARY KEY, room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE, winner_id BIGINT REFERENCES participants(id), scores JSONB, feedback JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE spectator_votes (id BIGSERIAL PRIMARY KEY, room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE, voter_id BIGINT REFERENCES users(id), target_id BIGINT REFERENCES participants(id), vote_type VARCHAR(50), created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE trainer_feedback (id BIGSERIAL PRIMARY KEY, user_id BIGINT REFERENCES users(id), xp INTEGER DEFAULT 0, level INTEGER DEFAULT 1, strengths JSONB DEFAULT '[]'::jsonb, weaknesses JSONB DEFAULT '[]'::jsonb, recommendations JSONB DEFAULT '[]'::jsonb, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE uploaded_files (id BIGSERIAL PRIMARY KEY, room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE, uploader_id BIGINT REFERENCES users(id), filename VARCHAR(255) NOT NULL, file_path TEXT NOT NULL, file_type VARCHAR(50), file_size INTEGER, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE sessions (id VARCHAR(255) PRIMARY KEY, user_id BIGINT REFERENCES users(id), expires_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE feedback (id BIGSERIAL PRIMARY KEY, user_id BIGINT REFERENCES users(id), feedback_type VARCHAR(50), message TEXT NOT NULL, rating INTEGER, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());

-- Create indexes
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_code ON rooms(room_code);
CREATE INDEX idx_participants_room ON participants(room_id);
CREATE INDEX idx_participants_user ON participants(user_id);
CREATE INDEX idx_turns_room ON turns(room_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);

-- Disable RLS for testing (enable in production!)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE turns DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
ALTER TABLE spectator_votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;
```

4. Click **Run** (Ctrl+Enter)
5. Verify tables in **Table Editor**

---

## 🐛 Troubleshooting

### Backend won't start?

```powershell
# Install missing packages
cd backend
pip install -r requirements.txt
```

### Frontend won't start?

```bash
# Install dependencies
cd frontend
npm install
```

### Database not connecting?

The app works without Supabase! It automatically falls back to:

- Replit DB (if on Replit)
- In-memory storage (local development)

### Port already in use?

```powershell
# Backend on different port
cd backend
uvicorn app.main:app --reload --port 8001

# Frontend will still work at localhost:5173
```

---

## 📚 Next Steps

- **Full Setup Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Architecture Details**: [ARCHITECTURE_UPDATE.md](./ARCHITECTURE_UPDATE.md)
- **API Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## ✅ What's Working

| Feature                      | Status |
| ---------------------------- | ------ |
| Multi-tier database fallback | ✅     |
| Multi-tier AI fallback       | ✅     |
| REST API                     | ✅     |
| WebSockets                   | ✅     |
| File uploads                 | ✅     |
| Authentication               | ✅     |
| Debate flow                  | ✅     |
| AI judging                   | ✅     |

**You're ready to start developing!** 🎉

---

## 🆘 Need Help?

1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions
2. Open an issue on [GitHub](https://github.com/muneer320/oratio/issues)
3. Read the troubleshooting section in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**Happy Coding!** 🚀
