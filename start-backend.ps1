#!/usr/bin/env pwsh
# Start Backend Server

Write-Host "🚀 Starting Oratio Backend Server..." -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"
$venvDir = Join-Path $scriptDir "venv"
$activateScript = Join-Path $venvDir "Scripts\Activate.ps1"

# Check if venv exists
if (-not (Test-Path $venvDir)) {
    Write-Host "✗ Virtual environment not found!" -ForegroundColor Red
    Write-Host "  Run ./setup.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Activate venv
& $activateScript

# Navigate to backend
Set-Location $backendDir

# Check for .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠ Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "  Backend will use fallback services" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Starting Uvicorn server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
