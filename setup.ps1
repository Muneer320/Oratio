#!/usr/bin/env pwsh
# Oratio Quick Start Script for Windows (PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 Oratio Local Development Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"
$frontendDir = Join-Path $scriptDir "frontend"
$venvDir = Join-Path $backendDir "venv"

# Function to check if command exists
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Check Python
Write-Host "✓ Checking Python..." -ForegroundColor Yellow
if (-not (Test-CommandExists "python")) {
    Write-Host "✗ Python not found! Please install Python 3.11+ from https://www.python.org" -ForegroundColor Red
    exit 1
}
$pythonVersion = python --version
Write-Host "  Found: $pythonVersion" -ForegroundColor Green

# Check Node.js
Write-Host "✓ Checking Node.js..." -ForegroundColor Yellow
if (-not (Test-CommandExists "node")) {
    Write-Host "✗ Node.js not found! Please install from https://nodejs.org" -ForegroundColor Red
    exit 1
}
$nodeVersion = node --version
Write-Host "  Found: Node.js $nodeVersion" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📦 Setting Up Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Create virtual environment if it doesn't exist
if (-not (Test-Path $venvDir)) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv $venvDir
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
$activateScript = Join-Path $venvDir "Scripts\Activate.ps1"

# Check execution policy
$executionPolicy = Get-ExecutionPolicy
if ($executionPolicy -eq "Restricted") {
    Write-Host "⚠ Execution Policy is Restricted. Setting to RemoteSigned..." -ForegroundColor Yellow
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
}

& $activateScript

# Install Python dependencies
Write-Host "Installing Python packages..." -ForegroundColor Yellow
Set-Location $backendDir
pip install -r requirements.txt --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Python packages installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install Python packages" -ForegroundColor Red
    exit 1
}

# Check for .env file
$envFile = Join-Path $backendDir ".env"
if (-not (Test-Path $envFile)) {
    Write-Host ""
    Write-Host "⚠ .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating template .env file..." -ForegroundColor Yellow
    
    @"
# Oratio - Local development .env
API_ENV=development
WS_PORT=8000
RENDER=false

# CORS - comma separated
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8000

# Security
SECRET_KEY=dev-secret-change-me-in-prod

# AI - Leave empty for static/local fallback
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-pro
GEMINI_TEMPERATURE=0.7

# Local dev helper
FORCE_LOCAL=true
"@ | Out-File -FilePath $envFile -Encoding utf8
    
    Write-Host "✓ Template .env created at: $envFile" -ForegroundColor Green
    Write-Host "⚠ IMPORTANT: Edit this file with your actual credentials!" -ForegroundColor Red
    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📦 Setting Up Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location $frontendDir

# Install Node dependencies
if (Test-Path "package.json") {
    Write-Host "Installing Node packages..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Node packages installed" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install Node packages" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠ package.json not found in frontend folder" -ForegroundColor Yellow
}

# Return to root
Set-Location $scriptDir

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit backend/.env if you want to add API keys (optional)" -ForegroundColor White
Write-Host "   - GEMINI_API_KEY (optional) from: https://aistudio.google.com/app/apikey" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the backend server:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor Gray
Write-Host "   uvicorn app.main:app --reload" -ForegroundColor Gray
Write-Host ""
Write-Host "3. In a new terminal, start the frontend:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Open your browser:" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed setup instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
