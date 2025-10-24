@echo off
REM CiniKraft - Quick Start Script for Windows
REM This script will start both frontend and backend servers

echo ============================================
echo   CiniKraft Storyboard Generator
echo   Starting Development Servers...
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed!
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Python and Node.js are installed
echo.

REM Check if .env files exist
if not exist ".env" (
    echo [WARNING] Backend .env file not found!
    echo Please create .env file from .env.example
    echo.
)

if not exist "frontend\.env" (
    echo [WARNING] Frontend .env file not found!
    echo Please create frontend\.env file from frontend\.env.example
    echo.
)

echo ============================================
echo   Starting Backend Server (Django)
echo ============================================
echo.
start cmd /k "title Backend Server && cd backend && python manage.py runserver"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo ============================================
echo   Starting Frontend Server (React + Vite)
echo ============================================
echo.
start cmd /k "title Frontend Server && cd frontend && npm run dev"

echo.
echo ============================================
echo   Servers Started Successfully!
echo ============================================
echo.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop all servers...
pause >nul

echo.
echo Stopping servers...
taskkill /FI "WindowTitle eq Backend Server*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Frontend Server*" /T /F >nul 2>&1

echo Servers stopped.
echo Thank you for using CiniKraft!
pause
