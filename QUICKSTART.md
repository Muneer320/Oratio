# ⚡ Oratio Quick Start# 🚀 Quick Start Guide

The fastest way to get Oratio running locally!Get Oratio up and running in minutes!

## 🚀 One-Time Setup---

### 1. Get Your Credentials First## 🎯 **Option 1: Deploy on Replit (Recommended)**

Before running anything, get these ready:**Best for**: Hackathon demos, quick testing, zero configuration

**Supabase (2 minutes):**### Steps

1. Go to https://supabase.com → Create account/Sign in

2. Create new project → Wait for it to initialize1. **Import to Replit**

3. Go to Settings → API → Copy:

   - `Project URL` (e.g., https://xxxxx.supabase.co) - Go to [replit.com](https://replit.com)

   - `anon public` key (long string) - Click "Create Repl" → "Import from GitHub"

4. Go to SQL Editor → Run the SQL from `DEPLOYMENT_GUIDE.md` Section 1.2 - Paste repository URL

   - Click "Import from GitHub"

**Gemini API Key (1 minute):**

1. Go to https://aistudio.google.com/app/apikey2. **Configure Secrets (Optional)**

2. Click "Create API Key" → Copy it

   - Click 🔒 **Secrets** tab in left sidebar

### 2. Run Setup Script - Add `SERPER_API_KEY` for fact-checking (get free key at [serper.dev](https://serper.dev))

- Add `SECRET_KEY` (or let it auto-generate)

Open PowerShell in the project root folder:

3. **Click ▶️ Run**

```powershell

# Run the setup script   - Backend starts automatically on port 8000

.\setup.ps1   - Frontend served via Vite on port 5173

```

4. **Access Your App**

This will: - Backend API: `https://[repl-name].[username].repl.co/docs`

- ✅ Check Python & Node.js - Health check: `https://[repl-name].[username].repl.co/api/utils/health`

- ✅ Create virtual environment

- ✅ Install all Python packages### ✅ Verification

- ✅ Install all Node packages

- ✅ Create `.env` templateCheck the console output for:

### 3. Add Your Credentials```

✅ Replit Database: Available

Edit `backend/.env` file:✅ Replit AI: Available

✅ Replit Auth: Available

````powershellINFO: Uvicorn running on http://0.0.0.0:8000

notepad backend\.env```

````

📖 **Detailed Replit Guide**: See [REPLIT_SETUP.md](REPLIT_SETUP.md)

Replace these lines with your actual values:

````env---

SUPABASE_URL=https://xxxxx.supabase.co

SUPABASE_KEY=your_actual_anon_key_here## 💻 **Option 2: Local Development**

GEMINI_API_KEY=your_actual_gemini_key_here

```**Best for**: Contributing, offline work, full control



Save and close.### Prerequisites



---- **Python 3.11+**

- **Node.js 18+**

## ▶️ Running Locally (Every Time)- **Git**



### Option A: Use Start Scripts (Recommended)---



**Terminal 1 - Backend:**### Backend Setup

```powershell

.\start-backend.ps11. **Clone the repository**

````

````bash

**Terminal 2 - Frontend:**   git clone https://github.com/yourusername/oratio.git

```powershell   cd oratio

.\start-frontend.ps1   ```

````

2. **Navigate to backend**

### Option B: Manual Start

````bash

**Terminal 1 - Backend:**   cd backend

```powershell   ```

cd backend

.\venv\Scripts\Activate.ps13. **Create virtual environment**

uvicorn app.main:app --reload

```   ```bash

python -m venv .venv

**Terminal 2 - Frontend:**   ```

```powershell

cd frontend4. **Activate virtual environment**

npm run dev

```   - **Windows (PowerShell)**:



---     ```powershell

  .\.venv\Scripts\Activate.ps1

## 🌐 Access Your App     ```



- **Frontend:** http://localhost:5173   - **Windows (CMD)**:

- **Backend API Docs:** http://localhost:8000/docs

- **Backend API:** http://localhost:8000     ```cmd

  .venv\Scripts\activate.bat

---     ```



## 🛑 Stopping the Servers   - **Linux/Mac**:

  ```bash

Press `Ctrl+C` in each terminal window.     source .venv/bin/activate

  ```

---

5. **Install dependencies**

## 🐛 Common Issues

```bash

### "execution policy" error   pip install -r requirements.txt

```powershell   ```

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

```6. **Set up environment variables**



### "Port 8000 already in use"   ```bash

```powershell   cp ../.env.example .env

# Kill the process   ```

netstat -ano | findstr :8000

taskkill /PID <PID_NUMBER> /F   Edit `.env` and configure:

````

````bash

### "Module not found" error   SECRET_KEY=your_secret_key_here

```powershell   SERPER_API_KEY=your_serper_key_here  # Optional

cd backend   ```

.\venv\Scripts\Activate.ps1

pip install -r requirements.txt7. **Run the backend**

```   ```bash

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

### Backend shows "Replit DB (Fallback)" instead of "Supabase (Primary)"   ```

- Check your `.env` file has correct `SUPABASE_URL` and `SUPABASE_KEY`

- Restart the backend server✅ **Backend running at**: http://127.0.0.1:8000



---- API docs: http://127.0.0.1:8000/docs

- Health check: http://127.0.0.1:8000/api/utils/health

## 📦 Project Structure

---

````

Oratio/### Frontend Setup

├── backend/ # FastAPI backend

│ ├── app/1. **Open new terminal** and navigate to frontend

│ │ ├── main.py # Entry point

│ │ ├── routers/ # API endpoints ```bash

│ │ ├── supabase_db.py # Database layer cd frontend

│ │ └── gemini_ai.py # AI integration ```

│ ├── requirements.txt

│ └── .env # Your credentials (create this!)2. **Install dependencies**

├── frontend/ # React frontend

│ ├── src/ ```bash

│ ├── package.json npm install

│ └── .env.local # Optional frontend config ```

├── setup.ps1 # One-time setup script

├── start-backend.ps1 # Start backend server3. **Configure environment**

└── start-frontend.ps1 # Start frontend server

`   `bash

# Create .env file

--- echo "VITE_API_URL=http://localhost:8000" > .env

echo "VITE_WS_URL=ws://localhost:8000" >> .env

## 🎯 What You Should See ```

### Backend Terminal:4. **Run the development server**

`   `bash

============================================================ npm run dev

🚀 Oratio API Starting... ```

============================================================

✅ **Frontend running at**: http://localhost:5173

📦 Features Status:

Database: ✅ Supabase (Primary)---

AI Provider: ✅ Gemini AI (Primary)

Backend: ✅ Replit (Dev)## 🐳 **Option 3: Using Docker (Alternative)**

...

**Best for**: Production-like testing, containerized environments

✅ Oratio API ready at http://0.0.0.0:8000

============================================================### Prerequisites

```

- Docker Desktop installed and running

### Frontend Terminal:- Docker Compose installed

```

VITE v5.x.x ready in xxx ms### Steps

➜ Local: http://localhost:5173/1. **Clone and navigate**

➜ Network: use --host to expose

`   `bash

git clone https://github.com/yourusername/oratio.git

--- cd oratio

````

## 📚 More Info

2. **Set up environment**

- **Full Setup Guide:** `DEPLOYMENT_GUIDE.md`

- **Architecture Details:** `ARCHITECTURE_UPDATE.md`   ```bash

- **API Documentation:** http://localhost:8000/docs (when backend is running)   cp .env.example .env

# Edit .env with your settings

---   ```



## 🎉 First Time Running?3. **Build and start**



1. ✅ Run `.\setup.ps1`   ```bash

2. ✅ Edit `backend\.env` with your credentials   docker-compose up --build

3. ✅ Run `.\start-backend.ps1` in one terminal   ```

4. ✅ Run `.\start-frontend.ps1` in another terminal

5. ✅ Open http://localhost:5173 in your browser4. **Access the application**

6. 🎊 You're done!

- Frontend: http://localhost

---   - Backend API: http://localhost/api/utils/health

- Backend Direct: http://localhost:8000/docs

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.

5. **Stop the application**
```bash
docker-compose down
````

---

## 🧪 **Testing the Setup**

### Backend Health Check

**Using curl:**

```bash
curl http://localhost:8000/api/utils/health
```

**Using browser:**
Navigate to: http://localhost:8000/api/utils/health

**Expected Response:**

```json
{
  "status": "ok",
  "message": "Oratio backend is healthy",
  "replit_features": {
    "database": false,
    "ai": false,
    "auth": false
  },
  "repl_info": null
}
```

> **Note**: `replit_features` will show `true` when running on Replit

---

### Frontend Check

Open http://localhost:5173 in your browser.

**You should see:**

- 🎨 Oratio landing page
- 🔵 Blue/indigo themed UI
- 🔘 "Host Debate", "Join Debate", "Train with AI" buttons

---

### API Documentation

Visit http://localhost:8000/docs for:

- Interactive API playground
- Endpoint documentation
- Request/response schemas
- Try out API calls directly

---

## 🎯 **Next Steps**

### For Users

1. ✅ Verify setup is working
2. 📖 Read the [README.md](README.md) for features
3. 🎤 Create your first debate room
4. 🤖 Try the AI trainer

### For Contributors

1. ✅ Complete setup
2. 📖 Read [CONTRIBUTING.md](CONTRIBUTING.md)
3. 🔍 Check open issues on GitHub
4. 🚀 Pick a feature to implement

---

## 🐛 **Troubleshooting**

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'replit'`

```bash
# Solution: Packages are optional for local dev
pip install replit replit-ai
# Or: Features will use fallback mode
```

**Problem**: Port 8000 already in use

```bash
# Solution: Use different port
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

**Problem**: Database errors

```bash
# Solution: Local mode uses in-memory storage
# No additional setup needed
```

---

### Frontend Issues

**Problem**: `npm install` fails

```bash
# Solution: Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Vite dev server won't start

```bash
# Solution: Check port 5173 availability
# Or change port in vite.config.js
```

**Problem**: API calls failing (CORS errors)

```bash
# Solution: Verify backend is running
# Check VITE_API_URL in .env matches backend
```

---

### Docker Issues

**Problem**: Docker won't start

```bash
# Solution: Ensure Docker Desktop is running
# Restart Docker service
```

**Problem**: Port conflicts

```bash
# Solution: Stop other services using ports 80, 8000
# Or modify docker-compose.yml ports
```

**Problem**: Build failures

```bash
# Solution: Clean rebuild
docker-compose down -v
docker system prune -a
docker-compose up --build
```

---

### Replit Issues

**Problem**: "Replit Database unavailable"

```bash
# Solution: Check Replit status page
# Try restarting the Repl
```

**Problem**: "Replit AI not responding"

```bash
# Solution: Check Replit AI quota
# Fallback responses will be used
```

---

## 📚 **Additional Resources**

- 📖 [Full Documentation](README.md)
- 🔧 [Replit Setup Guide](REPLIT_SETUP.md)
- 🤝 [Contributing Guidelines](CONTRIBUTING.md)
- 📝 [Changelog](CHANGELOG.md)
- 🐛 [Report Issues](https://github.com/yourusername/oratio/issues)

---

## 💡 **Quick Tips**

- 🔄 **Auto-reload**: Both backend and frontend support hot reload
- 📝 **API Docs**: Always available at `/docs` endpoint
- 🎨 **Tailwind**: Use utility classes for quick styling
- 🔍 **Debug**: Check browser console and terminal logs
- 🤖 **AI Features**: Work best on Replit with built-in AI

---

**Happy Debating! 🎤**
