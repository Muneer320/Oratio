# Contributing to Oratio

Thank you for your interest in contributing to Oratio! 🎉 This document provides guidelines and instructions for contributing to the project.

**Project Info:**

- **Version**: 2.0.0
- **Architecture**: Multi-tier fallback system (DB: Replit DB → In-Memory | AI: Gemini → Replit AI → Static)
- **Tech Stack**: FastAPI, React 18, Gemini AI, Replit DB

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Replit-Specific Development](#replit-specific-development)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Provide constructive feedback
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment or discrimination of any kind
- Trolling, insulting comments, or personal attacks
- Publishing others' private information
- Any conduct that would be inappropriate in a professional setting

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Git**
- **Replit Account** (for Replit-specific features)

### Fork and Clone

1. **Fork** this repository to your GitHub account
2. **Clone** your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/oratio.git
cd oratio
```

3. **Add upstream remote**:

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/oratio.git
```

4. **Create a branch** for your work:

```bash
git checkout -b feature/your-feature-name
```

### Local Setup

#### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

#### Frontend

```bash
cd frontend
npm install
```

---

## 🔄 Development Workflow

### 1. Sync with Upstream

Before starting new work, sync with the main repository:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Write clean, readable code
- Follow coding standards (see below)
- Add tests for new functionality
- Update documentation as needed

### 4. Commit Changes

Use **conventional commit messages**:

```bash
git commit -m "feat: add LCR scoring visualization"
git commit -m "fix: resolve WebSocket connection issue"
git commit -m "docs: update API endpoint documentation"
```

**Commit types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Open Pull Request

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your fork and branch
- Fill out the PR template
- Submit!

---

## ✅ Pull Request Process

### PR Checklist

Before submitting your PR, ensure:

- [ ] Code follows project coding standards
- [ ] All tests pass
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] Commit messages follow conventional format
- [ ] No merge conflicts with main branch
- [ ] PR description clearly explains changes

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How did you test these changes?

## Related Issues

Closes #123
```

### Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged!

---

## 💻 Coding Standards

### Python (Backend)

#### Style Guide

- Follow **PEP 8**
- Use **Black** for formatting: `black app/`
- Use **type hints** for function signatures

```python
# Good
async def get_user(user_id: str) -> Dict[str, Any]:
    """Retrieve user from database."""
    return await ReplitDB.get(Collections.USERS, user_id)

# Bad
def get_user(user_id):
    return ReplitDB.get(Collections.USERS, user_id)
```

#### Naming Conventions

- **Functions/Variables**: `snake_case`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_CASE`
- **Private methods**: `_leading_underscore`

#### Code Organization

```python
# Imports
from typing import Dict, Any
from fastapi import APIRouter, HTTPException

# Constants
MAX_RETRY_ATTEMPTS = 3

# Type definitions
UserDict = Dict[str, Any]

# Functions
async def create_user(user_data: UserDict) -> UserDict:
    """Create new user with validation."""
    # Implementation
```

#### FastAPI Best Practices

- Use **Pydantic schemas** for validation
- Add **docstrings** to all endpoints
- Handle errors with appropriate **HTTP status codes**
- Use **dependency injection** for auth

```python
@router.post("/rooms/create", response_model=RoomResponse)
async def create_room(
    room_data: RoomCreate,
    current_user: Dict = Depends(get_current_user)
) -> RoomResponse:
    """
    Create a new debate room.

    Args:
        room_data: Room creation parameters
        current_user: Authenticated user from dependency

    Returns:
        RoomResponse with created room details

    Raises:
        HTTPException: If creation fails
    """
    # Implementation
```

### JavaScript/React (Frontend)

#### Style Guide

- Use **Prettier** for formatting
- Use **ESLint** for linting
- Follow **Airbnb style guide** (with minor modifications)

#### Naming Conventions

- **Components**: `PascalCase` (e.g., `DebateArena.jsx`)
- **Utilities/Functions**: `camelCase` (e.g., `formatTime`)
- **Constants**: `UPPER_CASE` (e.g., `API_BASE_URL`)
- **CSS classes**: `kebab-case` (e.g., `debate-arena`)

#### Component Structure

```jsx
// Imports
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Component
export default function DebateArena() {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const { roomId } = useParams();

  // Effects
  useEffect(() => {
    // Side effects
  }, [roomId]);

  // Handlers
  const handleSubmit = (event) => {
    // Handler logic
  };

  // Render
  return <div className="debate-arena">{/* JSX */}</div>;
}
```

#### React Best Practices

- Use **functional components** with hooks
- Extract reusable logic into **custom hooks**
- Use **PropTypes** or **TypeScript** for type checking
- Keep components **small and focused**
- Use **meaningful variable names**

