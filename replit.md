# Oratio - AI-Powered Debate Platform

## Overview

Oratio is a voice-enabled, AI-powered debate platform that transforms traditional debates into interactive, AI-enhanced experiences. The platform allows hosts to create debate rooms with topics and reference materials, participants to debate using text or voice with real-time transcription, and spectators to join as audience members and reward debaters. An AI Judge evaluates each round using the LCR Model (Logic, Credibility, Rhetoric), while an AI Trainer provides personalized post-debate feedback and gamified learning exercises.

**Tech Stack:**
- **Backend:** FastAPI (Python 3.11+)
- **Frontend:** React 18.2+ with Vite
- **Database:** Replit Database (key-value store) with SQLAlchemy fallback
- **AI:** Google Gemini AI (primary) with Replit AI fallback
- **Authentication:** Replit Auth with simple token-based fallback
- **Real-time:** WebSockets for live debate updates
- **Styling:** Tailwind CSS with custom design system

**Current Status:** Pre-launch phase - Production ready for hackathon submission (November 2025)

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (November 8, 2025)

**Hackathon Pre-Launch Polish:**
1. Added Oratio logo to header (frontend/src/assets/Logo.png)
2. Enhanced Profile page with real backend stats integration via `/api/user/stats`
3. Updated Trainer page with Layout component, dark theme consistency, and backend integration
4. Dashboard sections now support horizontal scrolling with "View All" toggle
5. AI feedback enhanced with "Better Alternative Arguments" section
6. Added 9 achievement badges total (Profile page)
7. Added tooltips to bottom navigation bar
8. Backend: New `/api/user` endpoints for stats and history aggregation

## System Architecture

### Backend Architecture

**Framework:** FastAPI with async/await patterns for high-performance request handling

**Core Design Patterns:**
- **Repository Pattern:** Centralized data access through `ReplitDB` wrapper class that abstracts key-value storage with collection-based organization
- **Service Layer:** Business logic separated into routers (`/api/rooms`, `/api/debate`, `/api/ai`, etc.) with clear single responsibilities
- **WebSocket Manager:** Connection pooling with room-based broadcasting for real-time updates across debate participants and spectators

