# 🔧 Oratio Backend

**FastAPI + Replit Integration**

This is the backend for Oratio, an AI-powered debate platform. It provides RESTful APIs and WebSocket connections for real-time debate management, AI judging, and user authentication.

---

## 🏗️ Architecture

The backend is built with:

- **FastAPI** - Modern Python web framework
- **Replit Database** - Key-value store for data persistence
- **Replit AI** - AI model integration for debate analysis
- **Replit Auth** - Seamless user authentication
- **WebSockets** - Real-time communication
- **Pydantic** - Data validation

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry
│   ├── config.py            # Configuration settings
│   ├── replit_db.py         # Replit Database wrapper
│   ├── replit_ai.py         # Replit AI integration
│   ├── replit_auth.py       # Authentication system
│   ├── models.py            # Data models (reference)
│   ├── schemas.py           # Pydantic validation schemas
│   ├── routers/             # API endpoint routers (TODO)
│   │   ├── auth.py
│   │   ├── rooms.py
│   │   ├── debate.py
│   │   ├── ai.py
│   │   └── trainer.py
│   └── websockets/          # WebSocket handlers (TODO)
│       ├── debate.py
│       └── spectator.py
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **pip**

### Local Development

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv .venv
   ```

3. **Activate virtual environment**

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

4. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**

   ```bash
   cp ../.env.example .env
   # Edit .env with your settings
   ```

6. **Run the development server**

   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

7. **Access the API**
   - Health Check: http://127.0.0.1:8000/api/utils/health
   - API Docs: http://127.0.0.1:8000/docs
   - ReDoc: http://127.0.0.1:8000/redoc

---

## 🔧 Configuration

Configuration is managed in `app/config.py` using Pydantic Settings.

### Environment Variables

Key variables (see `.env.example`):

```bash
# Application
API_ENV=development
DEBUG=true

# Replit Features (auto-detected on Replit)
USE_REPLIT_DB=true
USE_REPLIT_AI=true

# Security
SECRET_KEY=your_secret_key_here

# Optional APIs
SERPER_API_KEY=your_serper_key  # For fact-checking
```

### Replit-Specific Settings

When running on Replit, these are auto-detected:

- `REPL_ID` - Unique Replit instance ID
- `REPL_SLUG` - Repl name
- `REPL_OWNER` - Repl owner username
- `REPLIT_DEV_DOMAIN` - Replit domain

---

## 📚 API Endpoints

### Health & Utilities

```
GET  /api/utils/health      - Health check with feature detection
GET  /api/utils/config      - Get public configuration
POST /api/utils/feedback    - Submit user feedback
GET  /api/utils/leaderboard - Get global leaderboard
```

### Authentication (TODO)

```
POST /api/auth/register     - Register new user
POST /api/auth/login        - Login user
GET  /api/auth/me           - Get current user
PUT  /api/auth/update       - Update user profile
POST /api/auth/logout       - Logout user
```

### Rooms (TODO)

```
POST   /api/rooms/create    - Create debate room
GET    /api/rooms/list      - List active rooms
GET    /api/rooms/{id}      - Get room details
PUT    /api/rooms/{id}      - Update room
DELETE /api/rooms/{id}      - Delete room
```

### Debate (TODO)

```
POST /api/debate/{id}/submit-turn   - Submit debate turn
POST /api/debate/{id}/submit-audio  - Submit audio
GET  /api/debate/{id}/transcript    - Get transcript
POST /api/debate/{id}/end           - End debate
GET  /api/debate/{id}/status        - Get debate status
```

### AI Analysis (TODO)

```
POST /api/ai/analyze-turn   - Analyze single turn
POST /api/ai/fact-check     - Fact-check statement
POST /api/ai/final-score    - Generate final verdict
GET  /api/ai/summary        - Get debate summary
```

### Trainer (TODO)

```
GET  /api/trainer/progress/{user_id}     - Get user progress
POST /api/trainer/analyze                - Analyze performance
POST /api/trainer/challenge/start        - Start training
POST /api/trainer/challenge/submit       - Submit answer
```

### WebSockets (TODO)

```
ws://[host]/ws/debate/{room_id}     - Real-time debate updates
ws://[host]/ws/spectator/{room_id}  - Spectator view
ws://[host]/ws/trainer/{user_id}    - Training session
```

---

## 🗄️ Database (Replit Database)

### Collections

The app uses the following collections:

- **users** - User profiles and authentication
- **rooms** - Debate rooms and settings
- **participants** - Debate participants and scores
- **turns** - Individual debate arguments
- **spectator_votes** - Audience reactions
- **results** - Final debate verdicts
- **trainer_feedback** - AI training recommendations
- **uploaded_files** - Reference materials
- **sessions** - User sessions (auth)

### Usage Example

```python
from app.replit_db import ReplitDB, Collections

