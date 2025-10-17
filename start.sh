#!/bin/bash

# CiniKraft - Quick Start Script for macOS/Linux
# This script will start both frontend and backend servers

echo "============================================"
echo "  CiniKraft Storyboard Generator"
echo "  Starting Development Servers..."
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Python is not installed!"
    echo "Please install Python 3.10+ from https://www.python.org/"
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}[OK]${NC} Python and Node.js are installed"
echo ""

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}[WARNING]${NC} Backend .env file not found!"
    echo "Please create .env file from .env.example"
    echo ""
fi

if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}[WARNING]${NC} Frontend .env file not found!"
    echo "Please create frontend/.env file from frontend/.env.example"
    echo ""
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "Servers stopped."
    echo "Thank you for using CiniKraft!"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

echo "============================================"
echo "  Starting Backend Server (Django)"
echo "============================================"
echo ""

# Start backend server
python3 manage.py runserver &
BACKEND_PID=$!

echo "Waiting 3 seconds for backend to start..."
sleep 3

echo ""
echo "============================================"
echo "  Starting Frontend Server (React + Vite)"
echo "============================================"
echo ""

# Start frontend server
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

sleep 2

echo ""
echo "============================================"
echo "  Servers Started Successfully!"
echo "============================================"
echo ""
echo -e "${GREEN}Backend:${NC}  http://127.0.0.1:8000"
echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers..."
echo ""

# Wait for user to stop
wait
