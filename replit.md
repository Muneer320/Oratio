# Overview

Oratio is an AI-powered debate platform designed for real-time voice and text debates. It features AI-based judging, structured debate rooms, spectating capabilities, and personalized training feedback. The platform utilizes the LCR (Logic, Credibility, Rhetoric) model for debate evaluation and incorporates gamified elements like XP and badges to enhance the learning experience. The project aims to provide a comprehensive and engaging environment for improving debate skills.

# Recent Changes (November 2025)

**Critical Bug Fixes:**
- Fixed "Host Anonymous" bug by implementing host name enrichment across all room endpoints (create/list/get)
- Fixed "Room Full" bug by checking if current user is already a participant before showing capacity limits
- Fixed "Everyone Joining as Spectator" bug by implementing confirmation polling that waits up to 10 seconds to verify user appears in participant list with role='debater' before navigation
- Fixed request timeout issues by increasing default API timeout from 30s to 60s across all methods (GET, POST, PUT, DELETE, uploadFile, postFormData)
- **Fixed "Joining as Spectator" bug**: JoinRoomByCode now checks if user is already a participant before navigating; non-participants are always directed to upcoming page to join first (prevents spectator-only access)

**Performance Optimizations (November 8, 2025):**
- **Backend API Caching**: Added aggressive caching to reduce database load:
  - `get_room_by_code`: 30s cache (reduces repeated lookups during polling)
  - `get_debate_status`: 15s cache (most frequently polled endpoint)
  - `get_transcript`: 15s cache (reduces full table scans)
  - User data cache: 5-minute TTL (usernames rarely change)
  - Room cache default: 30s (up from 10s)
- **Cache Invalidation**: All participant mutations (join/leave/ready) invalidate debate status cache immediately, ensuring fresh data for join confirmation flows
- **Expected Impact**: 80-90% reduction in database queries during active debates, most requests complete in <5s instead of timing out at 60s
- Reduced API polling intervals: Dashboard and UpcomingDebateDetails (5s → 30s), 83% reduction
- Implemented Page Visibility API: polling stops when tab is inactive/hidden, saving resources
- Added comprehensive timeout handling with AbortController to prevent stuck submit buttons
- Frontend now auto-refreshes when tab becomes visible again for best UX

**UX Improvements:**
- Replaced "Notify me" browser alert with graceful animated UI message that auto-dismisses after 5 seconds, suggesting users bookmark the page or set a reminder
- Added audio playback button (Play/Pause) for reviewing recorded audio before submission
- Added enhanced "⚖️ AI Judging in Progress..." indicator with gradient styling that shows when AI is analyzing turns after round completion
- Implemented strict turn-based debate system preventing consecutive submissions from same user/team
- **Auto-redirect to results**: When all rounds complete, all users (debaters, spectators, host) automatically redirect to results page
- **Seat-Filling Requirement**: Participants cannot submit arguments until all debate seats are filled (2 for individual, 4 for team debates)
- **Turn Submission Lock**: Input area and buttons automatically disable after participant submits their turn for the current round
- **Comprehensive Results Page**: Rebuilt with role-based tabs:
  - **Overview Tab** (all users): AI summary, winner announcement, **interactive bar chart** comparing LCR scores, detailed LCR breakdown with animated progress bars for all participants, strengths/weaknesses, key insights
  - **Team Analysis Tab** (team debates only): Team performance comparison, average LCR scores per team, member breakdown, team stats
  - **My Performance Tab** (participants only): Personal LCR scores, detailed feedback (strengths, weaknesses, improvements), performance statistics
  - **Transcript Tab** (all users): Full debate replay with audio playback buttons
- **Spectator Reactions**: Spectators can react to participants during debates with four reaction types (Agree, Strong Argument, Insightful, Support) with instant feedback

**Join Flow Improvements:**
- Join operation now waits for backend confirmation before navigating to debate page
- If confirmation fails after 10 retries, user sees clear error message and can retry
- Navigation is strictly gated on confirmed debater status, preventing spectator mode entry

