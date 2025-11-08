#!/usr/bin/env pwsh
# Start Frontend Development Server

Write-Host "🎨 Starting Oratio Frontend Server..." -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $scriptDir "frontend"

# Navigate to frontend
Set-Location $frontendDir

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "✗ node_modules not found!" -ForegroundColor Red
    Write-Host "  Run ./setup.ps1 first or 'npm install' in frontend folder" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Starting Vite development server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Start dev server
npm run dev
