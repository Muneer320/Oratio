# Overview

Oratio is an AI-powered debate platform that enables real-time voice and text debates with AI-based judging. The platform allows users to host debate rooms, participate in structured debates, spectate ongoing debates, and receive personalized training feedback. The system uses the LCR (Logic, Credibility, Rhetoric) model for debate evaluation and provides gamified learning experiences with XP, badges, and improvement tracking.

**Status**: ✅ Production-ready (November 7, 2025)

# Recent Changes

**November 8, 2025 (Latest)** - UX & Feature Enhancements
- ✅ **Style Consistency**: Updated Home.jsx to match light theme used across app (indigo/blue gradient)
- ✅ **Bottom Tab Navigation**: Replaced top navbar with mobile-first bottom tab bar
  - Active tab displays icon + name, inactive tabs show icon only
  - Created BottomTabBar.jsx component with fixed bottom positioning
- ✅ **Working Theme Switcher**: Implemented functional theme system
  - Created ThemeContext with localStorage persistence
  - Integrated with Settings page for light/dark mode toggle
- ✅ **Enhanced Debate Creation**: Updated AddDebate form with comprehensive fields
  - Name, description, scheduled time, duration (minutes)
  - Number of participants, team/individual mode
  - Resource links (multiple URLs for reference materials)
  - Format options: Text, Audio, or Both
  - Number of rounds configuration
- ✅ **Backend Schema Updates**: Fixed RoomResponse to match ReplitDB storage
  - All fields use string types (scheduled_time, mode, type, visibility, status)
  - Resources stored as List[str] for URL links
  - Eliminates FastAPI validation errors
- ✅ **Display Improvements**: Updated Debate and Results pages
  - Resources section with clickable reference links
  - Description and metadata display
  - Better information organization

**November 8, 2025** - Complete App Flow Update
- ✅ Implemented comprehensive Frontend Page Flow with all required pages
- ✅ Created Dashboard page (`/home`) with Ongoing/Upcoming/Past debates sections
- ✅ Created AddDebate page (`/add`) with full debate creation form
- ✅ Created Profile page with user stats, badges, and achievements
- ✅ Created Settings page with theme toggle and preferences
- ✅ Created About and 404 NotFound pages
- ✅ Built shared Layout component with navigation bar (Home/Add/Learn/Profile/Settings)
- ✅ Updated routing with complete navigation flow matching Frontend Page Flow spec
- ✅ Enhanced OpenAI retry logic with exponential backoff (3 attempts: 0.5s, 1s, 2s delays)
- ✅ All pages follow consistent design system (Indigo/Blue gradient, rounded-2xl cards, Lucide icons)

**November 8, 2025** - AI Resilience Enhancement
- ✅ Implemented OpenAI GPT-4o mini as fallback AI provider
- ✅ Added AI provider cascade: Replit AI → OpenAI → Static fallback
- ✅ Ensures real AI analysis always available even during Replit AI outages
- ✅ Secure API key management via Replit Secrets (OPENAI_API_KEY)
- ✅ JSON response validation for both AI providers
- ✅ Cost-effective model selection (gpt-4o-mini) for debate analysis

**November 7, 2025** - Production Readiness Achieved
- ✅ Implemented JWT-based authentication with automatic participant detection
- ✅ Fixed participant tracking: Now derives `isParticipant` from API instead of localStorage
- ✅ Integrated AI-powered turn analysis via backend `/api/debate/{room_id}/submit-turn` endpoint
- ✅ Added graceful 401/403 error handling with user-friendly messages
- ✅ Configured autoscale deployment for production publishing
- ✅ Complete end-to-end debate flow: Host → Join → Debate → Results
- ✅ Real-time debate state tracking with round/turn progression
- ✅ Clear spectator vs participant UI distinction

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture

**Framework**: FastAPI with async support for high-performance API and WebSocket handling

**Data Storage Strategy**: 
- **Primary**: Replit Database (key-value store) for all production data
- **Collections-based structure**: Data organized into logical collections (users, rooms, participants, turns, etc.) with prefixed keys
- **Fallback**: In-memory dictionary for local development when Replit DB is unavailable
- **Legacy support**: SQLAlchemy models maintained as reference but not actively used

**Key Architectural Decisions**:
- Chose Replit DB over traditional SQL database to leverage Replit's native features and eliminate external database dependencies
- Implemented custom CRUD wrapper (`ReplitDB` class) to provide structured data operations on top of key-value storage
- Auto-ID generation using collection-specific counters for consistent data indexing
- ISO timestamp strings for date/time storage in key-value format

