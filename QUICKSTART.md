# ⚡ Oratio Quick Start# ⚡ Oratio Quick Start# 🚀 Quick Start Guide

**Get up and running in 5 minutes!**The fastest way to get Oratio running locally!Get Oratio up and running in minutes!

**Version:** 2.0.0 ## 🚀 One-Time Setup---

**Last Updated:** November 8, 2025

### 1. Get Your Credentials First## 🎯 **Option 1: Deploy on Replit (Recommended)**

---

Before running anything, get these ready:**Best for**: Hackathon demos, quick testing, zero configuration

## 🚀 Automated Setup (Windows - Recommended)

**Supabase (2 minutes):**### Steps

### One Command Setup

1. Go to https://supabase.com → Create account/Sign in

```powershell

# 1. Clone the repository2. Create new project → Wait for it to initialize1. **Import to Replit**

git clone https://github.com/muneer320/oratio.git

cd oratio3. Go to Settings → API → Copy:



# 2. Run automated setup   - `Project URL` (e.g., https://xxxxx.supabase.co) - Go to [replit.com](https://replit.com)

.\setup.ps1

   - `anon public` key (long string) - Click "Create Repl" → "Import from GitHub"

# 3. Add your API keys (see below)

notepad backend\.env4. Go to SQL Editor → Run the SQL from `DEPLOYMENT_GUIDE.md` Section 1.2 - Paste repository URL



# 4. Start backend   - Click "Import from GitHub"

.\start-backend.ps1

**Gemini API Key (1 minute):**

# 5. Start frontend (new terminal)

.\start-frontend.ps11. Go to https://aistudio.google.com/app/apikey2. **Configure Secrets (Optional)**

```

2. Click "Create API Key" → Copy it

**Done!** Open http://localhost:5173

- Click 🔒 **Secrets** tab in left sidebar

---

### 2. Run Setup Script - Add `SERPER_API_KEY` for fact-checking (get free key at [serper.dev](https://serper.dev))

## 📝 Configure Environment

- Add `SECRET_KEY` (or let it auto-generate)

Edit `backend/.env` and add your credentials:

Open PowerShell in the project root folder:

````env

# Supabase Database (Primary)3. **Click ▶️ Run**

# Get from: https://supabase.com → Your Project → Settings → API

SUPABASE_URL=https://xxxxx.supabase.co```powershell

SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Run the setup script   - Backend starts automatically on port 8000

# Google Gemini AI (Primary)

# Get from: https://aistudio.google.com/app/apikey.\setup.ps1   - Frontend served via Vite on port 5173

GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxx

````

# Local Development

API_ENV=development4. **Access Your App**

WS_PORT=8000

CORS_ORIGINS=["http://localhost:5173"]This will: - Backend API: `https://[repl-name].[username].repl.co/docs`

`````

- ✅ Check Python & Node.js - Health check: `https://[repl-name].[username].repl.co/api/utils/health`

---

- ✅ Create virtual environment

## 🗄️ Supabase Quick Setup

- ✅ Install all Python packages### ✅ Verification

### One SQL Script

- ✅ Install all Node packages

1. Go to https://supabase.com → Create a new project

2. Click **SQL Editor** → **New Query**- ✅ Create `.env` templateCheck the console output for:

