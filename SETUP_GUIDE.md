# 🛠️ CiniKraft - Complete Setup Guide

This guide will walk you through setting up the CiniKraft Storyboard Generator from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)
7. [Optional Features](#optional-features)

---

## Prerequisites

### Required Software

#### 1. Node.js and npm
- **Version**: Node.js 18+ and npm 9+
- **Download**: https://nodejs.org/
- **Verify Installation**:
  ```bash
  node --version  # Should show v18.x.x or higher
  npm --version   # Should show 9.x.x or higher
  ```

#### 2. Python
- **Version**: Python 3.10+
- **Download**: https://www.python.org/downloads/
- **Verify Installation**:
  ```bash
  python --version  # Should show Python 3.10.x or higher
  pip --version     # Should be installed with Python
  ```

#### 3. Git
- **Download**: https://git-scm.com/downloads
- **Verify Installation**:
  ```bash
  git --version  # Should show git version 2.x.x
  ```

### Required Accounts

#### 1. Supabase Account (Free)
- **Sign up**: https://supabase.com/
- **Purpose**: Database and authentication
- **What you'll need**: 
  - Project URL
  - Anon/Public API Key

#### 2. Hugging Face Account (Free)
- **Sign up**: https://huggingface.co/join
- **Purpose**: AI image generation
- **What you'll need**: 
  - Access Token (create at https://huggingface.co/settings/tokens)

---

## Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Mukundan150/cini-storyboard-generator.git

# Navigate to project directory
cd cini-storyboard-generator
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install all dependencies
npm install

# Expected output: Installing 200+ packages
# This may take 2-5 minutes depending on your internet speed
```

**Installed Frontend Packages:**
- React 19.1.1 - UI library
- React Router 7.1.1 - Routing
- Vite 7.1.7 - Build tool
- Supabase JS - Database client
- jsPDF - PDF export
- jszip - ZIP file creation

### Step 3: Backend Setup

```bash
# Go back to root directory
cd ..

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Django and dependencies
pip install -r django_requirements.txt
```

**Installed Backend Packages:**
- Django 4.2.7 - Web framework
- djangorestframework - REST API
- django-cors-headers - CORS support
- requests - HTTP client
- Pillow - Image processing
- huggingface-hub - AI model access

---

## Environment Configuration

### Frontend Environment Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Create `.env` file**:
   ```bash
   # Create the file
   touch .env  # On macOS/Linux
   # OR
   type nul > .env  # On Windows
   ```

3. **Add Supabase credentials**:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

**Where to find Supabase credentials:**
- Go to your [Supabase Dashboard](https://app.supabase.com/)
- Select your project
- Go to **Settings** → **API**
- Copy:
  - **Project URL** → `VITE_SUPABASE_URL`
  - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### Backend Environment Setup

1. **Navigate to root directory**:
   ```bash
   cd ..  # Go back to project root
   ```

2. **Create `.env` file** (in root directory):
   ```bash
   touch .env  # On macOS/Linux
   # OR
   type nul > .env  # On Windows
   ```

3. **Add Hugging Face token**:
   ```env
   HF_TOKEN=hf_your_token_here
   ```

**Where to get Hugging Face token:**
- Go to https://huggingface.co/settings/tokens
- Click **"New token"**
- Give it a name (e.g., "CiniKraft")
- Select **"Read"** access
- Copy the token and paste it in your `.env` file

---

## Database Setup

### Step 1: Create Supabase Project

1. Go to https://app.supabase.com/
2. Click **"New Project"**
3. Choose organization or create new one
4. Enter:
   - **Name**: CiniKraft (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
5. Click **"Create new project"** (takes ~2 minutes)

### Step 2: Run Database Schema

1. Once project is ready, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste this schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    script TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storyboards table
CREATE TABLE IF NOT EXISTS storyboards (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    scenes JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_storyboards_project_id ON storyboards(project_id);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storyboards ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for testing)
-- Note: In production, you should restrict this to authenticated users
CREATE POLICY "Allow all operations on projects" ON projects
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on storyboards" ON storyboards
    FOR ALL USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_storyboards_updated_at
    BEFORE UPDATE ON storyboards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

4. Click **"Run"** or press `Ctrl+Enter`
5. Verify success message appears

### Step 3: Verify Tables

1. Go to **Table Editor** in Supabase dashboard
2. You should see:
   - ✅ `projects` table
   - ✅ `storyboards` table

---

## Running the Application

### Option 1: Using Two Terminals (Recommended)

**Terminal 1 - Backend Server:**
```bash
# Navigate to project root
cd cini-storyboard-generator

# Activate virtual environment (if you created one)
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Run Django development server
python manage.py runserver

# Expected output:
# Performing system checks...
# System check identified no issues (0 silenced).
# Starting development server at http://127.0.0.1:8000/
# Quit the server with CTRL-BREAK.
```

**Terminal 2 - Frontend Server:**
```bash
# Navigate to frontend directory
cd cini-storyboard-generator/frontend

# Run Vite development server
npm run dev

# Expected output:
# VITE v7.1.7  ready in 500 ms
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
# ➜  press h + enter to show help
```

### Option 2: Using PowerShell Script (Windows Only)

Create a file named `start.ps1` in the root directory:

```powershell
# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; python manage.py runserver"

# Wait 3 seconds
Start-Sleep -Seconds 3

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Write-Host "Servers starting..."
Write-Host "Backend: http://127.0.0.1:8000"
Write-Host "Frontend: http://localhost:5173"
```

Run it:
```powershell
.\start.ps1
```

### Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Port Already in Use

**Error**: `Port 8000 is already in use` or `Port 5173 is already in use`

**Solution**:
```bash
# Windows - Kill process on port
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

Or use different ports:
```bash
# Backend
python manage.py runserver 8001

# Frontend
npm run dev -- --port 3000
```

#### Issue 2: Module Not Found Errors

**Error**: `ModuleNotFoundError: No module named 'django'`

**Solution**:
```bash
# Make sure virtual environment is activated
# Then reinstall dependencies
pip install -r django_requirements.txt
```

**Error**: `Cannot find module 'react'`

**Solution**:
```bash
cd frontend
npm install
```

#### Issue 3: Database Connection Failed

**Error**: `Supabase client error` or `Connection refused`

**Solution**:
1. Check `.env` file exists in `frontend` directory
2. Verify Supabase URL and keys are correct
3. Test connection at https://app.supabase.com/

#### Issue 4: AI Image Generation Not Working

**Error**: `401 Unauthorized` or `Invalid token`

**Solution**:
1. Check `HF_TOKEN` in root `.env` file
2. Verify token at https://huggingface.co/settings/tokens
3. Make sure token has **Read** permissions
4. Restart backend server after adding token

#### Issue 5: CORS Errors

**Error**: `Access-Control-Allow-Origin` error in browser console

**Solution**:
1. Verify backend is running on `http://127.0.0.1:8000`
2. Check `cini_storyboard/settings.py` has correct CORS settings:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

#### Issue 6: Blank Page or White Screen

**Solution**:
1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify both servers are running
4. Try clearing browser cache
5. Check `.env` file in frontend directory

---

## Optional Features

### Create Django Superuser (Admin Access)

```bash
python manage.py createsuperuser

# Follow prompts:
# Username: admin
# Email: your@email.com
# Password: (enter password)
# Password (again): (confirm)
```

Access admin panel at http://127.0.0.1:8000/admin

### Enable Additional AI Providers

Add to root `.env` file:

```env
# OpenAI DALL-E (Premium)
OPENAI_API_KEY=sk-your-key-here

# Stability AI (High Quality)
STABILITY_API_KEY=sk-your-key-here
```

### Production Deployment

For production deployment, see:
- [Vercel Deployment Guide](./docs/VERCEL_DEPLOY.md)
- [Heroku Deployment Guide](./docs/HEROKU_DEPLOY.md)
- [Docker Setup](./docs/DOCKER_SETUP.md)

---

## Testing the Setup

### 1. Test Backend

```bash
# Test API endpoint
curl http://127.0.0.1:8000/api/projects/

# Expected output: [] (empty array initially)
```

### 2. Test Frontend

1. Open http://localhost:5173
2. You should see the landing page
3. Click "Get Started" or "Login"
4. Create an account
5. Create a new project
6. Generate a storyboard

### 3. Test AI Image Generation

1. Create a project
2. Add a simple script:
   ```
   A beautiful sunset over the ocean
   A spaceship landing on Mars
   ```
3. Click "Generate Storyboard"
4. Wait 20-30 seconds
5. You should see AI-generated images

---

## Next Steps

✅ Setup complete! Now you can:

1. **Explore the Application**
   - Create projects
   - Generate storyboards
   - Export to PDF
   - Customize your profile

2. **Read the Documentation**
   - [User Guide](./docs/USER_GUIDE.md)
   - [API Documentation](./docs/API_DOCS.md)
   - [Feature Guides](./frontend/README.md)

3. **Customize the App**
   - Modify themes in `frontend/src/index.css`
   - Add new AI providers in `ai_services/ai_generation.py`
   - Extend database schema

4. **Contribute**
   - Report issues on GitHub
   - Submit pull requests
   - Share your feedback

---

## Need Help?

- 📖 **Documentation**: Check the [docs](./docs/) folder
- 🐛 **Issues**: https://github.com/Mukundan150/cini-storyboard-generator/issues
- 💬 **Discussions**: https://github.com/Mukundan150/cini-storyboard-generator/discussions
- 📧 **Email**: support@cinikraft.com

---

**Happy Storyboarding!** 🎬✨
