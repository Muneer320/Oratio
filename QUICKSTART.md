# ⚡ Oratio Quick Start Guide# ⚡ Oratio Quick Start# 🚀 Quick Start Guide

Get Oratio up and running in minutes!The fastest way to get Oratio running locally!Get Oratio up and running in minutes!

---## 🚀 One-Time Setup---

## 🎯 **Option 1: Deploy on Replit (Recommended)**### 1. Get Your Credentials First## 🎯 **Option 1: Deploy on Replit (Recommended)**

**Best for**: Hackathon demos, quick testing, zero configurationBefore running anything, get these ready:**Best for**: Hackathon demos, quick testing, zero configuration

### Steps**Supabase (2 minutes):**### Steps

1. **Import to Replit**1. Go to https://supabase.com → Create account/Sign in

   - Go to [replit.com](https://replit.com)

   - Click "Create Repl" → "Import from GitHub"2. Create new project → Wait for it to initialize1. **Import to Replit**

   - Paste repository URL: `https://github.com/muneer320/oratio.git`

   - Click "Import from GitHub"3. Go to Settings → API → Copy:

2. **Configure Secrets (Optional but Recommended)** - `Project URL` (e.g., https://xxxxx.supabase.co) - Go to [replit.com](https://replit.com)

   - Click 🔒 **Secrets** tab in left sidebar

   - Add `GEMINI_API_KEY` for better AI judging (get free key at [Google AI Studio](https://aistudio.google.com/app/apikey)) - `anon public` key (long string) - Click "Create Repl" → "Import from GitHub"

   - Add `SERPER_API_KEY` for fact-checking (get free key at [serper.dev](https://serper.dev))

   - Add `SECRET_KEY` for auth (or let it auto-generate)4. Go to SQL Editor → Run the SQL from `DEPLOYMENT_GUIDE.md` Section 1.2 - Paste repository URL

3. **Click ▶️ Run** - Click "Import from GitHub"

   - Backend starts automatically on port 8000

   - Frontend served via Vite on port 5173**Gemini API Key (1 minute):**

   - Replit provides a public URL automatically

4. Go to https://aistudio.google.com/app/apikey2. **Configure Secrets (Optional)**

5. **Access Your App**

   - Backend API: `https://[repl-name].[username].repl.co/docs`2. Click "Create API Key" → Copy it

   - Health check: `https://[repl-name].[username].repl.co/api/utils/health`

   - Click 🔒 **Secrets** tab in left sidebar

### ✅ Verification

### 2. Run Setup Script - Add `SERPER_API_KEY` for fact-checking (get free key at [serper.dev](https://serper.dev))

Check the console output for:

- Add `SECRET_KEY` (or let it auto-generate)

````

✅ Using Replit DatabaseOpen PowerShell in the project root folder:

✅ Gemini AI available (Primary)

✅ Replit AI available (Fallback)3. **Click ▶️ Run**

✅ Replit Auth: ✅

INFO: Uvicorn running on http://0.0.0.0:8000```powershell

````

# Run the setup script - Backend starts automatically on port 8000

📖 **Need more help?** See full Replit deployment guide (coming soon)

.\setup.ps1 - Frontend served via Vite on port 5173

---

`````

## 💻 **Option 2: Local Development**

4. **Access Your App**

**Best for**: Contributing, offline work, full control

This will: - Backend API: `https://[repl-name].[username].repl.co/docs`

### Prerequisites

- ✅ Check Python & Node.js - Health check: `https://[repl-name].[username].repl.co/api/utils/health`

- **Python 3.11+**

- **Node.js 18+**- ✅ Create virtual environment

- **Git**

- ✅ Install all Python packages### ✅ Verification

### Quick Setup (Windows PowerShell)

- ✅ Install all Node packages

```powershell

# 1. Clone the repository- ✅ Create `.env` templateCheck the console output for:

git clone https://github.com/muneer320/oratio.git

cd oratio### 3. Add Your Credentials```



# 2. Run the automated setup script✅ Replit Database: Available

.\setup.ps1

```Edit `backend/.env` file:✅ Replit AI: Available



The script will:✅ Replit Auth: Available

- ✅ Check Python & Node.js versions

- ✅ Create Python virtual environment````powershellINFO: Uvicorn running on http://0.0.0.0:8000

- ✅ Install all backend dependencies

- ✅ Install all frontend dependenciesnotepad backend\.env```

- ✅ Create `.env` template

`````

### Manual Setup (All Platforms)

📖 **Detailed Replit Guide**: See [REPLIT_SETUP.md](REPLIT_SETUP.md)

#### Step 1: Setup Backend

Replace these lines with your actual values:

`````bash

# Navigate to backend````env---

cd backend

SUPABASE_URL=https://xxxxx.supabase.co

# Create virtual environment

python -m venv .venvSUPABASE_KEY=your_actual_anon_key_here## 💻 **Option 2: Local Development**



# Activate virtual environmentGEMINI_API_KEY=your_actual_gemini_key_here

# Windows PowerShell:

.\.venv\Scripts\Activate.ps1```**Best for**: Contributing, offline work, full control

# Windows CMD:

.venv\Scripts\activate.bat

# Linux/Mac:

source .venv/bin/activateSave and close.### Prerequisites



# Install dependencies

pip install -r requirements.txt

```---- **Python 3.11+**



#### Step 2: Setup Frontend- **Node.js 18+**



```bash## ▶️ Running Locally (Every Time)- **Git**

# Open a new terminal

cd frontend



# Install dependencies### Option A: Use Start Scripts (Recommended)---

npm install

`````

#### Step 3: Configure Environment (Optional)**Terminal 1 - Backend:**### Backend Setup

Create `backend/.env` file:```powershell

`````bash.\start-backend.ps11. **Clone the repository**

# Copy example file

cp .env.example backend/.env````



# Edit with your preferred editor````bash

notepad backend/.env  # Windows

nano backend/.env     # Linux/Mac**Terminal 2 - Frontend:**   git clone https://github.com/yourusername/oratio.git

`````

````powershell cd oratio

**Optional API Keys:**

- `GEMINI_API_KEY` - For better AI judging (free at [Google AI Studio](https://aistudio.google.com/app/apikey)).\start-frontend.ps1   ```

- `SERPER_API_KEY` - For fact-checking (free at [serper.dev](https://serper.dev))

````

**Note**: The app works without these keys using fallback responses.

2. **Navigate to backend**

#### Step 4: Run the Application

### Option B: Manual Start

**Option A: Using PowerShell Scripts (Windows)**

```````bash

```powershell

# Terminal 1 - Start backend**Terminal 1 - Backend:**   cd backend

.\start-backend.ps1

```powershell   ```

# Terminal 2 - Start frontend

.\start-frontend.ps1cd backend

```

.\venv\Scripts\Activate.ps13. **Create virtual environment**

**Option B: Manual Commands (All Platforms)**

uvicorn app.main:app --reload

```bash

# Terminal 1 - Backend```   ```bash

cd backend

# Activate venv first (see Step 1)python -m venv .venv

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

**Terminal 2 - Frontend:**   ```

# Terminal 2 - Frontend

cd frontend```powershell

npm run dev

```cd frontend4. **Activate virtual environment**



#### Step 5: Access the Applicationnpm run dev



- **Frontend**: http://localhost:5173```   - **Windows (PowerShell)**:

- **Backend API Docs**: http://localhost:8000/docs

- **Backend Health**: http://localhost:8000/api/utils/health

- **WebSocket**: ws://localhost:8000/ws/debate/{room_id}

---     ```powershell

---

  .\.venv\Scripts\Activate.ps1

## 🐳 **Option 3: Docker (Production-like)**

## 🌐 Access Your App     ```

**Best for**: Containerized deployment, production testing



### Prerequisites

- **Frontend:** http://localhost:5173   - **Windows (CMD)**:

- **Docker** & **Docker Compose** installed

- **Backend API Docs:** http://localhost:8000/docs

### Steps

- **Backend API:** http://localhost:8000     ```cmd

```bash

# 1. Clone repository  .venv\Scripts\activate.bat

git clone https://github.com/muneer320/oratio.git

cd oratio---     ```



# 2. Create .env file (optional)

cp .env.example .env

# Edit .env if you have API keys## 🛑 Stopping the Servers   - **Linux/Mac**:



# 3. Build and run  ```bash

docker-compose up --build

Press `Ctrl+C` in each terminal window.     source .venv/bin/activate

# Access the app at http://localhost

```  ```



------



## 🔍 **Verification & Testing**5. **Install dependencies**



### Health Check## 🐛 Common Issues



```bash```bash

# Check backend is running

curl http://localhost:8000/api/utils/health### "execution policy" error   pip install -r requirements.txt



# Expected response:```powershell   ```

# {

#   "status": "ok",Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

#   "message": "Oratio backend is healthy",

#   "replit_features": {```6. **Set up environment variables**

#     "database": true/false,

#     "gemini_ai": true/false,

#     "replit_ai": true/false

#   }### "Port 8000 already in use"   ```bash

# }

``````powershell   cp ../.env.example .env



### Test API Endpoints# Kill the process   ```



Visit http://localhost:8000/docs for interactive API documentation.netstat -ano | findstr :8000



**Try these:**taskkill /PID <PID_NUMBER> /F   Edit `.env` and configure:

1. `/api/utils/health` - Health check

2. `/api/utils/config` - View configuration````

3. `/api/rooms/list` - List available debate rooms

````bash

---

### "Module not found" error   SECRET_KEY=your_secret_key_here

## 🛠️ **Fallback Modes**

```powershell   SERPER_API_KEY=your_serper_key_here  # Optional

Oratio is designed to work in various environments:

cd backend   ```

### Database Tiers

1. **Replit DB** (on Replit) - Persistent key-value storage.\venv\Scripts\Activate.ps1

2. **In-Memory Dict** (local) - Non-persistent, good for testing

pip install -r requirements.txt7. **Run the backend**

### AI Provider Tiers

1. **Gemini AI** (if GEMINI_API_KEY set) - Best quality AI judging```   ```bash

2. **Replit AI** (on Replit, fallback) - Good quality, built-in

3. **Static Responses** (no keys) - Demo mode with example responsesuvicorn app.main:app --reload --host 127.0.0.1 --port 8000



### Backend Hosting### Backend shows "Replit DB (Fallback)" instead of "Supabase (Primary)"   ```

1. **Replit** - Auto-detected via environment variables

2. **Local** - Development mode- Check your `.env` file has correct `SUPABASE_URL` and `SUPABASE_KEY`

3. **Docker** - Production-like containerized environment

- Restart the backend server✅ **Backend running at**: http://127.0.0.1:8000

---



## 🐛 **Troubleshooting**

---- API docs: http://127.0.0.1:8000/docs

### Backend won't start

- Health check: http://127.0.0.1:8000/api/utils/health

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`

## 📦 Project Structure

**Solution**:

```bash---

cd backend

pip install -r requirements.txt````

```

Oratio/### Frontend Setup

---

├── backend/ # FastAPI backend

### Frontend build fails

│ ├── app/1. **Open new terminal** and navigate to frontend

**Problem**: `npm ERR! code ELIFECYCLE`

│ │ ├── main.py # Entry point

**Solution**:

```bash│ │ ├── routers/ # API endpoints ```bash

cd frontend

rm -rf node_modules package-lock.json│ │ ├── supabase_db.py # Database layer cd frontend

npm install

```│ │ └── gemini_ai.py # AI integration ```



---│ ├── requirements.txt



### Port already in use│ └── .env # Your credentials (create this!)2. **Install dependencies**



**Problem**: `Error: Address already in use`├── frontend/ # React frontend



**Solution**:│ ├── src/ ```bash

```bash

# Windows PowerShell - Kill process on port 8000│ ├── package.json npm install

Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process

│ └── .env.local # Optional frontend config ```

# Linux/Mac - Kill process on port 8000

lsof -ti:8000 | xargs kill -9├── setup.ps1 # One-time setup script

```

├── start-backend.ps1 # Start backend server3. **Configure environment**

---

└── start-frontend.ps1 # Start frontend server

### CORS errors in browser

`   `bash

**Problem**: `CORS policy: No 'Access-Control-Allow-Origin' header`

# Create .env file

**Solution**: Check `backend/.env` has correct CORS_ORIGINS:

```bash--- echo "VITE_API_URL=http://localhost:8000" > .env

CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8000

```echo "VITE_WS_URL=ws://localhost:8000" >> .env



---## 🎯 What You Should See ```



### Gemini AI not working### Backend Terminal:4. **Run the development server**



**Problem**: AI responses are generic/static`   `bash



**Solutions**:============================================================ npm run dev

1. Check `GEMINI_API_KEY` is set correctly in `.env`

2. Verify API key at [Google AI Studio](https://aistudio.google.com/app/apikey)🚀 Oratio API Starting... ```

3. Check console for errors: `⚠️ Gemini AI failed`

4. App will fallback to Replit AI or static responses automatically============================================================



---✅ **Frontend running at**: http://localhost:5173



### Database data not persisting📦 Features Status:



**Problem**: Data lost after restartDatabase: ✅ Supabase (Primary)---



**Explanation**: AI Provider: ✅ Gemini AI (Primary)

- **On Replit**: Replit DB persists data automatically

- **Locally**: In-memory dict doesn't persist (by design)Backend: ✅ Replit (Dev)## 🐳 **Option 3: Using Docker (Alternative)**



**Solution for local persistence**:...

- Deploy to Replit for persistent storage

- Or wait for database migrations (coming soon)**Best for**: Production-like testing, containerized environments



---✅ Oratio API ready at http://0.0.0.0:8000



## 📚 **Next Steps**============================================================### Prerequisites



1. 📖 Read [README.md](./README.md) for full project overview```

2. 🏗️ Check [backend/README.md](./backend/README.md) for API details

3. 🤝 See [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute- Docker Desktop installed and running

4. 📋 View [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoint details

### Frontend Terminal:- Docker Compose installed

---

```

## 💡 **Quick Commands Reference**

VITE v5.x.x ready in xxx ms### Steps

### Development

➜ Local: http://localhost:5173/1. **Clone and navigate**

```bash

# Start backend (with auto-reload)➜ Network: use --host to expose

cd backend && uvicorn app.main:app --reload

`   `bash

# Start frontend (with hot-reload)

cd frontend && npm run devgit clone https://github.com/yourusername/oratio.git



# Run both (Windows PowerShell)--- cd oratio

.\start-backend.ps1  # Terminal 1

.\start-frontend.ps1  # Terminal 2````

```

## 📚 More Info

### Testing

2. **Set up environment**

```bash

# Test backend health- **Full Setup Guide:** `DEPLOYMENT_GUIDE.md`

curl http://localhost:8000/api/utils/health

- **Architecture Details:** `ARCHITECTURE_UPDATE.md`   ```bash

# Test WebSocket connection (requires wscat)

npm install -g wscat- **API Documentation:** http://localhost:8000/docs (when backend is running)   cp .env.example .env

wscat -c ws://localhost:8000/ws/debate/test-room

```# Edit .env with your settings



### Docker---   ```



```bash

# Build and run

docker-compose up --build## 🎉 First Time Running?3. **Build and start**



# Run in background

docker-compose up -d

1. ✅ Run `.\setup.ps1`   ```bash

# Stop containers

docker-compose down2. ✅ Edit `backend\.env` with your credentials   docker-compose up --build



# View logs3. ✅ Run `.\start-backend.ps1` in one terminal   ```

docker-compose logs -f

```4. ✅ Run `.\start-frontend.ps1` in another terminal



---5. ✅ Open http://localhost:5173 in your browser4. **Access the application**



## 🎉 **Success!**6. 🎊 You're done!



You should now have Oratio running. Try creating a debate room and testing the AI judging!- Frontend: http://localhost



**Having issues?** ---   - Backend API: http://localhost/api/utils/health

- Check the troubleshooting section above

- Open an issue on GitHub- Backend Direct: http://localhost:8000/docs

- Contact: muneer.alam320@gmail.com

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.

---

5. **Stop the application**

<div align="center">```bash

docker-compose down

**Built with ❤️ for better debates**````



[⭐ Star on GitHub](https://github.com/muneer320/oratio) • [🐛 Report Bug](https://github.com/muneer320/oratio/issues) • [💡 Request Feature](https://github.com/muneer320/oratio/issues)---



</div>## 🧪 **Testing the Setup**


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
```````
