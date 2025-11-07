# Overview

Oratio is an AI-powered debate platform that enables real-time voice and text debates with AI-based judging. The platform allows users to host debate rooms, participate in structured debates, spectate ongoing debates, and receive personalized training feedback. The system uses the LCR (Logic, Credibility, Rhetoric) model for debate evaluation and provides gamified learning experiences with XP, badges, and improvement tracking.

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

**Debate Analysis**: Replit AI (LCR Model)
- Real-time turn-by-turn analysis using Replit's ChatModel
- Evaluates logic, credibility, and rhetoric scores
- Context-aware analysis using debate topic and previous turns
- Fallback to mock responses when Replit AI unavailable

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

**Styling**: TailwindCSS v3 with modern gradient design system
- Purple/pink/blue gradient backgrounds inspired by HypeAPP template
- Glassmorphism effects (backdrop blur, transparency)
- Responsive design utilities
- Component-based CSS classes

**Design System**:
- Primary gradient: `from-purple-900 via-pink-800 to-blue-900`
- Glassmorphic cards: `bg-white bg-opacity-10 backdrop-blur-md`
- Accent gradients: Purple-to-pink, blue-to-purple
- Rounded corners: Large radius (2xl, 3xl) for modern look
- Interactive elements: Hover effects, transitions

**Project Structure**:
- `pages/` - Route components
  - `Home.jsx` - Hero landing page with features and CTAs
  - `Host.jsx` - Create debate room with topic/settings form
  - `Join.jsx` - Enter room code to join debate
  - `Debate.jsx` - Live debate arena with scoreboard and turn submission
  - `Spectate.jsx` - Watch debates with reactions and viewer stats
  - `Trainer.jsx` - AI training mode with challenges and progress tracking
  - `Results.jsx` - Final scores and debate statistics
- `components/` - Reusable UI components (ScoreBoard, TurnDisplay, VoiceInput, RewardPanel)
- `services/` - API and WebSocket service layers
- `hooks/` - Custom React hooks (useWebSocket)
- `utils/` - Helper functions and constants

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

**Utilities**:
- `python-dotenv>=1.0.0` - Environment management
- `httpx>=0.25.0` - Async HTTP client
- `requests>=2.31.0` - Sync HTTP client

## Frontend Dependencies

**Core Libraries**:
- `react@^18.2.0` - UI framework
- `react-dom@^18.2.0` - DOM rendering
- `react-router-dom@^6.20.0` - Routing

**Build Tools**:
- `vite@^5.0.0` - Build tool and dev server
- `@vitejs/plugin-react@^4.0.0` - React plugin for Vite

**Styling**:
- `tailwindcss@^3.4.18` - Utility-first CSS
- `autoprefixer@^10.4.21` - CSS vendor prefixes
- `postcss@^8.5.6` - CSS processing
- `@tailwindcss/postcss@^4.1.17` - PostCSS integration