## Authentication & Authorization

**Primary**: Replit Auth integration for seamless authentication without password management
- Leverages `replit.web.auth` for user identification
- Session token-based authentication for API requests
- HTTPBearer security scheme for protected endpoints

**Fallback**: Simple token-based authentication system for local development
- Custom token generation and validation
- User registration with hashed passwords
- Dependency injection pattern for `get_current_user`

## AI Integration

**Debate Analysis**: Multi-provider AI cascade for maximum reliability
- **Primary**: Replit AI ChatModel (chat-bison) for real-time LCR analysis
- **Fallback**: OpenAI GPT-4o mini when Replit AI unavailable
- **Last Resort**: Static responses for demo mode
- Cascade strategy ensures real AI analysis always available
- Evaluates logic (40%), credibility (35%), and rhetoric (25%) scores
- Context-aware analysis using debate topic and previous turns
- JSON response validation and parsing for both providers

**Fact-Checking**: Serper API integration
- Web search for claim verification
- Optional feature (requires API key)
- Used to validate credibility scores

**Training System**: AI-generated personalized feedback
- Performance analysis across multiple debates
- Strength/weakness identification
- Customized improvement recommendations
- Challenge generation for skill development

## Real-Time Communication

**WebSocket Architecture**:
- Three separate WebSocket endpoints: debate, spectator, trainer
- ConnectionManager class for managing active connections per room
- Room-based broadcasting for efficient message distribution
- Supports real-time turn updates, participant status changes, reactions, and training notifications

**Event Types**:
- Debate events: turn submission, participant status, debate lifecycle
- Spectator events: reactions, support statistics
- Trainer events: progress updates, recommendations, challenge results

## API Design

**RESTful Structure**:
- Modular router organization by domain (auth, rooms, participants, debate, ai, trainer, uploads, utils)
- Pydantic schemas for request/response validation
- Consistent error handling with HTTPException
- Dependency injection for authentication and database access

**Key Endpoints**:
- Authentication: register, login, user profile
- Room management: create, update, list, join
- Debate flow: submit turns, analyze performance
- AI services: analyze turns, fact-check, final scoring
- Training: performance analysis, challenges, recommendations
- Utilities: health check, config, leaderboard, feedback

## File Upload System

**Storage**: Local filesystem with organized directories
- PDFs stored in `uploads/pdfs/`
- Audio files in `uploads/audio/`
- File metadata tracked in Replit DB

**Validation**:
- File type restrictions (PDF for documents)
- Size limits (configurable, default 50MB)
- Async file operations using `aiofiles`

## Frontend Architecture

**Framework**: React 18 with Vite 5 for fast development and optimized builds

**Routing**: React Router v6 for single-page application navigation

**State Management**: React hooks (useState, useEffect) with custom hooks for WebSocket connections

**Styling**: TailwindCSS v3 with modern professional design system
- Clean gradient backgrounds (slate, blue, indigo)
- Lucide React icons throughout
- Subtle shadows and borders
- Framer Motion for smooth animations
- Card-based layouts
- Responsive design with mobile-first approach

