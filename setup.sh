#!/usr/bin/env bash
set -euo pipefail

# Oratio Setup Script (macOS / Linux)
# Mirrors the `setup.ps1` behavior for Unix-like systems.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
VENV_DIR="$BACKEND_DIR/venv"

echo "========================================"
echo "🚀 Oratio Local Development Setup (macOS/Linux)"
echo "========================================="

function command_exists() {
  command -v "$1" >/dev/null 2>&1
}

echo "✓ Checking Python..."
if ! command_exists python3 && ! command_exists python ; then
  echo "✗ Python not found! Please install Python 3.11+ from https://www.python.org" >&2
  exit 1
fi

PY_CMD=python3
if ! command_exists python3 && command_exists python; then
  PY_CMD=python
fi

PY_VERSION=$($PY_CMD --version 2>&1)
echo "  Found: $PY_VERSION"

echo ""
echo "========================================"
echo "📦 Setting Up Backend"
echo "========================================"

if [ ! -d "$VENV_DIR" ]; then
  echo "Creating Python virtual environment..."
  $PY_CMD -m venv "$VENV_DIR"
  echo "✓ Virtual environment created at $VENV_DIR"
else
  echo "✓ Virtual environment already exists at $VENV_DIR"
fi

echo "Activating virtual environment..."
# shellcheck disable=SC1090
source "$VENV_DIR/bin/activate"

echo "Installing Python packages (backend/requirements.txt)..."
pip install --upgrade pip setuptools wheel
if [ -f "$BACKEND_DIR/requirements.txt" ]; then
  pip install -r "$BACKEND_DIR/requirements.txt"
fi

echo "Checking for .env file in backend..."
ENV_FILE="$BACKEND_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "Creating template .env file at $ENV_FILE"
  cat > "$ENV_FILE" <<'EOF'
# Oratio - Local development .env
API_ENV=development
WS_PORT=8000
RENDER=false

# CORS - JSON array for pydantic parsing
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://127.0.0.1:8000"]

# Security
SECRET_KEY=dev-secret-change-me-in-prod

# AI - Leave empty for static/local fallback
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-pro
GEMINI_TEMPERATURE=0.7

# Local dev helper
FORCE_LOCAL=true
EOF
  echo "✓ Template .env created"
else
  echo "✓ .env already exists at $ENV_FILE"
fi

echo ""
echo "========================================"
echo "📦 Setting Up Frontend"
echo "========================================"

if [ -d "$FRONTEND_DIR" ]; then
  if [ -f "$FRONTEND_DIR/package.json" ]; then
    echo "Installing Node packages in frontend..."
    (cd "$FRONTEND_DIR" && npm install)
    echo "✓ Node packages installed"
  else
    echo "⚠ package.json not found in frontend folder"
  fi
else
  echo "⚠ frontend folder not found at $FRONTEND_DIR"
fi

echo ""
echo "========================================"
echo "✅ Setup Complete!"
echo "========================================"
echo ""
echo "Next steps (backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
echo ""
echo "Next steps (frontend - new terminal):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Make the script executable on macOS/Linux:"
echo "  chmod +x setup.sh"
echo "  ./setup.sh"
echo ""
echo "For detailed setup instructions, see DEPLOYMENT_GUIDE.md or README.md"

exit 0
