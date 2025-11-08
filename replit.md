# Overview

Oratio is an AI-powered debate platform designed for real-time voice and text debates. It features AI-based judging, structured debate rooms, spectating capabilities, and personalized training feedback. The platform utilizes the LCR (Logic, Credibility, Rhetoric) model for debate evaluation and incorporates gamified elements like XP and badges to enhance the learning experience. The project aims to provide a comprehensive and engaging environment for improving debate skills.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture

The backend is built with FastAPI, leveraging async support for high-performance API and WebSocket handling. 

**Database Layer (November 8, 2025 - PostgreSQL Migration Complete)**:
- **Production Database**: PostgreSQL (Neon-backed) with async SQLAlchemy 2.x
- **Schema**: Fully normalized relational schema with proper foreign keys and CASCADE deletes
- **Performance**: Sub-100ms queries with composite indexes on high-traffic columns:
  - rooms(room_code) UNIQUE
  - participants(room_id, role)
  - turns(room_id, round_number, turn_number)
  - results(room_id) UNIQUE
  - spectator_votes(room_id, target_id, reaction_type)
  - users(email, username) UNIQUE
- **Repository Pattern**: All database access abstracted through async repository classes (UserRepository, RoomRepository, ParticipantRepository, TurnRepository, ResultRepository, SpectatorVoteRepository, TrainerFeedbackRepository)
- **Session Management**: Async sessions with proper connection pooling and SSL support
- **Migrations**: Alembic for schema versioning and migrations
- **Cache Strategy**: Reduced from 120s to 10s TTL (PostgreSQL performance allows faster refreshes)

**Legacy Note**: Previous ReplitDB implementation suffered from 12-15s query times due to full table scans. Migrated to PostgreSQL for 120x performance improvement.

Authentication is handled by Replit Auth for seamless user identification and a session token-based system for API requests.

## AI Integration

Debate analysis uses Google Gemini AI (gemini-2.5-pro) exclusively for all AI-powered features, evaluating debates based on logic (40%), credibility (35%), and rhetoric (25%). AI analysis is context-aware and uses JSON response validation. Audio transcription is handled by Gemini's file upload API with non-blocking async processing. Fact-checking is an optional feature via Serper API.

## Real-Time Communication

Real-time interactions are managed through a WebSocket architecture with dedicated endpoints for debate, spectator, and trainer functionalities. A `ConnectionManager` class handles active connections per room, enabling room-based broadcasting for efficient message distribution.

## API Design

The API follows a RESTful structure, organized into modular routers. It uses Pydantic schemas for request/response validation, consistent error handling, and dependency injection for authentication and database access.

## Frontend Architecture

The frontend is developed using React 18 with Vite 5 and React Router v6 for navigation. State management relies on React hooks. Styling is implemented with TailwindCSS v3, adhering to a modern professional design system with clean gradient backgrounds, Lucide React icons, and a responsive, mobile-first approach. The design system emphasizes Indigo and Blue primary/secondary colors, rounded components, and smooth animations with Framer Motion.

## Configuration Management

Environment detection automatically switches between development and production configurations using `REPL_ENV`. CORS configuration dynamically adjusts for Replit deployment URLs and local development. Pydantic Settings manage type-safe configurations for database, AI, security, and file uploads.

# External Dependencies

## Replit Platform Services

- **PostgreSQL Database (Neon)**: Primary data persistence for users, rooms, participants, turns, results, and all application data. Fully migrated from ReplitDB on November 8, 2025.
- **Replit Auth**: User authentication and session management.

## Third-Party APIs

- **Google Gemini AI**: Primary AI provider for debate analysis and training feedback using `gemini-2.5-pro` model.
- **Serper API**: Optional fact-checking via web search.

## Python Dependencies

- **Core Framework**: `fastapi`, `uvicorn`, `pydantic`.
- **Database**: `sqlalchemy[asyncio]`, `asyncpg`, `alembic`, `psycopg2-binary`.
- **Replit Integration**: `replit`.
- **AI Providers**: `google-genai`.

## Frontend Dependencies

- **Core Libraries**: `react`, `react-dom`, `react-router-dom`.
- **UI & Animation**: `lucide-react`, `framer-motion`.
- **Build Tools**: `vite`.
- **Styling**: `tailwindcss`.