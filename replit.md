# Overview

Oratio is an AI-powered debate platform designed for real-time voice and text debates. It features AI-based judging, structured debate rooms, spectating capabilities, and personalized training feedback. The platform utilizes the LCR (Logic, Credibility, Rhetoric) model for debate evaluation and incorporates gamified elements like XP and badges to enhance the learning experience. The project aims to provide a comprehensive and engaging environment for improving debate skills.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture

The backend is built with FastAPI, leveraging async support for high-performance API and WebSocket handling. Data is primarily stored in Replit Database, utilizing a collections-based structure with prefixed keys for organization. A custom CRUD wrapper (`ReplitDB` class) facilitates structured data operations, and auto-ID generation ensures consistent indexing. ISO timestamp strings are used for date/time storage. For authentication, Oratio integrates with Replit Auth for seamless user identification and uses a session token-based system for API requests, with a fallback token-based system for local development.

## AI Integration

Debate analysis uses Google Gemini AI (gemini-2.5-pro) exclusively for all AI-powered features. The system evaluates debates based on logic (40%), credibility (35%), and rhetoric (25%), using context-aware analysis and JSON response validation. Static fallback responses are provided if Gemini is unavailable. Fact-checking is an optional feature via Serper API for claim verification. The training system provides AI-generated personalized feedback, identifying strengths and weaknesses, and recommending improvements.

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