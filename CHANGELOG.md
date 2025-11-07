# Changelog

All notable changes to the Oratio project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### To Be Implemented

- WebSocket handlers for real-time debate updates
- Complete API router implementations
- File upload functionality
- Comprehensive test suite
- Frontend-backend integration
- Voice input/output features
- Advanced UI animations

---

## [1.0.0-replit] - 2024-01-XX

### Added - Replit Vibeathon Edition

#### Backend

- **Replit Database Integration**

  - Key-value store wrapper (`replit_db.py`)
  - Collections management for users, rooms, participants, turns, etc.
  - CRUD operations with auto-ID generation
  - Fallback to in-memory dictionary for local development

- **Replit AI Integration**

  - LCR Model debate analysis (`replit_ai.py`)
  - Fact-checking using Serper API
  - Final verdict generation
  - Personalized training feedback
  - Fallback mock responses for local development

- **Replit Auth Integration**

  - Seamless authentication via `replit.web.auth` (`replit_auth.py`)
  - Session token management
  - Simple auth fallback for local development
  - User profile management

- **FastAPI Application**

  - Main application setup (`main.py`)
  - Health endpoint with feature detection
  - CORS configuration with Replit domain auto-detection
  - Environment-aware configuration (`config.py`)

- **Data Models**

  - SQLAlchemy models for reference (`models.py`)
  - Pydantic schemas for validation (`schemas.py`)
  - Support for users, rooms, participants, turns, spectator votes, results, trainer feedback

- **Deployment**
  - `.replit` configuration for one-click deployment
  - `replit.nix` for environment setup
  - Comprehensive setup documentation (`REPLIT_SETUP.md`)

#### Frontend

- **Professional React Structure**

  - Pages: Landing, Host Dashboard, Debate Arena, Spectator View, Result, Trainer
  - Components: ScoreBoard, TurnDisplay, VoiceInput, RewardPanel
  - Services: API client, WebSocket manager
  - Hooks: Custom WebSocket hook
  - Utils: Helper functions, constants

- **Styling**

  - TailwindCSS v3.4.0 configuration
  - Custom theme with indigo primary colors
  - Global styles and component-specific CSS
  - Responsive design patterns

- **Routing**
  - React Router v6.20.0 setup
  - Route definitions for all pages
  - Navigation components

#### Documentation

- Comprehensive README with Replit focus
- CONTRIBUTING.md with coding standards
- REPLIT_SETUP.md for deployment
- CHANGELOG.md for version tracking
- Enhanced .gitignore for Python, Node, Replit

#### Configuration

- Environment variable detection
- Replit-specific settings
- Fallback configurations for local development
- Docker setup (deprecated in favor of Replit)

### Changed

- Migrated from PostgreSQL/SQLite to Replit Database
- Replaced OpenAI API with Replit AI
- Switched from JWT authentication to Replit Auth
- Updated dependency list to include Replit packages
- Optimized for Replit deployment workflow

### Removed

- PostgreSQL/SQLite database dependencies
- OpenAI API integration
- JWT token authentication system
- SQLAlchemy async database setup
- Docker-based deployment (kept for reference)
- PowerShell startup scripts

### Technical Details

#### Dependencies

**Backend:**

- fastapi >= 0.95.0
- uvicorn >= 0.21.0
- pydantic >= 2.0.0
- pydantic-settings >= 2.0.0
- replit >= 3.0.0
- replit-ai >= 0.1.0
- Flask (for Replit web features)
- websockets >= 11.0
- PyMuPDF >= 1.23.0
- beautifulsoup4 >= 4.12.0
- httpx >= 0.24.0

**Frontend:**

- react ^18.2.0
- react-dom ^18.2.0
- react-router-dom ^6.20.0
- tailwindcss ^3.4.0
- vite ^5.0.0

#### Environment Variables

- `REPL_ID` - Auto-detected Replit ID
- `REPL_SLUG` - Auto-detected Replit name
- `REPL_OWNER` - Auto-detected Replit owner
- `REPLIT_DEV_DOMAIN` - Auto-detected Replit domain
- `SERPER_API_KEY` - Optional for fact-checking
- `SECRET_KEY` - For session management

---

## [0.1.0] - Initial Setup

### Added

- Initial project structure
- Basic documentation
- License (MIT)
- .gitignore

---

## Version History Summary

| Version      | Date       | Description                        |
| ------------ | ---------- | ---------------------------------- |
| 1.0.0-replit | 2024-01-XX | Replit Vibeathon optimized version |
| 0.1.0        | 2024-01-XX | Initial project setup              |

---

## Notes

### LCR Model Weights

- **Logic**: 40%
- **Credibility**: 35%
- **Rhetoric**: 25%

### Feature Status Legend

- ✅ Complete
- 🚧 In Progress
- 📝 Planned
- ❌ Deprecated

---

For more details about specific changes, see the commit history on GitHub.