**Data Storage Strategy:**
- Primary: Replit Database (key-value store) with collection prefixing (`collection_name:id`)
- Collections: USERS, ROOMS, PARTICIPANTS, TURNS, SPECTATORS, CHALLENGES, UPLOADED_FILES, FEEDBACK
- Fallback: In-memory dictionaries for local development
- No SQL ORM actively used despite SQLAlchemy presence (architectural decision to leverage Replit's built-in DB)

**Performance Optimizations:**
- GZIP compression middleware (60-80% payload reduction for responses >500 bytes)
- ORJSON for JSON serialization (3-5x faster than standard library)
- In-memory caching layer (`user_cache`, `room_cache`) with TTL expiration to reduce database reads
- Room-level asyncio locks to prevent concurrent submission races (compensates for lack of atomic operations in key-value store)

**Authentication Flow:**
1. Primary: Replit Auth integration for seamless authentication
2. Fallback: Simple token-based auth with password hashing for local development
3. JWT-like tokens stored in Replit DB with user sessions
4. Bearer token validation via FastAPI dependency injection (`get_current_user`)

### Frontend Architecture

**Framework:** React 18.2 with functional components and hooks

**Routing:** React Router v6 for client-side navigation

**State Management:** 
- Local component state with useState/useEffect hooks
- Custom hooks for WebSocket connections (`useWebSocket`)
- No global state management library (Redux/Zustand) - architectural choice for simplicity

**API Communication:**
- Centralized `ApiService` class with token management
- Automatic 401/403 handling with unauthorized callbacks
- Environment-based API URL configuration (`VITE_API_URL`)

**Real-time Updates:**
- WebSocket service singleton for connection management
- Event-based message handling with JSON serialization
- Automatic reconnection not implemented (relies on page refresh)

**Design System:**
- Tailwind CSS with custom color palette (dark theme with rust/teal accents)
- Custom utility classes for grain textures, glow effects, and shadows
- Consistent component styling via `@layer components` (btn-primary, btn-secondary, card)
- Animation libraries: Framer Motion and GSAP for advanced interactions

### AI Integration Architecture

**Primary AI Provider: Google Gemini**
- Model: `gemini-2.5-pro`
- Use cases: Debate turn analysis, fact-checking, final scoring, personalized feedback
- Wrapper class: `GeminiAI` with async chat completion methods
- Graceful degradation to Replit AI if Gemini unavailable

**AI Judge (LCR Model):**
- **Logic (40% weight):** Evaluates argument structure, reasoning quality, evidence strength
- **Credibility (35% weight):** Assesses source reliability, fact accuracy, expertise demonstration
- **Rhetoric (25% weight):** Analyzes persuasiveness, delivery, emotional appeal

**Fact-Checking Pipeline:**
- Optional integration with Serper API (free tier friendly) for web search verification
- Context-aware statement validation against debate topic and reference materials
- Results cached to avoid redundant API calls

**AI Trainer System:**
- Post-debate performance analysis with aggregated LCR scores
- Personalized strength/weakness identification
- Challenge generation based on detected weaknesses
- XP and badge system for gamification

### WebSocket Architecture

**Connection Management:**
- Room-based connection pooling (one pool per debate room)
- Separate channels for debaters (`/ws/debate/{room_id}`), spectators (`/ws/spectator/{room_id}`), and trainer (`/ws/trainer/{user_id}`)
- Broadcast pattern for real-time updates to all connected clients in a room

**Event Types:**
- Debate events: `turn_submitted`, `participant_joined`, `participant_ready`, `debate_started`
- Spectator events: `reaction`, `support_update`
- Trainer events: `progress_update`, `new_recommendation`, `challenge_completed`

**Design Tradeoff:** Simple broadcast model without message persistence (clients must handle reconnection and state recovery)

### File Upload System

**Storage Location:** Local filesystem (`uploads/pdfs`, `uploads/audio`)

**Design Decision:** File uploads stored locally rather than using Replit Object Storage
- Rationale: Simpler implementation for MVP, acceptable for hackathon scope
- Future consideration: Migrate to cloud storage (Replit Object Storage, S3, etc.) for production

**Supported Formats:**
- PDFs: Reference materials for debate context
- Audio: MP3, WAV, OGG for voice debate submissions
- Size limit: 50MB per file

**Processing Pipeline:**
- Async file writing with `aiofiles` for non-blocking I/O
- Metadata stored in `UPLOADED_FILES` collection with file path references
- No automatic transcription implemented (placeholder for future enhancement)

## External Dependencies

### Third-Party Services

**Google Gemini AI (Required)**
- Purpose: Primary AI provider for debate analysis and judging
- API Key: `GEMINI_API_KEY` environment variable
- Free tier limitations: Rate limits apply, monitor usage for production deployments
- Fallback: Replit AI if Gemini unavailable

**Serper API (Optional)**
- Purpose: Web search for fact-checking capabilities
- API Key: `SERPER_API_KEY` environment variable
- Free tier: 2,500 searches/month
- Graceful degradation if not configured

**Tavily API (Optional)**
- Purpose: Alternative fact-checking provider
- API Key: `TAVILY_API_KEY` environment variable
- Currently not actively implemented in codebase

### Replit Platform Features

**Replit Database**
- Built-in key-value store accessed via `replit` Python package
- No configuration required when deployed on Replit
- Automatic fallback to in-memory storage for local development

**Replit AI (Fallback)**
- Accessed via `replit.ai.modelfarm` package
- Free AI model access for Replit-hosted projects
- Used only when Gemini unavailable

**Replit Auth**
- Seamless OAuth-like authentication via `replit.web` package
- Zero configuration on Replit platform
- Simple token auth fallback for local development

### Python Packages

**Core Framework:**
- `fastapi>=0.95.0` - Web framework
- `uvicorn[standard]>=0.20.0` - ASGI server
- `pydantic>=2.0.0` - Data validation
- `websockets>=12.0` - WebSocket support

**AI & ML:**
- `google-generativeai>=0.3.0` - Gemini AI SDK
- `replit-ai>=0.0.11` - Replit AI integration

**Utilities:**
- `orjson>=3.0.0` - Fast JSON serialization
- `python-multipart>=0.0.5` - File upload handling
- `aiofiles>=23.0.0` - Async file operations
- `PyMuPDF>=1.23.0` - PDF processing
- `beautifulsoup4>=4.12.0` - HTML parsing
- `httpx>=0.25.0` - Async HTTP client

### JavaScript Packages

**Core Framework:**
- `react@18.2.0` & `react-dom@18.2.0` - UI library
- `vite@5.0.0` - Build tool and dev server
- `react-router-dom@6.20.0` - Client-side routing

**UI & Animation:**
- `tailwindcss@3.4.18` - Utility-first CSS framework
- `framer-motion@12.23.24` - Animation library
- `gsap@3.13.0` - Advanced animation toolkit
- `lucide-react@0.553.0` - Icon library
- `recharts@3.3.0` - Chart/visualization library

### Environment Configuration

**Required:**
- `GEMINI_API_KEY` - Google Gemini AI access

**Optional:**
- `SERPER_API_KEY` - Fact-checking via web search
- `SECRET_KEY` - JWT token signing (auto-generated if missing)
- `VITE_API_URL` - Frontend API endpoint override
- `VITE_WS_URL` - Frontend WebSocket endpoint override

**Replit Auto-Injected:**
- `REPL_ID`, `REPL_SLUG`, `REPL_OWNER` - Platform metadata
- `REPLIT_DEV_DOMAIN` - Auto-configured CORS origin