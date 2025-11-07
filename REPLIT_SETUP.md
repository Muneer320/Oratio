# 🚀 Oratio - Replit Vibeathon Setup Guide

This project is **fully optimized for Replit** and uses Replit's native features!

---

## ✨ **Replit Features Used**

| Feature                   | Usage                                                | Status         |
| ------------------------- | ---------------------------------------------------- | -------------- |
| **Replit Database**       | Key-value store for all data (users, rooms, debates) | ✅ Built-in    |
| **Replit AI**             | LCR debate judging, fact-checking, trainer feedback  | ✅ Built-in    |
| **Replit Auth**           | User authentication (no password management needed)  | ✅ Built-in    |
| **Replit Object Storage** | File uploads (PDFs, audio files)                     | ✅ Available   |
| **Replit Secrets**        | API keys (Serper for fact-checking)                  | ✅ Recommended |

---

## 🎯 **Quick Setup (5 Steps)**

### **1. Import to Replit**

1. Go to [Replit](https://replit.com)
2. Click "Create Repl"
3. Choose "Import from GitHub"
4. Paste your repository URL
5. Click "Import from GitHub"

### **2. Set Up Secrets (Optional but Recommended)**

Click the **🔒 Secrets** tab (lock icon in sidebar) and add:

```
SERPER_API_KEY=your_serper_key_here
```

Get a free Serper API key at: https://serper.dev/

> **Note**: Replit AI and Replit Database work automatically - no API keys needed!

### **3. Install Dependencies**

Open the Shell and run:

```bash
# Backend dependencies
cd backend
pip install -r requirements.txt

# Frontend dependencies
cd ../frontend
npm install
```

### **4. Run the Project**

Click the **▶️ Run** button at the top!

The `.replit` file is configured to:

- Start the FastAPI backend on port 8000
- Expose it on port 80 for public access

### **5. Test It**

Visit the **Webview** tab or open:

```
https://[your-repl-name].[your-username].repl.co/docs
```

You should see the FastAPI Swagger UI!

---

## 🧩 **How Replit Features Work**

### **📦 Replit Database**

Instead of PostgreSQL/SQLite, we use Replit's built-in key-value database:

```python
from replit import db

# Store data
db["users:1"] = {"name": "Alice", "xp": 100}

# Retrieve data
user = db["users:1"]
```

**Location**: `backend/app/replit_db.py`

### **🤖 Replit AI**

Uses Replit's AI API for debate judging:

```python
from replit.ai.modelfarm import ChatModel

chat = ChatModel(model="chat-bison")
response = chat([{"role": "user", "content": "Judge this debate..."}])
```

**Location**: `backend/app/replit_ai.py`

**Benefits**:

- ✅ Free tier available
- ✅ No OpenAI API key needed
- ✅ Built into Replit

### **🔐 Replit Auth**

Automatic user authentication:

```python
from replit import web

username = web.auth.name  # Get logged-in Replit user
```

**Location**: `backend/app/replit_auth.py`

**Benefits**:

- ✅ No password management
- ✅ Users log in with Replit accounts
- ✅ Instant authentication

---

## 📁 **Project Structure (Replit-Optimized)**

```
oratio/
├── .replit                    # Replit run configuration
├── replit.nix                 # Nix packages (Python, Node.js)
├── REPLIT_SETUP.md           # This file
│
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app (Replit edition)
│   │   ├── config.py         # Replit-aware settings
│   │   ├── replit_db.py      # Replit Database wrapper
│   │   ├── replit_ai.py      # Replit AI integration
│   │   ├── replit_auth.py    # Replit Auth integration
│   │   ├── schemas.py        # Pydantic models
│   │   └── routers/          # API endpoints (to be built)
│   └── requirements.txt      # Python dependencies
│
└── frontend/
    ├── src/                   # React components
    └── package.json           # Node.js dependencies
```

---

## 🧪 **Testing the Backend**

Once running, test these endpoints:

### **Health Check**

```bash
curl https://[your-repl].repl.co/api/utils/health
```

Response:

```json
{
  "status": "ok",
  "message": "Oratio backend is healthy (Replit Edition)",
  "replit_features": {
    "database": true,
    "ai": true,
    "auth": true
  }
}
```

### **API Documentation**

Visit: `https://[your-repl].repl.co/docs`

---

## 🔧 **Development Workflow**

### **Backend Development**

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **Frontend Development**

```bash
cd frontend
npm run dev
```

### **Full Stack**

Just click **▶️ Run** in Replit!

---

## 🎯 **Next Steps**

Now that the foundation is set up with Replit features, we'll build:

1. ✅ **Auth Router** - Login/signup using Replit Auth
2. **Room Router** - Create/join debates
3. **Debate Router** - Submit turns, get AI feedback
4. **AI Router** - LCR judging using Replit AI
5. **Trainer Router** - Personalized feedback and XP
6. **WebSocket** - Real-time debate updates

---

## 🏆 **Why This Is Perfect for Replit Vibeathon**

✅ **Uses Replit Database** - No external DB needed  
✅ **Uses Replit AI** - Showcases Repl AI capabilities  
✅ **Uses Replit Auth** - Seamless user experience  
✅ **Fully hosted on Replit** - One-click deployment  
✅ **Real-time features** - WebSockets for live debates  
✅ **Educational focus** - AI trainer helps users improve

---

## 🚨 **Troubleshooting**

### **Replit Database not working?**

```python
# Check in Shell:
python3
>>> from replit import db
>>> db["test"] = "hello"
>>> print(db["test"])
```

### **Replit AI not available?**

Check the Replit AI documentation: https://docs.replit.com/ai

### **Authentication issues?**

Make sure you're logged into Replit. Replit Auth only works when users are signed in.

---

## 📚 **Resources**

- [Replit Database Docs](https://docs.replit.com/hosting/databases/replit-database)
- [Replit AI Docs](https://docs.replit.com/ai)
- [Replit Auth Docs](https://docs.replit.com/hosting/authentication)
- [FastAPI Docs](https://fastapi.tiangolo.com/)

---

**Ready to build the routers! Let me know when you want to proceed with Authentication →** 🚀
