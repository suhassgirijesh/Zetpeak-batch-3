# 🎬 CiniKraft - AI-Powered Storyboard Generator

> Transform your scripts into stunning visual storyboards with AI-powered image generation

A professional storyboard generation application that converts screenplays and scripts into visual storyboards using state-of-the-art AI technology. Built with React, Django, and Supabase.

![Storyboard Generator](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge&logo=artificial-intelligence)
![React](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react)
![Django](https://img.shields.io/badge/Django-4.2+-092E20?style=for-the-badge&logo=django)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![HuggingFace](https://img.shields.io/badge/🤗%20Hugging%20Face-AI-FFD21E?style=for-the-badge)

## ✨ Features

### 🤖 **AI-Powered Image Generation**
- **Multiple AI Providers**: Hugging Face SDXL-Lightning, OpenAI DALL-E, Stability AI, Replicate
- **Professional Quality**: Generate cinema-quality storyboard illustrations
- **Smart Fallbacks**: Automatic fallback to alternative providers or placeholders
- **Fast Processing**: 10-30 seconds per scene generation

### 📊 **Complete Project Management**
- **User Authentication**: Secure login/signup with Supabase Auth
- **Project CRUD**: Create, edit, delete, and organize projects
- **Persistent Storage**: All storyboards saved permanently in database
- **Multiple Storyboards**: Generate multiple versions per project

### 🎨 **Export & Sharing**
- **PDF Export**: High-quality PDF storyboard documents
- **PowerPoint Export**: Professional presentation slides
- **Shareable Links**: Direct URLs to view storyboards
- **Cross-Session Persistence**: Access your work from anywhere

### 🎯 **User Experience**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Professional dark UI design
- **Real-time Progress**: Visual feedback during generation
- **Error Handling**: Graceful error recovery and user feedback

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download](https://www.python.org/)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **Supabase Account** (free) - [Sign up](https://supabase.com/)

### Installation

Follow these steps to set up the project locally:

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Mukundan150/cini-storyboard-generator.git
cd cini-storyboard-generator
```

#### 2️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Go back to root
cd ..
```

#### 3️⃣ Backend Setup

```bash
# Install Python dependencies
pip install -r django_requirements.txt

# Or if using virtual environment (recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r django_requirements.txt
```

#### 4️⃣ Environment Configuration

**Frontend Environment (.env in frontend directory):**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend Environment (.env in root directory):**
```env
# Hugging Face API Token (Required for AI image generation)
HF_TOKEN=your_huggingface_token

# Optional: Other AI providers
OPENAI_API_KEY=your_openai_key
STABILITY_API_KEY=your_stability_key
```

> 📝 **Note**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed environment setup instructions

#### 5️⃣ Database Setup

1. Create a new project on [Supabase](https://supabase.com/)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the following schema:

```sql
-- Projects table
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    script TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storyboards table
CREATE TABLE storyboards (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    scenes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storyboards ENABLE ROW LEVEL SECURITY;
```

#### 6️⃣ Start the Application

**Terminal 1 - Backend (Django):**
```bash
# From project root
python manage.py migrate  # First time only
python manage.py runserver
```

**Terminal 2 - Frontend (React + Vite):**
```bash
cd frontend
npm run dev
```

#### 7️⃣ Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000
- **Django Admin**: http://127.0.0.1:8000/admin

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom responsive styling

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Python 3.8+** - Core programming language

### Database & Auth
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **JWT Authentication** - Secure user sessions

### AI & ML
- **Hugging Face Hub** - AI model inference
- **SDXL-Lightning** - Fast image generation model
- **OpenAI DALL-E** - Premium image generation
- **Stability AI** - High-quality AI images
- **Replicate** - Multi-model AI platform

### File Processing
- **ReportLab** - PDF generation
- **python-pptx** - PowerPoint creation
- **Pillow (PIL)** - Image processing

## 📖 Usage Guide

### 1. **Create Account**
- Sign up with email/password
- Secure authentication via Supabase

### 2. **Create Project**
- Click "Create New Project"
- Enter project title and description

### 3. **Write Script**
- Enter your script with scenes separated by new lines
- Example:
  ```
  A brave knight stands on a mountain peak
  The knight draws a magical glowing sword
  A fierce dragon emerges from the clouds
  Epic battle begins with fire and steel
  ```

### 4. **Select AI Provider**
- Choose from multiple AI providers
- Hugging Face (Recommended) for free usage
- OpenAI DALL-E for premium quality

### 5. **Generate Storyboard**
- Click "Generate Storyboard"
- Watch AI create professional illustrations
- Images are automatically saved to database

### 6. **Export & Share**
- Export as PDF or PowerPoint
- Share direct links to storyboards
- Access from any device, anytime

## 🎯 Project Structure

```
cini-storyboard-generator/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Auth.jsx       # Authentication
│   │   ├── Dashboard.jsx  # Project management
│   │   ├── CreateProject.jsx
│   │   ├── ScriptInput.jsx
│   │   ├── StoryboardViewer.jsx
│   │   └── ...
│   ├── services/          # API integration
│   │   └── database.js    # Supabase client
│   └── assets/            # Images and icons
├── backend/
│   ├── app.py            # Flask API server
│   └── requirements.txt  # Python dependencies
├── database/
│   └── schema.sql        # Database structure
├── .env                  # Environment variables
└── package.json          # Node.js dependencies
```

## 🔧 API Documentation

### Core Endpoints

#### **POST** `/generate_storyboard`
Generate AI storyboard from script
```json
{
  "script": "Scene descriptions separated by newlines",
  "ai_provider": "huggingface"
}
```

#### **GET** `/export_pdf?storyboard_id={id}`
Download storyboard as PDF

#### **GET** `/export_pptx?storyboard_id={id}`
Download storyboard as PowerPoint

#### **GET** `/storyboard/{id}`
Retrieve storyboard by ID

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `HF_TOKEN` | Hugging Face API token | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | ⚪ |
| `STABILITY_API_KEY` | Stability AI key | ⚪ |

## 🚀 Deployment

### Option 1: Vercel + Railway
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway
- **Database**: Supabase (already cloud-hosted)

### Option 2: Docker
```dockerfile
# Build with Docker
docker build -t cini-storyboard .
docker run -p 3000:3000 -p 5000:5000 cini-storyboard
```

### Option 3: Traditional Hosting
- **Frontend**: Build with `npm run build`
- **Backend**: Deploy django app to your server
- **Environment**: Set production environment variables

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open Pull Request**

### Development Guidelines
- Follow React best practices
- Write clean, documented code
- Test AI integrations thoroughly
- Ensure mobile responsiveness

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face** for providing excellent AI models
- **Supabase** for seamless backend services
- **React Team** for the amazing framework
- **OpenAI** for DALL-E integration
- **Stability AI** for Stable Diffusion models

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/yourusername/cini-storyboard-generator/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/cini-storyboard-generator/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/cini-storyboard-generator/wiki)

## 📊 Features Roadmap

- [ ] **Video Storyboards** - Generate video previews
- [ ] **Collaborative Editing** - Team storyboard creation
- [ ] **Template Library** - Pre-built storyboard templates
- [ ] **Advanced AI Controls** - Style customization
- [ ] **Mobile App** - React Native version
- [ ] **API Marketplace** - Public API for developers

---

**Built with ❤️ for creators, filmmakers, and storytellers worldwide**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/cini-storyboard-generator?style=social)](https://github.com/yourusername/cini-storyboard-generator/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/cini-storyboard-generator?style=social)](https://github.com/yourusername/cini-storyboard-generator/network/members)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/cini-storyboard-generator)](https://github.com/yourusername/cini-storyboard-generator/issues)
