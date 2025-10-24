# 📁 CiniKraft Project Structure

This document outlines the organized file structure of the CiniKraft project.

## Directory Structure

```
djscene/
│
├── backend/                          # Django Backend
│   ├── cini_storyboard/             # Django project settings
│   │   ├── settings.py              # Main configuration
│   │   ├── urls.py                  # Root URL routing
│   │   ├── wsgi.py                  # WSGI config
│   │   └── asgi.py                  # ASGI config
│   │
│   ├── ai_services/                 # AI Generation API
│   │   ├── views.py                 # API endpoints
│   │   ├── ai_generation.py         # Core AI logic
│   │   ├── models.py                # Job/task models
│   │   └── urls.py                  # AI routes
│   │
│   ├── storyboards/                 # Storyboard Management
│   │   ├── models.py                # Project/Frame models
│   │   ├── serializers.py           # API serializers
│   │   ├── views.py                 # CRUD endpoints
│   │   ├── export_views.py          # PDF/ZIP export
│   │   └── urls.py                  # Storyboard routes
│   │
│   ├── ai_extraction/               # AI Utilities
│   │   ├── ai_image_generator.py    # Image generation
│   │   ├── config.py                # API configs
│   │   └── requirements.txt         # AI dependencies
│   │
│   ├── manage.py                    # Django CLI
│   ├── db.sqlite3                   # SQLite database
│   ├── create_superuser.py          # Auto superuser
│   └── README.md                    # Backend docs
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── Landing.jsx          # Landing page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Signup.jsx           # Signup page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── CreateProject.jsx    # Project creation
│   │   │   ├── ScriptInput.jsx      # Script editor
│   │   │   ├── StoryboardViewer.jsx # Storyboard display
│   │   │   ├── AllProjects.jsx      # Project listing
│   │   │   ├── Profile.jsx          # User profile
│   │   │   ├── Sidebar.jsx          # Navigation
│   │   │   └── *.css                # Component styles
│   │   │
│   │   ├── services/                # API clients
│   │   │   ├── djangoApi.js         # Django backend
│   │   │   └── aiService.js         # AI endpoints
│   │   │
│   │   ├── utils/                   # Utilities
│   │   │   └── exportUtils.js       # PDF/Image export
│   │   │
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   │
│   ├── public/                      # Static assets
│   │   ├── professional-storyboard.jpg
│   │   └── ai-powered-generation.jpg
│   │
│   ├── package.json                 # Dependencies
│   ├── vite.config.js               # Vite config
│   └── README.md                    # Frontend docs
│
├── .venv/                           # Python virtual env
├── .env                             # Backend environment
├── .env.example                     # Environment template
├── requirements.txt                 # Python dependencies
├── start.bat                        # Windows quick start
├── start.sh                         # Unix quick start
├── README.md                        # Main documentation
├── SETUP_GUIDE.md                   # Setup instructions
├── DEPLOYMENT.md                    # Deploy guide
└── PROJECT_STRUCTURE.md             # This file

```

## Key Files by Purpose

### 🔧 Configuration
- `backend/cini_storyboard/settings.py` - Django settings
- `frontend/vite.config.js` - Vite/React config
- `.env` - Environment variables
- `backend/django_requirements.txt` - Python packages
- `frontend/package.json` - npm packages

### 🎨 Frontend Pages
- `frontend/src/components/Landing.jsx` - Public landing page
- `frontend/src/components/Login.jsx` - Authentication
- `frontend/src/components/Dashboard.jsx` - User dashboard
- `frontend/src/components/CreateProject.jsx` - New project modal
- `frontend/src/components/ScriptInput.jsx` - Script editor
- `frontend/src/components/StoryboardViewer.jsx` - View results

### 🚀 Backend APIs
- `backend/ai_services/views.py` - AI generation endpoints
- `backend/storyboards/views.py` - Project CRUD
- `backend/storyboards/export_views.py` - Export functionality

### 🤖 AI Components
- `backend/ai_extraction/ai_image_generator.py` - Image generation
- `backend/ai_services/ai_generation.py` - Script processing

### 🗄️ Database
- `backend/storyboards/models.py` - Project & Storyboard models
- `backend/db.sqlite3` - SQLite database file
- `backend/storyboards/migrations/` - Schema migrations

## Running the Application

### Option 1: Quick Start (Recommended)
```bash
# Windows
start.bat

# macOS/Linux
./start.sh
```

### Option 2: Manual Start

**Backend:**
```bash
cd backend
python manage.py runserver
# Runs on http://127.0.0.1:8000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

## Common Development Tasks

### Add a new Django app
```bash
cd backend
python manage.py startapp app_name
```

### Create database migrations
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Install new Python package
```bash
cd backend
pip install package_name
pip freeze > django_requirements.txt
```

### Install new npm package
```bash
cd frontend
npm install package_name
```

### Run tests
```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

## API Base URLs

- **Backend API**: `http://127.0.0.1:8000/api/`
- **Frontend Dev**: `http://localhost:5173/`
- **Admin Panel**: `http://127.0.0.1:8000/admin/`

## Notes

- ✅ All Django files are now in `backend/` folder
- ✅ All React files remain in `frontend/` folder
- ✅ Virtual environment `.venv/` is in project root
- ✅ Database `db.sqlite3` is in `backend/` folder
- ✅ Start scripts updated to use new structure
- ✅ Both servers work independently

## Troubleshooting

**If backend won't start:**
```bash
cd backend
python manage.py check
python manage.py migrate
```

**If frontend won't start:**
```bash
cd frontend
npm install
npm run dev
```

**Database locked error:**
- Stop all Python processes
- Delete `backend/db.sqlite3` and re-run migrations
