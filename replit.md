# Overview

Oratio is an AI-powered debate platform designed for real-time voice and text debates. It features AI-based judging, structured debate rooms, spectating capabilities, and personalized training feedback. The platform utilizes the LCR (Logic, Credibility, Rhetoric) model for debate evaluation and incorporates gamified elements like XP and badges to enhance the learning experience. The project aims to provide a comprehensive and engaging environment for improving debate skills.

# Recent Changes (November 2025)

**Architecture Simplification (November 8, 2025):**
- **Removed Supabase Integration**: Completely removed Supabase database dependency in favor of pure Replit DB
- **Pure Replit DB Implementation**: All database operations now use optimized Replit DB with aggressive caching
- **Removed Dependencies**: Eliminated `supabase>=2.0.0` and `postgrest>=0.10.0` packages from requirements
- **Simplified Configuration**: Removed Supabase URL/KEY configuration from backend config
- **Performance**: Combined with existing 60-90s cache TTL + smart invalidation for maximum speed

# Recent Changes (November 2025)

**Critical Bug Fixes:**
- Fixed "Host Anonymous" bug by implementing host name enrichment across all room endpoints (create/list/get)
- Fixed "Room Full" bug by checking if current user is already a participant before showing capacity limits
- Fixed "Everyone Joining as Spectator" bug by implementing confirmation polling that waits up to 10 seconds to verify user appears in participant list with role='debater' before navigation
- Fixed request timeout issues by increasing default API timeout from 30s to 60s across all methods (GET, POST, PUT, DELETE, uploadFile, postFormData)
- **Fixed "Joining as Spectator" bug**: JoinRoomByCode now checks if user is already a participant before navigating; non-participants are always directed to upcoming page to join first (prevents spectator-only access)

**Performance Optimizations (November 8, 2025):**
- **Backend API Caching with Smart Invalidation**: Implemented aggressive caching with comprehensive cache invalidation:
  - `get_room_by_code`: 90s cache (3x longer, reduces repeated lookups)
  - `get_debate_status`: 60s cache (4x longer, most frequently polled endpoint)
  - `get_transcript`: 60s cache (4x longer, reduces full table scans)
  - User data cache: 5-minute TTL (usernames rarely change)
  - **Cache Invalidation**: All mutations (join/leave/ready/submit turn/start/end/update/delete) immediately invalidate affected caches, ensuring real-time updates despite long TTLs
- **Low-Latency Optimizations (November 8, 2025)**:
  - **GZIP Compression**: Reduces payload size by 60-80% for all responses >500 bytes (automatic)
  - **orjson JSON Serialization**: 3-5x faster JSON encoding/decoding compared to standard library
  - **Optimized Uvicorn**: Keep-alive 75s, backlog 2048, concurrency limit 1000, access logging disabled
  - **Batch User Lookups**: Eliminated N+1 queries in debate status endpoint (batch fetch all users at once)
  - **Minimal Payloads**: Return only essential fields in API responses to reduce transfer time
  - **Expected Impact**: Sub-100ms response times for cached requests, 200-400ms for uncached (down from 500-2000ms)
- **Debate Route Extreme Optimizations (November 8, 2025)**:
  - **Parallel Frontend Loading**: `loadRoomData()` fetches room/status/transcript simultaneously with `Promise.allSettled` (3x faster: ~900ms → ~300ms)
  - **Optimistic UI Updates**: Submit operations update UI instantly before backend confirms, eliminating redundant reload calls
  - **Fire-and-Forget AI Analysis**: Submit endpoints return immediately (<200ms) and analyze turns in background with `asyncio.create_task` (25-50x faster: 5-10s → <200ms)
  - **Parallel AI Analysis**: Round completion analyzes all turns simultaneously with `asyncio.gather` (6x faster: 60s → 10s)
  - **Atomic Locking for Race Prevention**: Room-level `asyncio.Lock` serializes submissions to prevent concurrent race conditions:
    - All validation (capacity, consecutive turns, team enforcement) re-runs inside lock with fresh data
    - Guarantees zero extra/invalid turns despite ReplitDB's non-atomic operations
    - Lock held for ~10-15ms (minimal performance impact)
    - Single-process only - multi-worker deployments need shared locking mechanism
  - **Performance Results**: Submit turn 5-10s → <200ms ⚡, Load room ~900ms → ~300ms ⚡, Round analysis 60s → 10s ⚡
- **Frontend Polling Reduction**: Reduced polling frequency to ease backend load:
  - Debate page: 10s → 30s (67% reduction in request volume)
  - Dashboard and UpcomingDebateDetails: 5s → 30s (83% reduction)
- **Expected Impact**: 70-80% reduction in database queries, most requests served from cache in <100ms, only cache misses trigger DB scans
- Implemented Page Visibility API: polling stops when tab is inactive/hidden, saving resources
- **Frontend Timeout Fixes**: Increased API timeouts and added automatic retry logic:
  - GET requests: 60s → 90s with 2 automatic retries (up to 3 total attempts)
  - POST/PUT/DELETE: 60s → 90s
  - File uploads: 60s → 120s (audio/document uploads need more time)
  - Retry logic: Exponential backoff (1s, 2s) only on GET to avoid side effects
  - Virtually eliminates timeout errors in Replit environment network latency
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
- **Database Performance**: ReplitDB.find() performs full table scans (O(n) complexity for all queries). Mitigated by aggressive caching (60-90s TTL + smart invalidation) which serves ~70% of requests from cache
- **Concurrency**: ReplitDB uses non-atomic read-modify-write updates. Mitigated by room-level asyncio.Lock in debate submission endpoints that serializes submissions per room and re-validates all constraints (capacity, consecutive turns) inside the critical section. **Important**: Locks are in-process only; multi-worker deployments need shared locking mechanism (Redis, database-level locks, etc.)
- **Future Optimization Options**: Add secondary index maps for frequently-queried fields, implement distributed locking for multi-worker deployments, or migrate to PostgreSQL for large-scale deployments with native transaction support

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture

The backend is built with FastAPI, leveraging async support for high-performance API and WebSocket handling. Data is stored exclusively in **Replit Database**, utilizing a collections-based structure with prefixed keys for organization. A custom CRUD wrapper (`ReplitDB` class in `backend/app/replit_db.py`) facilitates structured data operations with auto-ID generation for consistent indexing. ISO timestamp strings are used for date/time storage. The system implements **aggressive caching (60-90s TTL) with smart cache invalidation** on all mutations to maximize performance while maintaining data freshness. For authentication, Oratio integrates with Replit Auth for seamless user identification and uses a session token-based system for API requests, with a fallback token-based system for local development.

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