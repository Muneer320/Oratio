# 🧠 Oratio - AI-Powered Debate Arena

<div align="center">

**"An intelligent debate platform that listens, learns, and levels up how people argue."**

![Oratio Banner](https://img.shields.io/badge/Oratio-AI%20Debate%20Platform-blue?style=for-the-badge)
![Replit](https://img.shields.io/badge/Built%20for-Replit%20Vibeathon-orange?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95%2B-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18.2%2B-61dafb?style=for-the-badge&logo=react)

[Live Demo](#) • [Documentation](./docs) • [Replit Setup](./REPLIT_SETUP.md) • [Contributing](./CONTRIBUTING.md)

</div>

---

## 🎯 **What is Oratio?**

Oratio is a **voice-enabled, AI-powered debate platform** built specifically for **Replit Vibeathon**. It transforms traditional debates into interactive, AI-enhanced experiences where:

- 🎤 **Hosts** create debate rooms, set topics, and upload reference materials (PDFs, articles, podcasts)
- 💬 **Participants** debate using **text or voice** with real-time transcription
- 👥 **Spectators** join as audience members and **reward debaters** for strong arguments
- 🤖 **AI Judge** evaluates each round using the **LCR Model** (Logic, Credibility, Rhetoric)
- 🧑‍🏫 **AI Trainer** provides **personalized post-debate feedback** and gamified learning exercises

---

## ✨ **Replit Features** (Vibeathon Edition)

This project is **fully optimized for Replit** and showcases:

| Feature               | Implementation                      | Status      |
| --------------------- | ----------------------------------- | ----------- |
| **Replit Database**   | Key-value store for all debate data | ✅ Built-in |
| **Replit AI**         | LCR debate judging & training       | ✅ Built-in |
| **Replit Auth**       | Seamless user authentication        | ✅ Built-in |
| **Replit Deployment** | One-click deploy & hosting          | ✅ Ready    |

**Why Replit?**

- 🚀 Zero configuration required
- 💾 Built-in database (no external DB needed)
- 🤖 Free AI API access for judging
- 🔐 Authentication out-of-the-box
- 🌐 Instant deployment

---

## 🏛️ **Core Features**

### 🎤 **Voice + Text Debate Flow**

- Speak or type your arguments
- Real-time speech-to-text transcription (Whisper API / Web Speech API)
- Live WebSocket broadcast to all participants

### ⚖️ **AI Judge — LCR Model**

Each participant is evaluated on three criteria:

| Criterion           | Description                                   | Weight |
| ------------------- | --------------------------------------------- | ------ |
| **Logic (L)**       | Coherence, reasoning, argument structure      | 40%    |
| **Credibility (C)** | Accuracy, evidence use, fact consistency      | 35%    |
| **Rhetoric (R)**    | Tone, persuasion, clarity, emotional delivery | 25%    |

**Verdict Format:**

```json
{
  "scores": {
    "A": { "Logic": 8, "Credibility": 9, "Rhetoric": 7 },
    "B": { "Logic": 7, "Credibility": 8, "Rhetoric": 9 }
  },
  "spectator_influence": { "A": 70, "B": 30 },
  "winner": "B",
  "feedback": {
    "A": "Excellent structure, but lacked supporting data.",
    "B": "Stronger delivery and fact consistency."
  },
  "summary": "A tightly contested debate with superior rhetoric from B."
}
```

### 👥 **Spectator Gamification**

- Join debates in **view-only mode**
- Reward debaters with emojis (👏 🔥 ❤️ 💡 🎯)
- Influence the **"People's Choice"** meter
- View live leaderboards and audience sentiment

### 🧑‍🏫 **AI Trainer Mode**

After each debate:

- Personalized **AI-generated training plans**
- Identifies weak areas (grammar, logic, vocabulary, pacing)
- Interactive exercises with **XP progression** and badges
- Gamified learning path (e.g., _Rising Orator_, _Fact Master_)

---

## 🧩 **System Architecture**

### Multi-Tier Fallback System (Production Ready)

Oratio implements a **three-tier graceful degradation** architecture:

```
┌─────────────────────────────────────────────────────────┐
│ Frontend (React + Vite + TailwindCSS + WebSockets)      │
│ - Pages: Landing, Host, Arena, Spectator, Results       │
│ - Components: ScoreBoard, VoiceInput, RewardPanel       │
│ - Services: API Client, WebSocket Manager               │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ Backend (FastAPI + WebSockets)                          │
│ 🌐 Hosting: Render (Primary) → Replit (Fallback)        │
│ - REST API endpoints for rooms, participants, etc.      │
│ - WebSocket handlers for real-time debate updates       │
│ - File upload handling (PDFs, audio, URLs)              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ AI Layer (Multi-Provider Fallback)                      │
│ 🤖 Primary: Google Gemini AI (gemini-2.0-flash)         │
│ 🤖 Fallback: Replit AI (chat-bison)                     │
│ 🤖 Final: Static responses                              │
│ - LCR Model evaluation                                  │
│ - Fact-checking and debate analysis                     │
│ - Personalized training feedback                        │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ Database (Multi-Tier Fallback)                          │
│ 💾 Primary: Supabase (PostgreSQL)                       │
│ 💾 Fallback: Replit DB (Key-Value Store)                │
│ 💾 Final: In-Memory Dict (Dev/Testing)                  │
│ - User profiles, debate history, scores                 │
│ - XP progression, badges, leaderboards                  │
│ - 10 tables with proper indexing and relationships      │
└─────────────────────────────────────────────────────────┘
```

**Key Architecture Features:**

- ✅ **Graceful degradation** - Never fails completely
- ✅ **Environment detection** - Auto-selects best available service
- ✅ **Zero downtime** - Automatic fallback on service failure
- ✅ **Production ready** - Supabase + Render for scale
- ✅ **Dev friendly** - Works locally without external dependencies

---

## ⚙️ **Tech Stack**

| Layer                  | Technologies                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------ |
| **Frontend**           | React 18, Vite, TailwindCSS, Framer Motion, React Router, Web Speech API, WebSockets |
| **Backend**            | FastAPI (Python 3.11+), Pydantic, Uvicorn, WebSockets                                |
| **Hosting**            | Render (Primary) / Replit (Fallback)                                                 |
| **Database**           | Supabase (PostgreSQL) / Replit DB / In-Memory (Multi-tier)                           |
| **AI/LLM**             | Google Gemini AI (gemini-2.0-flash) / Replit AI (chat-bison) / Static (Multi-tier)   |
| **Speech**             | Browser Web Speech API / Whisper API (optional)                                      |
| **File Parsing**       | PyMuPDF (PDF), BeautifulSoup (articles)                                              |
| **Auth**               | Replit Auth / JWT fallback                                                           |
| **Package Management** | pip + venv, npm                                                                      |
| **Deployment**         | Docker + Docker Compose / Render / Replit                                            |

### Python Packages (Required)

```
fastapi>=0.95.0
uvicorn[standard]>=0.20.0
supabase>=2.0.0
postgrest>=0.10.0
google-generativeai>=0.3.0
databases>=0.8.0
email-validator>=2.0.0
replit>=3.0.0
replit-ai>=0.0.11
python-multipart>=0.0.5
python-dotenv>=1.0.0
websockets>=12.0
PyMuPDF>=1.23.0
beautifulsoup4>=4.12.0
```

---

## 🚀 **Quick Start**

### **Option 1: Deploy on Replit (Recommended)**

1. **Fork this Repl**

   Click "Fork" on Replit or import from GitHub

2. **Add Secrets (Optional)**

   - Click 🔒 **Secrets** tab
   - Add `SERPER_API_KEY` for fact-checking (get free key at [serper.dev](https://serper.dev))

3. **Click Run**

   The backend will start automatically on port 8000

4. **Access the App**

   ```
   https://[your-repl-name].[username].repl.co/docs
   ```

📖 **Detailed Replit setup**: See [REPLIT_SETUP.md](./REPLIT_SETUP.md)

---

### **Option 2: Local Development**

#### **Prerequisites**

- Python 3.11+ installed
- Node.js 18+ installed
- (Optional) Docker & Docker Compose for containerized deployment

#### **1. Clone the Repository**

```bash
git clone https://github.com/muneer320/oratio.git
cd oratio
```

#### **2. Quick Setup with PowerShell Scripts (Windows)**

```powershell
# Run automated setup
.\setup.ps1

# Start backend
.\start-backend.ps1

# Start frontend (in new terminal)
.\start-frontend.ps1
```

#### **3. Manual Setup**

**Backend:**

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
```

**Create `.env` file in `backend/` folder:**

```env
# Supabase (Primary Database)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# Google Gemini AI (Primary AI)
GEMINI_API_KEY=your_gemini_api_key

# API Configuration
API_ENV=development
WS_PORT=8000
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

**Start backend:**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

#### **4. Access the Application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/docs
- **WebSocket**: ws://localhost:8000/ws/debate/{room_id}

#### **5. Optional: Docker Compose**

```bash
docker-compose up --build
```

This will expose the app at **http://localhost**

---

## 🛠️ **Development Workflow**

### **Testing Fallback Systems**

The application automatically selects the best available service:

**Database Fallback Test:**

```bash
# With Supabase credentials → Uses Supabase
# Without Supabase → Uses Replit DB
# Without both → Uses in-memory storage
```

**AI Fallback Test:**

```bash
# With GEMINI_API_KEY → Uses Gemini AI
# Without Gemini → Uses Replit AI
# Without both → Uses static responses
```

### **Environment Variables Reference**

**Required for Production:**

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Supabase anon/public key
- `GEMINI_API_KEY` - Google Gemini API key
- `CORS_ORIGINS` - Allowed frontend origins

**Optional:**

- `API_ENV` - development/production (default: development)
- `WS_PORT` - Server port (default: 8000)
- `RENDER` - Auto-set to `true` on Render platform

### **Getting API Keys**

1. **Supabase**: https://supabase.com → Create Project → Settings → API
2. **Gemini AI**: https://aistudio.google.com/app/apikey → Create API Key

Frontend will run on http://localhost:5173

---

## 🔌 **API Endpoints**

### **Authentication**

```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get current user
PUT    /api/auth/update         - Update user profile
DELETE /api/auth/logout         - Logout user
```

### **Room Management**

```
POST   /api/rooms/create        - Create debate room
GET    /api/rooms/{room_id}     - Get room details
PUT    /api/rooms/{room_id}/update - Update room settings
DELETE /api/rooms/{room_id}     - Delete room
GET    /api/rooms/list          - List all active rooms
```

### **Participant Management**

```
POST   /api/participants/join   - Join debate room
GET    /api/participants/{participant_id} - Get participant info
PUT    /api/participants/{participant_id}/ready - Mark as ready
DELETE /api/participants/{participant_id}/leave - Leave room
```

### **Spectator System**

```
POST   /api/spectators/join     - Join as spectator
POST   /api/spectators/{room_id}/reward - Send reward emoji
GET    /api/spectators/{room_id}/stats - Get audience stats
DELETE /api/spectators/{spectator_id}/leave - Leave as spectator
```

### **Debate Flow**

```
POST   /api/debate/{room_id}/submit-turn - Submit text/voice turn
POST   /api/debate/{room_id}/submit-audio - Upload audio turn
GET    /api/debate/{room_id}/transcript - Get full transcript
POST   /api/debate/{room_id}/end - End debate
GET    /api/debate/{room_id}/status - Get debate status
```

### **AI Judging & Processing**

```
POST   /api/ai/analyze-turn          - Analyze single turn
POST   /api/ai/fact-check            - Fact-check statement
POST   /api/ai/final-score           - Generate final verdict
GET    /api/ai/summary/{room_id}     - Get debate summary
GET    /api/ai/report/{room_id}      - Get detailed report
```

### **AI Trainer & Gamification**

```
POST   /api/trainer/analyze                  - Analyze user performance
GET    /api/trainer/recommendations/{user_id} - Get personalized exercises
POST   /api/trainer/challenge/start          - Start training challenge
POST   /api/trainer/challenge/submit         - Submit challenge response
GET    /api/trainer/progress/{user_id}       - Get XP and badges
PUT    /api/trainer/progress/{user_id}       - Update progress
```

### **Uploads & File Handling**

```
POST   /api/uploads/pdf        - Upload PDF reference
POST   /api/uploads/audio      - Upload audio file
POST   /api/uploads/url        - Add URL reference
GET    /api/uploads/{room_id}  - List room uploads
DELETE /api/uploads/{file_id}  - Delete uploaded file
```

### **Utilities**

```
GET    /api/utils/health         - Health check
GET    /api/utils/config         - Get public config
POST   /api/utils/feedback       - Submit user feedback
GET    /api/utils/leaderboard    - Global leaderboard
GET    /api/utils/search-topics  - Search debate topics
```

### **WebSockets**

```
ws://localhost/ws/debate/{room_id}     - Live debate updates
ws://localhost/ws/spectator/{room_id}  - Audience interactions
ws://localhost/ws/trainer/{user_id}    - Real-time trainer feedback
```

---

## 🎨 **UI Pages**

| Page               | Route               | Description                                              |
| ------------------ | ------------------- | -------------------------------------------------------- |
| **Landing Page**   | `/`                 | "Host Debate" / "Join Debate" / "Train with AI" options  |
| **Host Dashboard** | `/host`             | Room creation, topic input, reference upload             |
| **Debate Arena**   | `/debate/:roomId`   | Split-screen participants + live scores + audience meter |
| **Spectator View** | `/spectate/:roomId` | Watch debate + send rewards                              |
| **Result Page**    | `/results/:roomId`  | Winner, LCR breakdown chart, AI feedback, fact sources   |
| **Trainer Page**   | `/trainer`          | Personalized training modules, XP tracking, challenges   |

---

## 📁 **Project Structure**

```
oratio/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level views
│   │   ├── services/         # API and WebSocket clients
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helper functions and constants
│   │   ├── styles/           # Global CSS
│   │   ├── routes/           # Route definitions
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── routers/          # API route handlers (TODO)
│   │   ├── models/           # Pydantic models (TODO)
│   │   ├── services/         # Business logic (TODO)
│   │   └── websockets/       # WebSocket handlers (TODO)
│   ├── requirements.txt
│   └── README.md
├── docker/
│   ├── nginx.conf            # Nginx configuration
│   └── supervisord.conf      # Process manager config
├── Dockerfile                # Multi-stage build
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .dockerignore
├── LICENSE
└── README.md
```

---

## 🕒 **36-Hour Hackathon Plan**

| Time       | Focus             | Deliverable                                |
| ---------- | ----------------- | ------------------------------------------ |
| **0–6h**   | Project setup     | ✅ Base FastAPI + React + Docker structure |
| **6–14h**  | Debate logic      | Room creation, join flow, turn system      |
| **14–22h** | AI judging        | LCR prompt engineering + live scoring      |
| **22–28h** | Voice integration | Whisper API + speech recognition           |
| **28–32h** | Spectator system  | Reward system + audience influence         |
| **32–36h** | Trainer + polish  | AI training, animations, final demo        |

---

## 🧪 **Development Status**

| Feature             | Status                                      |
| ------------------- | ------------------------------------------- |
| Backend Foundation  | ✅ Complete                                 |
| Multi-Tier Database | ✅ Complete (Supabase → Replit DB → Memory) |
| Multi-Tier AI       | ✅ Complete (Gemini → Replit AI → Static)   |
| Render Deployment   | ✅ Complete                                 |
| Database Models     | ✅ Complete (10 tables with relationships)  |
| API Schemas         | ✅ Complete                                 |
| Auth System         | ✅ Complete (Replit Auth + JWT fallback)    |
| Room Management     | ✅ Complete                                 |
| Debate Flow         | ✅ Complete                                 |
| AI Judging          | ✅ Complete (LCR Model)                     |
| Trainer System      | ✅ Complete                                 |
| Frontend UI         | 🚧 In Progress                              |
| WebSockets          | ✅ Complete                                 |
| File Uploads        | ✅ Complete (PDF, Audio, URL)               |
| Production Ready    | ✅ Yes (Supabase + Render)                  |

---

## 🚀 **Deployment**

### **Production Deployment (Render + Supabase)**

**Backend on Render:**

1. Push code to GitHub
2. Create Web Service on Render
3. Connect GitHub repository
4. Set environment variables (see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md))
5. Deploy automatically on push

**Database on Supabase:**

1. Create project at supabase.com
2. Run SQL script to create 10 tables
3. Disable RLS for testing (enable for production)
4. Copy credentials to Render environment variables

**Full Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete step-by-step instructions.

---

## 🎯 **Roadmap**

### **Phase 1: Core Platform** ✅ COMPLETE

- [x] Backend foundation with multi-tier fallback
- [x] Database models and schemas (10 tables)
- [x] Authentication system (Replit Auth + JWT)
- [x] Room creation and joining
- [x] Complete debate flow with turns
- [x] WebSocket real-time updates
- [x] File uploads (PDF, audio, URLs)

### **Phase 2: AI Integration** ✅ COMPLETE

- [x] LCR model implementation
- [x] Real-time AI feedback with Gemini/Replit AI
- [x] Multi-tier AI fallback system
- [x] Final verdict generation
- [x] Debate analysis and summarization

### **Phase 3: Gamification** ✅ COMPLETE

- [x] XP and leveling system
- [x] Training feedback and recommendations
- [x] Spectator voting system
- [x] Score tracking and results

### **Phase 4: Production** ✅ COMPLETE

- [x] Supabase database integration
- [x] Render deployment support
- [x] Multi-tier graceful degradation
- [x] Automated setup scripts (PowerShell)
- [x] Complete documentation

### **Phase 5: Frontend & Polish** 🚧 IN PROGRESS

- [ ] Complete React UI implementation
- [ ] Voice input/output integration
- [ ] Advanced UI animations
- [ ] Mobile responsiveness
- [ ] Performance optimization

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For more details, see [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **OpenAI** for GPT-4/5 and Whisper API
- **FastAPI** for the amazing Python web framework
- **React** and **Vite** for modern frontend tooling
- **Replit** for inspiration and potential hosting

---

## 📧 **Contact**

For questions or feedback:

- **GitHub Issues**: [github.com/muneer320/oratio/issues](https://github.com/muneer320/oratio/issues)
- **Email**: muneer.alam320@gmail.com

---

<div align="center">

**Built with ❤️ for better debates and smarter conversations.**

[⭐ Star this repo](https://github.com/muneer320/oratio) • [🍴 Fork it](https://github.com/muneer320/oratio/fork) • [📢 Share it](https://twitter.com/intent/tweet?text=Check%20out%20Oratio%20-%20AI-powered%20debate%20platform!)

</div>
