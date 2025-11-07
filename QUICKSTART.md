# 🚀 Quick Start Guide

Get Oratio up and running in minutes!

---

## 🎯 **Option 1: Deploy on Replit (Recommended)**

**Best for**: Hackathon demos, quick testing, zero configuration

### Steps

1. **Import to Replit**

   - Go to [replit.com](https://replit.com)
   - Click "Create Repl" → "Import from GitHub"
   - Paste repository URL
   - Click "Import from GitHub"

2. **Configure Secrets (Optional)**

   - Click 🔒 **Secrets** tab in left sidebar
   - Add `SERPER_API_KEY` for fact-checking (get free key at [serper.dev](https://serper.dev))
   - Add `SECRET_KEY` (or let it auto-generate)

3. **Click ▶️ Run**

   - Backend starts automatically on port 8000
   - Frontend served via Vite on port 5173

4. **Access Your App**
   - Backend API: `https://[repl-name].[username].repl.co/docs`
   - Health check: `https://[repl-name].[username].repl.co/api/utils/health`

### ✅ Verification

Check the console output for:

```
✅ Replit Database: Available
✅ Replit AI: Available
✅ Replit Auth: Available
INFO:     Uvicorn running on http://0.0.0.0:8000
```

📖 **Detailed Replit Guide**: See [REPLIT_SETUP.md](REPLIT_SETUP.md)

---

## 💻 **Option 2: Local Development**

**Best for**: Contributing, offline work, full control

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Git**

---

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/oratio.git
   cd oratio
   ```

2. **Navigate to backend**

   ```bash
   cd backend
   ```

3. **Create virtual environment**

   ```bash
   python -m venv .venv
   ```

4. **Activate virtual environment**

   - **Windows (PowerShell)**:

     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```

   - **Windows (CMD)**:

     ```cmd
     .venv\Scripts\activate.bat
     ```

   - **Linux/Mac**:
     ```bash
     source .venv/bin/activate
     ```

5. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

6. **Set up environment variables**

   ```bash
   cp ../.env.example .env
   ```

   Edit `.env` and configure:

   ```bash
   SECRET_KEY=your_secret_key_here
   SERPER_API_KEY=your_serper_key_here  # Optional
   ```

7. **Run the backend**
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

✅ **Backend running at**: http://127.0.0.1:8000

- API docs: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/api/utils/health

---

### Frontend Setup

1. **Open new terminal** and navigate to frontend

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:8000" > .env
   echo "VITE_WS_URL=ws://localhost:8000" >> .env
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

✅ **Frontend running at**: http://localhost:5173

---

## 🐳 **Option 3: Using Docker (Alternative)**

**Best for**: Production-like testing, containerized environments

### Prerequisites

- Docker Desktop installed and running
- Docker Compose installed

### Steps

1. **Clone and navigate**

   ```bash
   git clone https://github.com/yourusername/oratio.git
   cd oratio
   ```

2. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Build and start**

   ```bash
   docker-compose up --build
   ```

4. **Access the application**

   - Frontend: http://localhost
   - Backend API: http://localhost/api/utils/health
   - Backend Direct: http://localhost:8000/docs

5. **Stop the application**
   ```bash
   docker-compose down
   ```

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
