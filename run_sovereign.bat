@echo off
title PejicAIX Sovereign - Development Environment
echo Initializing PejicAIX Sovereign Substrate...

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    pause
    exit /b
)

:: Install dependencies if node_modules is missing
if not exist "node_modules\" (
    echo node_modules not found. Installing dependencies...
    call npm install
)

:: Start the development server
echo Starting Sovereign Substrate...
call npm run dev

pause
