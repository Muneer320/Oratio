# 🚀 Oratio Deployment Guide

Complete step-by-step guide to set up Oratio with Supabase, Render, and local development.

---

## 📋 Table of Contents

1. [Supabase Setup](#1-supabase-setup)
2. [Render Deployment](#2-render-deployment)
3. [Local Development Setup](#3-local-development-setup)
4. [Frontend Configuration](#4-frontend-configuration)
5. [Testing](#5-testing)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. 🗄️ Supabase Setup

### Step 1.1: Create Supabase Project

1. Go to https://supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Project Name:** `oratio`
   - **Database Password:** (Save this securely!)
   - **Region:** Choose closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

### Step 1.2: Complete Database Setup (All-in-One SQL Script)

1. In your Supabase project, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. **Copy ALL of this SQL** (creates tables + disables RLS for testing):

```sql
-- =====================================================
-- ORATIO DATABASE SETUP - Run this entire script!
-- =====================================================

-- 1. CREATE ALL TABLES
-- =====================================================

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms table
CREATE TABLE rooms (
    id BIGSERIAL PRIMARY KEY,
    room_code VARCHAR(10) UNIQUE NOT NULL,
    topic TEXT NOT NULL,
    host_id BIGINT REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'waiting',
    max_participants INTEGER DEFAULT 2,
    time_limit INTEGER DEFAULT 300,
    resources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Participants table
CREATE TABLE participants (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'participant',
    position VARCHAR(50),
    is_ready BOOLEAN DEFAULT FALSE,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turns table
CREATE TABLE turns (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE,
    speaker_id BIGINT REFERENCES participants(id),
    turn_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    duration INTEGER,
    ai_feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Results table
CREATE TABLE results (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE,
    winner_id BIGINT REFERENCES participants(id),
    scores JSONB,
    feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spectator votes table
CREATE TABLE spectator_votes (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE,
    voter_id BIGINT REFERENCES users(id),
    target_id BIGINT REFERENCES participants(id),
    vote_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trainer feedback table
CREATE TABLE trainer_feedback (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Uploaded files table
CREATE TABLE uploaded_files (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE,
    uploader_id BIGINT REFERENCES users(id),
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    feedback_type VARCHAR(50),
    message TEXT NOT NULL,
    rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE INDEXES
-- =====================================================

CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_code ON rooms(room_code);
CREATE INDEX idx_participants_room ON participants(room_id);
CREATE INDEX idx_participants_user ON participants(user_id);
CREATE INDEX idx_turns_room ON turns(room_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);

-- 3. DISABLE ROW LEVEL SECURITY (For Testing)
-- =====================================================
-- Note: Enable RLS in production for better security!

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

-- =====================================================
-- SETUP COMPLETE!
-- All tables created, indexes added, and RLS disabled.
-- =====================================================
```

4. Click **"Run"** (or press `Ctrl+Enter`)
5. **Wait** for "Success. No rows returned" message
6. **Verify**: Click **"Table Editor"** in the left sidebar - you should see all 10 tables!

### Step 1.3: Get Your Credentials (Just Copy 2 Things!)

1. Click **"Settings"** (gear icon in left sidebar)
2. Click **"API"**
3. **Copy these TWO values and save them somewhere:**

   ✅ **Project URL:** `https://xxxxx.supabase.co`

   ✅ **anon public key:** `eyJhbGc...` (long string under "Project API keys")

That's it! You're done with Supabase setup!

---

## 2. ☁️ Render Deployment

### Step 2.1: Prepare Your Repository

1. Make sure all changes are committed to GitHub:

```bash
git add .
git commit -m "Add Supabase and Render support with multi-tier fallback"
git push origin main
```

### Step 2.2: Create Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Select **"Create API key in new project"** or choose existing project
4. Copy the API key and save it (API `AIzaSyBbPZYct01k2PLyZ6kvGIYwdQcdIJntN00`)

### Step 2.3: Deploy to Render

1. Go to https://render.com and sign in (or create account)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository:

   - If first time: Click **"Connect GitHub"** and authorize
   - Search for your repository: `Oratio`
   - Click **"Connect"**

4. Configure the service:

   - **Name:** `oratio-backend` (or your choice)
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** Leave blank (or type `backend` if structure requires)
   - **Runtime:** `Python 3`
   - **Build Command:**
     ```bash
     pip install -r backend/requirements.txt
     ```
   - **Start Command:**
     ```bash
     cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```

5. **Environment Variables** - Click **"Advanced"** then add these:

   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=your_supabase_anon_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   API_ENV=production
   WS_PORT=8000
   CORS_ORIGINS=["https://your-frontend-url.com"]
   RENDER=true
   ```

6. Select **Free** plan (or paid if you prefer)
7. Click **"Create Web Service"**
8. Wait 5-10 minutes for deployment
9. Once deployed, you'll get a URL like: `https://oratio-backend.onrender.com`

### Step 2.4: Test Render Deployment

```bash
curl https://oratio-backend.onrender.com/health
```

Should return:

```json
{
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0"
}
```

---

## 3. 💻 Local Development Setup

### Step 3.1: Install Python and Dependencies

**Windows:**

1. Download Python 3.11+ from https://www.python.org/downloads/
2. During installation, check **"Add Python to PATH"**
3. Open PowerShell and verify:

```powershell
python --version
```

**Create Virtual Environment:**

```powershell
# Navigate to project
cd C:\Users\munee\MuneerBackup\Muneer\MainFolder\CodingPractices\Hackaton\Oratio

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# If you get execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 3.2: Install Python Packages

```powershell
# Make sure venv is activated (you should see (venv) in prompt)
cd backend
pip install -r requirements.txt
```

This will install:

- FastAPI
- Uvicorn
- Supabase
- Google Generative AI
- And all other dependencies

### Step 3.3: Create Environment File

Create `.env` file in the `backend` folder:

```powershell
# In backend folder
New-Item -Path .env -ItemType File
notepad .env
```

Add these variables:

```env
# Supabase (Primary Database)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here

# Google Gemini AI (Primary AI)
GEMINI_API_KEY=your_gemini_api_key_here

# Replit (Fallback - optional for local dev)
# REPL_ID=your-repl-id
# REPL_OWNER=your-username

# API Configuration
API_ENV=development
WS_PORT=8000
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# Render flag (leave false for local)
RENDER=false
```

### Step 3.4: Install Node.js and Frontend Dependencies

**Install Node.js:**

1. Download from https://nodejs.org/ (LTS version)
2. Install and verify:

```powershell
node --version
npm --version
```

**Install Frontend Dependencies:**

```powershell
# Navigate to frontend folder
cd ..\frontend

# Install dependencies
npm install
```

### Step 3.5: Configure Frontend for Local Development

Edit `frontend/src/config.js` (or wherever your API URL is configured):

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8000" // Local development
    : "https://oratio-backend.onrender.com"); // Production

export default {
  apiUrl: API_BASE_URL,
  // ... other config
};
```

Or create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

---

## 4. ▶️ Running Locally

### Step 4.1: Start Backend Server

Open **Terminal 1** (PowerShell):

```powershell
# Navigate to backend
cd C:\Users\munee\MuneerBackup\Muneer\MainFolder\CodingPractices\Hackaton\Oratio\backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:

```
============================================================
🚀 Oratio API Starting...
============================================================

📦 Features Status:
   Database: ✅ Supabase (Primary)
   AI Provider: ✅ Gemini AI (Primary)
   Backend: ✅ Replit (Dev)
   Replit Auth: ⚠️  (using simple auth)
   Environment: development
   REPL ID: None

============================================================
✅ Oratio API ready at http://0.0.0.0:8000
============================================================

INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Test it:**
Open browser: http://localhost:8000/docs
You should see the FastAPI Swagger documentation.

### Step 4.2: Start Frontend Development Server

Open **Terminal 2** (PowerShell):

```powershell
# Navigate to frontend
cd C:\Users\munee\MuneerBackup\Muneer\MainFolder\CodingPractices\Hackaton\Oratio\frontend

# Start dev server
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Open your browser:** http://localhost:5173

---

## 5. 🧪 Testing the Fallback System

### Test Database Fallback

**Test 1: Supabase (Primary)**

```powershell
# With correct Supabase credentials in .env
uvicorn app.main:app --reload
# Should show: Database: ✅ Supabase (Primary)
```

**Test 2: Replit DB Fallback**

```powershell
# Remove Supabase credentials temporarily
# Comment out SUPABASE_URL and SUPABASE_KEY in .env

uvicorn app.main:app --reload
# Should show: Database: ✅ Replit DB (Fallback)
```

### Test AI Fallback

**Test 1: Gemini AI (Primary)**

```powershell
# With correct GEMINI_API_KEY in .env
# Make any debate turn - AI feedback should work
```

**Test 2: Replit AI Fallback**

```powershell
# Remove Gemini API key temporarily
# Comment out GEMINI_API_KEY in .env
# AI will use Replit AI instead
```

---

## 6. 🐛 Troubleshooting

### Backend Won't Start

**Error: `ModuleNotFoundError: No module named 'supabase'`**

```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Reinstall requirements
pip install -r requirements.txt
```

**Error: `Port 8000 already in use`**

```powershell
# Kill the process using port 8000
netstat -ano | findstr :8000
# Note the PID (last column)
taskkill /PID <PID_NUMBER> /F

# Or use different port
uvicorn app.main:app --reload --port 8001
```

### Frontend Can't Connect to Backend

**Error: `Network Error` or `CORS error`**

1. Check backend is running: http://localhost:8000/docs
2. Check CORS_ORIGINS in `.env`:
   ```env
   CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
   ```
3. Restart backend after changing `.env`

### Supabase Connection Issues

**Error: `Supabase connection failed`**

1. Verify credentials:

   ```powershell
   # In backend folder with venv activated
   python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(f'URL: {os.getenv(\"SUPABASE_URL\")}'); print(f'Key: {os.getenv(\"SUPABASE_KEY\")[:20]}...')"
   ```

2. Test Supabase connection manually:

   ```python
   from supabase import create_client
   supabase = create_client("YOUR_URL", "YOUR_KEY")
   result = supabase.table("users").select("*").limit(1).execute()
   print(result)
   ```

3. Check Supabase dashboard for API status

### Render Deployment Issues

**Build fails:**

- Check `Build Command` is correct
- Verify `requirements.txt` is in `backend/` folder
- Check logs in Render dashboard

**Deploy succeeds but app crashes:**

- Check environment variables are set
- Look at logs: Click "Logs" in Render dashboard
- Verify `Start Command` is correct

---

## 7. 📊 Quick Reference

### Useful Commands

```powershell
# Backend
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload                    # Development
uvicorn app.main:app --host 0.0.0.0 --port 8000  # Production-like

# Frontend
cd frontend
npm run dev           # Development
npm run build         # Production build
npm run preview       # Test production build

# Check Python packages
pip list
pip show supabase

# Check Node packages
npm list

# Git
git status
git add .
git commit -m "Your message"
git push origin main
```

### Important URLs

- **Local Backend:** http://localhost:8000
- **Local Backend API Docs:** http://localhost:8000/docs
- **Local Frontend:** http://localhost:5173
- **Render Backend:** https://oratio-backend.onrender.com
- **Supabase Dashboard:** https://supabase.com/dashboard

### Environment Variable Checklist

**Required for Backend:**

- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_KEY`
- ✅ `GEMINI_API_KEY`
- ✅ `CORS_ORIGINS`

**Optional:**

- `API_ENV` (default: development)
- `WS_PORT` (default: 8000)
- `RENDER` (auto-set by Render)

---

## 8. 🎯 Next Steps

After setup is complete:

1. **Test all features locally:**

   - Create account
   - Create debate room
   - Join room
   - Start debate
   - Test AI feedback

2. **Deploy frontend:**

   - Option A: Vercel/Netlify
   - Option B: Render Static Site
   - Update CORS_ORIGINS with frontend URL

3. **Configure production settings:**

   - Enable Supabase RLS
   - Set up proper authentication
   - Configure rate limiting

4. **Monitor and optimize:**
   - Check Render logs
   - Monitor Supabase usage
   - Test fallback scenarios

---

## 🆘 Need Help?

If you encounter issues:

1. Check the logs (Render dashboard or local terminal)
2. Verify all environment variables are set correctly
3. Test each service independently (Supabase, Gemini AI)
4. Check the ARCHITECTURE_UPDATE.md for system design details

---

**Last Updated:** November 8, 2025
**Version:** 1.0.0