**Design System**:
- **Colors**: Indigo (#4F46E5) primary, Blue (#3B82F6) secondary, Slate for text
- **Backgrounds**: Gradient from slate-50 via blue-50 to indigo-50
- **Typography**: System font stack, clear hierarchy, generous spacing
- **Components**: Rounded-2xl cards, subtle shadows, border-slate-200
- **Buttons**: Rounded-xl with shadow-lg, indigo gradient for CTAs
- **Animations**: Smooth transitions, hover effects, entrance animations
- **Icons**: Lucide React icons (Brain, Trophy, Target, etc.)
- **Spacing**: Generous whitespace, clean layouts, organized sections

**Project Structure**:
- `pages/` - Route components (complete Frontend Page Flow implementation)
  - `Home.jsx` - Hero landing page with features and CTAs (route: `/`)
  - `Dashboard.jsx` - Main hub with Ongoing/Upcoming/Past debates sections (route: `/home`)
  - `AddDebate.jsx` - Create debate room with full settings form (route: `/add`)
  - `Debate.jsx` - Live debate arena with role-based UI (host/debater/spectator) (route: `/debate/:roomCode`)
  - `Results.jsx` - Final scores, LCR charts, and detailed analytics (route: `/results/:roomCode`)
  - `Trainer.jsx` - AI training mode with challenges and progress tracking (route: `/learn`)
  - `Profile.jsx` - User stats, badges, achievements, and XP progress (route: `/profile`)
  - `Settings.jsx` - Theme toggle, notifications, and user preferences (route: `/settings`)
  - `About.jsx` - About Oratio, mission, and contact info (route: `/about`)
  - `NotFound.jsx` - 404 page with navigation back to home (route: `*`)
  - `Login.jsx` - Authentication page
  - `Register.jsx` - User registration page
- `components/` - Reusable UI components
  - `Layout.jsx` - Shared layout with navbar and footer for authenticated pages
  - `ProtectedRoute.jsx` - Authentication wrapper for protected routes
  - `ScoreBoard.jsx`, `TurnDisplay.jsx`, `VoiceInput.jsx`, `RewardPanel.jsx` - Debate-specific components
- `services/` - API and WebSocket service layers
- `hooks/` - Custom React hooks (useWebSocket)
- `utils/` - Helper functions and constants
- `context/` - React context providers (AuthContext)
- `routes/` - Centralized routing configuration

## Configuration Management

**Environment Detection**:
- Automatic Replit environment detection via `REPL_ENV` variable
- Development vs. production configuration switching
- Feature availability checking (DB, AI, Auth)

**CORS Configuration**:
- Auto-detection of Replit deployment URL
- Localhost fallbacks for development
- Wildcard methods and headers for flexibility

**Settings Management**:
- Pydantic Settings for type-safe configuration
- Environment variable loading with sensible defaults
- Separate configs for database, AI, security, and file uploads

# External Dependencies

## Replit Platform Services

**Replit Database** (Built-in)
- Purpose: Primary data persistence layer
- Implementation: Key-value store accessed via `replit` Python package
- Collections: users, rooms, participants, turns, spectators, uploaded_files, challenges, feedback

**Replit AI** (Built-in)
- Purpose: Debate analysis and training feedback
- Models: ChatModel (chat-bison) for conversational AI
- API: `replit.ai.modelfarm` package
- Rate limits: Subject to Replit AI usage limits

**Replit Auth** (Built-in)
- Purpose: User authentication
- Implementation: `replit.web.auth` for username retrieval
- Session management: Custom token system layered on top

## Third-Party APIs

**Serper API** (Optional)
- Purpose: Fact-checking via web search
- Authentication: API key via `SERPER_API_KEY` environment variable
- Free tier available at serper.dev
- Fallback: System operates without fact-checking if unavailable

## Python Dependencies

**Core Framework**:
- `fastapi>=0.95.0` - Web framework
- `uvicorn[standard]>=0.20.0` - ASGI server
- `pydantic>=2.0.0` - Data validation
- `websockets>=12.0` - WebSocket support

**Replit Integration**:
- `replit>=3.0.0` - Replit platform SDK
- `replit-ai>=0.1.0` - AI model access
- `Flask>=2.3.0` - Required for Replit Auth

**File Processing**:
- `python-multipart>=0.0.5` - Form data handling
- `aiofiles>=23.0.0` - Async file I/O
- `PyMuPDF>=1.23.0` - PDF processing
- `beautifulsoup4>=4.12.0` - HTML parsing

**AI Providers**:
- `openai>=2.0.0` - OpenAI API client for GPT-4o mini fallback

**Utilities**:
- `python-dotenv>=1.0.0` - Environment management
- `httpx>=0.25.0` - Async HTTP client
- `requests>=2.31.0` - Sync HTTP client

## Frontend Dependencies

**Core Libraries**:
- `react@^18.2.0` - UI framework
- `react-dom@^18.2.0` - DOM rendering
- `react-router-dom@^6.20.0` - Routing

**UI & Animation**:
- `lucide-react` - Modern icon library
- `framer-motion` - Smooth animations
- `gsap` - Advanced animations (not actively used but available)

**Build Tools**:
- `vite@^5.0.0` - Build tool and dev server
- `@vitejs/plugin-react@^4.0.0` - React plugin for Vite

**Styling**:
- `tailwindcss@^3.4.18` - Utility-first CSS
- `autoprefixer@^10.4.21` - CSS vendor prefixes
- `postcss@^8.5.6` - CSS processing
- `@tailwindcss/postcss@^4.1.17` - PostCSS integration