```jsx
// Good
const useDebateRoom = (roomId) => {
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      const data = await api.get(`/rooms/${roomId}`);
      setRoom(data);
      setIsLoading(false);
    };
    fetchRoom();
  }, [roomId]);

  return { room, isLoading };
};

// Usage
function DebateArena() {
  const { roomId } = useParams();
  const { room, isLoading } = useDebateRoom(roomId);

  if (isLoading) return <div>Loading...</div>;
  return <div>{room.topic}</div>;
}
```

---

## 🔧 Replit-Specific Development

### Working with Replit Features

When developing Replit-specific features, always include **fallback logic** for local development:

```python
# Example: Replit Database
try:
    from replit import db as replit_db
    REPLIT_DB_AVAILABLE = True
except ImportError:
    replit_db = {}
    REPLIT_DB_AVAILABLE = False

class ReplitDB:
    @staticmethod
    def get(collection: str, id: str):
        if REPLIT_DB_AVAILABLE:
            # Use real Replit DB
            return replit_db.get(f"{collection}:{id}")
        else:
            # Use in-memory fallback
            return local_db.get(f"{collection}:{id}")
```

### Testing Replit Features Locally

1. **Replit Database**: Use in-memory dictionary
2. **Replit AI**: Use mock responses or OpenAI fallback
3. **Replit Auth**: Use simple token auth

### Environment Detection

```python
import os

def is_running_on_replit() -> bool:
    """Check if code is running on Replit."""
    return all([
        os.getenv("REPL_ID"),
        os.getenv("REPL_SLUG"),
        os.getenv("REPL_OWNER")
    ])
```

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Writing Tests

#### Backend (pytest)

```python
import pytest
from app.replit_db import ReplitDB

def test_create_user():
    """Test user creation in database."""
    user_data = {
        "email": "test@example.com",
        "username": "testuser"
    }

    user = ReplitDB.insert("users", user_data)

    assert user["id"] is not None
    assert user["email"] == "test@example.com"
    assert "created_at" in user
```

#### Frontend (Jest + React Testing Library)

```jsx
import { render, screen } from "@testing-library/react";
import ScoreBoard from "../components/ScoreBoard";

test("renders scoreboard with participant scores", () => {
  const scores = {
    participant_a: { logic: 8, credibility: 9, rhetoric: 7 },
    participant_b: { logic: 7, credibility: 8, rhetoric: 9 },
  };

  render(<ScoreBoard scores={scores} />);

  expect(screen.getByText(/Logic: 8/i)).toBeInTheDocument();
  expect(screen.getByText(/Credibility: 9/i)).toBeInTheDocument();
});
```

### Test Coverage

- Aim for **80%+ code coverage**
- All new features **must** have tests
- Bug fixes should include **regression tests**

---

## 📚 Documentation

### Code Documentation

- Add **docstrings** to all functions/classes
- Use **inline comments** for complex logic
- Keep comments **up-to-date** with code changes

### API Documentation

- FastAPI auto-generates docs at `/docs`
- Add **description** and **examples** to endpoints
- Document **error responses**

```python
@router.post(
    "/debate/{room_id}/submit-turn",
    response_model=TurnResponse,
    summary="Submit debate turn",
    description="Submit a new turn in an ongoing debate with optional audio",
    responses={
        200: {"description": "Turn submitted successfully"},
        404: {"description": "Room not found"},
        403: {"description": "Not authorized to submit turn"}
    }
)
```

### README Updates

When adding new features:

- Update the **Features** section
- Add to **Tech Stack** if using new libraries
- Update **API Endpoints** documentation
- Add to **Roadmap** if partially complete

---

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
## Bug Description

Clear description of the bug

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Environment

- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Python: [e.g., 3.11.5]
- Node: [e.g., 20.10.0]

## Screenshots

If applicable
```

---

## 💡 Feature Requests

We welcome feature requests! Please:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Provide examples** if possible

---

## 🎯 Areas for Contribution

Looking for where to start? Here are some areas that need help:

### High Priority

- [ ] WebSocket implementation for real-time debates
- [ ] File upload handling (PDFs, audio)
- [ ] AI judging logic refinement
- [ ] Trainer system exercises

### Medium Priority

- [ ] UI/UX improvements
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Accessibility features

### Low Priority

- [ ] Additional badge designs
- [ ] Theme customization
- [ ] Social sharing features
- [ ] Advanced analytics

---

## 📞 Questions?

- **GitHub Discussions**: Ask questions and discuss ideas
- **GitHub Issues**: Report bugs or request features
- **Discord** (if available): Join our community

---

## 🏆 Contributors

Thank you to all our contributors! Your contributions make this project better.

<!-- Contributors list will be auto-generated -->

---

## 📄 License

By contributing to Oratio, you agree that your contributions will be licensed under the MIT License.

---

**Happy Contributing! 🚀**
