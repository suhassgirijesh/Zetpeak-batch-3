# CiniKraft Backend (Django)

This folder contains the Django backend for the CiniKraft storyboard generation application.

## Structure

```
backend/
├── cini_storyboard/     # Django project settings
├── ai_services/         # AI generation REST API endpoints
├── storyboards/         # Storyboard models and API
├── ai_extraction/       # AI image generation utilities
├── manage.py            # Django management script
├── db.sqlite3          # SQLite database
└── django_requirements.txt  # Python dependencies
```

## Setup

1. Create a virtual environment:
```bash
python -m venv .venv
.venv\Scripts\activate  # On Windows
```

2. Install dependencies:
```bash
pip install -r django_requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create superuser:
```bash
python manage.py createsuperuser
# OR use the automated script:
python create_superuser.py
```

5. Start the development server:
```bash
python manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000/`

## API Endpoints

- `/api/storyboards/` - Storyboard CRUD operations
- `/api/ai/generate` - AI storyboard generation
- `/admin/` - Django admin panel

## Environment Variables

Create a `.env` file in the root directory with:
```
SECRET_KEY=your-secret-key
DEBUG=True
OPENAI_API_KEY=your-openai-key
```

## Testing

```bash
python manage.py test
```