# Create user
user_data = {"email": "user@example.com", "username": "debater1"}
user = ReplitDB.insert(Collections.USERS, user_data)

# Get user
user = ReplitDB.get(Collections.USERS, user_id)

# Update user
ReplitDB.update(Collections.USERS, user_id, {"xp": 150})

# Find users
users = ReplitDB.find(Collections.USERS, lambda u: u.get("xp", 0) > 100)
```

---

## 🤖 AI Integration (Replit AI)

### LCR Model

The AI judges debates using the **LCR Model**:

- **Logic (40%)**: Argument structure, reasoning
- **Credibility (35%)**: Evidence, facts, accuracy
- **Rhetoric (25%)**: Delivery, persuasion, clarity

### Usage Example

```python
from app.replit_ai import ReplitAI

# Analyze debate turn
result = await ReplitAI.analyze_debate_turn(
    turn_content="My argument is...",
    context={"topic": "AI Ethics"},
    previous_turns=[]
)

# Returns:
# {
#     "logic": 8,
#     "credibility": 7,
#     "rhetoric": 9,
#     "feedback": "Strong delivery...",
#     "strengths": ["Clear structure"],
#     "weaknesses": ["Lacks evidence"]
# }
```

---

## 🔐 Authentication (Replit Auth)

### Replit Auth Flow

1. User accesses the app on Replit
2. `replit.web.auth.name` provides username automatically
3. Backend creates/retrieves user from database
4. Session token generated for API access

### Local Development

For local testing, a simple token-based auth fallback is used.

### Usage Example

```python
from fastapi import Depends
from app.replit_auth import get_current_user

@router.get("/protected")
async def protected_route(user: dict = Depends(get_current_user)):
    return {"message": f"Hello {user['username']}!"}
```

---

## 🧪 Testing

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio pytest-cov

# Run tests
pytest

# With coverage
pytest --cov=app --cov-report=html
```

### Writing Tests

```python
import pytest
from app.replit_db import ReplitDB

def test_create_user():
    user = ReplitDB.insert("users", {"username": "test"})
    assert user["id"] is not None
    assert user["username"] == "test"
```

---

## 📝 Code Style

We follow **PEP 8** with these tools:

- **Black** - Code formatting

  ```bash
  black app/
  ```

- **isort** - Import sorting

  ```bash
  isort app/
  ```

- **flake8** - Linting
  ```bash
  flake8 app/
  ```

---

## 🐛 Debugging

### Enable Debug Mode

```bash
# In .env
DEBUG=true
LOG_LEVEL=DEBUG
```

### View Logs

```bash
# Check Replit console
# Or local terminal output
```

### Common Issues

**Issue**: `ModuleNotFoundError: No module named 'replit'`

```bash
# Solution: Install replit packages or use fallback
pip install replit replit-ai
```

**Issue**: Database connection errors

```bash
# Solution: Ensure running on Replit or using fallback
# Check REPL_ID environment variable
```

---

## 🚀 Deployment

### Replit Deployment

1. Import repository to Replit
2. Add secrets (if needed)
3. Click Run
4. Backend starts automatically

See [REPLIT_SETUP.md](../REPLIT_SETUP.md) for details.

### Docker Deployment (Alternative)

```bash
# From project root
docker-compose up --build
```

---

## 📚 Dependencies

Main dependencies in `requirements.txt`:

```
fastapi>=0.95.0          # Web framework
uvicorn>=0.21.0          # ASGI server
pydantic>=2.0.0          # Data validation
pydantic-settings>=2.0.0 # Settings management
replit>=3.0.0            # Replit integration
replit-ai>=0.1.0         # Replit AI
Flask>=3.0.0             # For Replit web features
websockets>=11.0         # WebSocket support
PyMuPDF>=1.23.0          # PDF processing
beautifulsoup4>=4.12.0   # HTML parsing
httpx>=0.24.0            # HTTP client
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for:

- Code style guidelines
- Pull request process
- Testing requirements

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](../LICENSE) file.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/oratio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/oratio/discussions)

---

**Built with ❤️ for Replit Vibeathon**