3. Copy the entire SQL script from [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#step-12-complete-database-setup-all-in-one-sql-script) Section 1.2

4. Click **Run** (Ctrl+Enter)### 3. Add Your Credentials```

5. Verify tables appear in **Table Editor**

✅ Replit Database: Available

**Or use the simplified version from [QUICKSTART_SIMPLE.md](./QUICKSTART_SIMPLE.md)**

Edit `backend/.env` file:✅ Replit AI: Available

---

✅ Replit Auth: Available

## 💻 Manual Setup (All Platforms)

````powershellINFO: Uvicorn running on http://0.0.0.0:8000

### Backend

notepad backend\.env```

```bash

# Navigate to backend````

cd backend

📖 **Detailed Replit Guide**: See [REPLIT_SETUP.md](REPLIT_SETUP.md)

# Create virtual environment

python -m venv venvReplace these lines with your actual values:



# Activate virtual environment````env---

# Windows PowerShell:

venv\Scripts\Activate.ps1SUPABASE_URL=https://xxxxx.supabase.co



# Windows CMD:SUPABASE_KEY=your_actual_anon_key_here## 💻 **Option 2: Local Development**

venv\Scripts\activate.bat

GEMINI_API_KEY=your_actual_gemini_key_here

# Linux/Mac:

source venv/bin/activate```**Best for**: Contributing, offline work, full control



# Install dependencies

pip install -r requirements.txt

Save and close.### Prerequisites

# Create .env file

cp ../.env.example .env

# Edit .env with your credentials

---- **Python 3.11+**

# Start backend

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000- **Node.js 18+**

`````

## ▶️ Running Locally (Every Time)- **Git**

### Frontend

`````bash

# Navigate to frontend### Option A: Use Start Scripts (Recommended)---

cd frontend



# Install dependencies

npm install**Terminal 1 - Backend:**### Backend Setup



# Start development server```powershell

npm run dev

```.\start-backend.ps11. **Clone the repository**



### Access the Application````



- **Frontend**: http://localhost:5173````bash

- **Backend API Docs**: http://localhost:8000/docs

- **Health Check**: http://localhost:8000/api/utils/health**Terminal 2 - Frontend:**   git clone https://github.com/yourusername/oratio.git



---```powershell   cd oratio



## 🔧 Fallback Mode (No External Dependencies).\start-frontend.ps1   ```



The application works even without Supabase or Gemini API keys!````



### Automatic Fallbacks2. **Navigate to backend**



**Database:**### Option B: Manual Start

- ✅ Primary: Supabase (PostgreSQL)

- ✅ Fallback: Replit DB (if on Replit)````bash

- ✅ Final: In-Memory Dict (local testing)

**Terminal 1 - Backend:**   cd backend

**AI Provider:**

- ✅ Primary: Google Gemini AI```powershell   ```

- ✅ Fallback: Replit AI (if on Replit)

- ✅ Final: Static responsescd backend



Just start the backend without credentials:.\venv\Scripts\Activate.ps13. **Create virtual environment**



```bashuvicorn app.main:app --reload

# Backend starts with in-memory fallbacks

uvicorn app.main:app --reload```   ```bash

`````

python -m venv .venv

You'll see:

**Terminal 2 - Frontend:** ```

````

⚠️  Supabase credentials not configured, falling back to Replit DB```powershell

⚠️  Replit DB not available, using in-memory storage

⚠️  Gemini API key not configured, will use static responsescd frontend4. **Activate virtual environment**

✅ Using In-Memory Database (Fallback)

```npm run dev



---```   - **Windows (PowerShell)**:



## 🐛 Troubleshooting



### Backend Won't Start---     ```powershell



**Missing packages?**  .\.venv\Scripts\Activate.ps1

```bash

cd backend## 🌐 Access Your App     ```

pip install -r requirements.txt

````

**Port 8000 in use?**- **Frontend:** http://localhost:5173 - **Windows (CMD)**:

`````bash

# Use different port- **Backend API Docs:** http://localhost:8000/docs

uvicorn app.main:app --reload --port 8001

```- **Backend API:** http://localhost:8000     ```cmd



### Frontend Won't Start  .venv\Scripts\activate.bat



```bash---     ```

cd frontend

npm install

npm run dev

```## 🛑 Stopping the Servers   - **Linux/Mac**:



### Database Connection Issues  ```bash



**Don't worry!** The app automatically uses fallbacks:Press `Ctrl+C` in each terminal window.     source .venv/bin/activate

- Without Supabase → Uses Replit DB or in-memory storage

- Without Gemini → Uses Replit AI or static responses  ```



### PowerShell Execution Policy Error---



```powershell5. **Install dependencies**

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

```## 🐛 Common Issues



---```bash



## 📚 Next Steps### "execution policy" error   pip install -r requirements.txt



### Complete Guides```powershell   ```



- **Full Setup**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment instructionsSet-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

- **Architecture**: [ARCHITECTURE_UPDATE.md](./ARCHITECTURE_UPDATE.md) - Technical details

- **Simplified**: [QUICKSTART_SIMPLE.md](./QUICKSTART_SIMPLE.md) - Bare minimum setup```6. **Set up environment variables**

- **API Docs**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

- **Replit**: [REPLIT_SETUP.md](./REPLIT_SETUP.md) - Replit-specific setup



### What's Included### "Port 8000 already in use"   ```bash



| Feature | Status |```powershell   cp ../.env.example .env

|---------|--------|

| Multi-tier database (Supabase → Replit DB → Memory) | ✅ |# Kill the process   ```

| Multi-tier AI (Gemini → Replit AI → Static) | ✅ |

| Production deployment (Render + Supabase) | ✅ |netstat -ano | findstr :8000

| Development fallbacks | ✅ |

| REST API (14 routers) | ✅ |taskkill /PID <PID_NUMBER> /F   Edit `.env` and configure:

| WebSocket support | ✅ |

| File uploads | ✅ |````

| Authentication | ✅ |

| AI debate judging | ✅ |````bash

| Training feedback | ✅ |

### "Module not found" error   SECRET_KEY=your_secret_key_here

---

```powershell   SERPER_API_KEY=your_serper_key_here  # Optional

## 🎯 Quick Commands Reference

cd backend   ```

```powershell

# Setup (one time).\venv\Scripts\Activate.ps1

.\setup.ps1

pip install -r requirements.txt7. **Run the backend**

# Start backend

.\start-backend.ps1```   ```bash



# Start frontenduvicorn app.main:app --reload --host 127.0.0.1 --port 8000

.\start-frontend.ps1

### Backend shows "Replit DB (Fallback)" instead of "Supabase (Primary)"   ```

# Manual backend start

cd backend- Check your `.env` file has correct `SUPABASE_URL` and `SUPABASE_KEY`

.\venv\Scripts\Activate.ps1

uvicorn app.main:app --reload- Restart the backend server✅ **Backend running at**: http://127.0.0.1:8000



# Manual frontend start

cd frontend

npm run dev---- API docs: http://127.0.0.1:8000/docs



# Run tests (if available)- Health check: http://127.0.0.1:8000/api/utils/health

pytest

## 📦 Project Structure

# View logs

# Backend logs appear in terminal---

# Frontend logs in browser console

`````

---Oratio/### Frontend Setup

## 🆘 Need Help?├── backend/ # FastAPI backend

1. **Detailed Setup**: Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)│ ├── app/1. **Open new terminal** and navigate to frontend

2. **Issues**: Open on [GitHub](https://github.com/muneer320/oratio/issues)

3. **Architecture**: Read [ARCHITECTURE_UPDATE.md](./ARCHITECTURE_UPDATE.md)│ │ ├── main.py # Entry point

4. **API Reference**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

│ │ ├── routers/ # API endpoints ```bash

---

│ │ ├── supabase_db.py # Database layer cd frontend

**You're all set!** Start building your debate platform! 🚀

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