**Technical Debt:**
- **Database Performance**: ReplitDB.find() performs full table scans (O(n) for all queries). Future work needed: add indexed secondary maps or migrate to a database with filtered query support before data volume grows significantly

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture

The backend is built with FastAPI, leveraging async support for high-performance API and WebSocket handling. Data is primarily stored in Replit Database, utilizing a collections-based structure with prefixed keys for organization. A custom CRUD wrapper (`ReplitDB` class) facilitates structured data operations, and auto-ID generation ensures consistent indexing. ISO timestamp strings are used for date/time storage. For authentication, Oratio integrates with Replit Auth for seamless user identification and uses a session token-based system for API requests, with a fallback token-based system for local development.

## AI Integration

Debate analysis uses Google Gemini AI (gemini-2.5-pro) exclusively for all AI-powered features. The system evaluates debates based on logic (40%), credibility (35%), and rhetoric (25%), using context-aware analysis and JSON response validation. 

**Result Generation Process:**
1. **Per-Turn Analysis**: Each turn is analyzed after round completion with LCR scores and feedback
2. **Final Verdict**: When debate ends, comprehensive results are auto-generated including:
   - Winner determination based on weighted scores
   - Overall debate summary from Gemini AI
   - Individual participant analysis (strengths, weaknesses, improvements)
   - Aggregated LCR scores across all turns
3. **Results saved to RESULTS collection** for display on results page

Audio transcription is handled by Gemini's file upload API with non-blocking async processing to maintain server responsiveness during audio uploads. The transcription is stored as turn content and analyzed like text submissions. Fact-checking is an optional feature via Serper API for claim verification.

## Real-Time Communication

Real-time interactions are managed through a WebSocket architecture with dedicated endpoints for debate, spectator, and trainer functionalities. A `ConnectionManager` class handles active connections per room, enabling room-based broadcasting for efficient message distribution of turn updates, participant status changes, and training notifications.

## API Design

The API follows a RESTful structure, organized into modular routers by domain (auth, rooms, debate, ai, trainer, etc.). It uses Pydantic schemas for request/response validation, consistent error handling with HTTPException, and dependency injection for authentication and database access.

## Frontend Architecture

The frontend is developed using React 18 with Vite 5, employing React Router v6 for navigation. State management relies on React hooks, complemented by custom hooks for WebSocket connections. Styling is implemented with TailwindCSS v3, adhering to a modern professional design system characterized by clean gradient backgrounds, Lucide React icons, and a responsive, mobile-first approach. The design system emphasizes Indigo and Blue primary/secondary colors, rounded components, and smooth animations with Framer Motion. The project structure is organized into `pages/`, `components/`, `services/`, `hooks/`, `utils/`, `context/`, and `routes/` for clarity and maintainability.

## Configuration Management

Environment detection automatically switches between development and production configurations using `REPL_ENV`. CORS configuration dynamically adjusts for Replit deployment URLs and local development. Pydantic Settings manage type-safe configurations for database, AI, security, and file uploads.

# External Dependencies

## Replit Platform Services

- **Replit Database**: Primary data persistence for users, rooms, participants, turns, etc.
- **Replit Auth**: User authentication and session management.

## Third-Party APIs

- **Google Gemini AI**: Primary AI provider for debate analysis and training feedback using gemini-2.5-pro model (requires API key).
- **Serper API**: Optional fact-checking via web search (requires API key).

## Python Dependencies

- **Core Framework**: `fastapi`, `uvicorn`, `pydantic`, `websockets`.
- **Replit Integration**: `replit`, `Flask`.
- **File Processing**: `python-multipart`, `aiofiles`, `PyMuPDF`, `beautifulsoup4`.
- **AI Providers**: `google-genai` (Google Gemini AI SDK).
- **Utilities**: `python-dotenv`, `httpx`, `requests`.

## Frontend Dependencies

- **Core Libraries**: `react`, `react-dom`, `react-router-dom`.
- **UI & Animation**: `lucide-react`, `framer-motion`.
- **Build Tools**: `vite`, `@vitejs/plugin-react`.
- **Styling**: `tailwindcss`, `autoprefixer`, `postcss`, `@tailwindcss/postcss`.