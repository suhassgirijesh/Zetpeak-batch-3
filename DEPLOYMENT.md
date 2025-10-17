# 🚀 Deployment Guide

This guide covers deploying CiniKraft to production environments.

## Table of Contents
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Variables](#environment-variables)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Backend Deployment (Heroku)](#backend-deployment-heroku)
- [Alternative Platforms](#alternative-platforms)
- [Database Setup (Supabase)](#database-setup-supabase)
- [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass locally
- [ ] Environment variables configured
- [ ] Database schema is finalized
- [ ] API endpoints are tested
- [ ] CORS settings are correct
- [ ] Error handling is in place
- [ ] Sensitive data is not committed
- [ ] `.gitignore` is properly configured
- [ ] README is up to date

---

## Environment Variables

### Production Environment Variables

Create these in your deployment platforms:

**Frontend (Vercel/Netlify):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-backend-url.herokuapp.com
```

**Backend (Heroku/Railway):**
```env
HF_TOKEN=your-huggingface-token
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
DATABASE_URL=postgresql://... (if using PostgreSQL)
```

---

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard

1. **Create Vercel Account**
   - Go to https://vercel.com/signup
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL = https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY = your-anon-key
     VITE_API_URL = https://your-backend.herokuapp.com
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Access your site at `https://your-project.vercel.app`

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? (select your account)
# Link to existing project? No
# Project name? cini-storyboard
# Directory? ./
# Override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_API_URL production

# Deploy to production
vercel --prod
```

### Vercel Configuration

Create `vercel.json` in frontend directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Backend Deployment (Heroku)

### Prerequisites

- Heroku account (free tier available)
- Heroku CLI installed

### Step-by-Step

1. **Install Heroku CLI**
   ```bash
   # Download from: https://devcenter.heroku.com/articles/heroku-cli
   # Or use npm:
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   # From project root
   heroku create cini-storyboard-api
   ```

4. **Create Procfile**
   
   Create `Procfile` in project root:
   ```
   web: gunicorn cini_storyboard.wsgi --log-file -
   ```

5. **Install Gunicorn**
   
   Add to `requirements.txt`:
   ```
   gunicorn==21.2.0
   ```

6. **Update Django Settings**
   
   In `cini_storyboard/settings.py`:
   ```python
   import os
   import dj_database_url
   
   # SECURITY WARNING: keep the secret key used in production secret!
   SECRET_KEY = os.environ.get('SECRET_KEY', 'your-default-secret-key')
   
   # SECURITY WARNING: don't run with debug turned on in production!
   DEBUG = os.environ.get('DEBUG', 'False') == 'True'
   
   ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
   
   # CORS settings
   CORS_ALLOWED_ORIGINS = os.environ.get(
       'CORS_ALLOWED_ORIGINS',
       'http://localhost:5173'
   ).split(',')
   
   # Database (use PostgreSQL in production)
   if 'DATABASE_URL' in os.environ:
       DATABASES = {
           'default': dj_database_url.config(
               default=os.environ.get('DATABASE_URL')
           )
       }
   else:
       DATABASES = {
           'default': {
               'ENGINE': 'django.db.backends.sqlite3',
               'NAME': BASE_DIR / 'db.sqlite3',
           }
       }
   ```

7. **Install Additional Dependencies**
   
   Add to `requirements.txt`:
   ```
   dj-database-url==2.1.0
   psycopg2-binary==2.9.9
   whitenoise==6.6.0
   ```

8. **Configure Static Files**
   
   In `settings.py`:
   ```python
   # Static files
   STATIC_URL = '/static/'
   STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
   
   # Add whitenoise to middleware
   MIDDLEWARE = [
       'django.middleware.security.SecurityMiddleware',
       'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this
       # ... other middleware
   ]
   ```

9. **Set Environment Variables**
   ```bash
   heroku config:set SECRET_KEY="your-secret-key"
   heroku config:set DEBUG=False
   heroku config:set HF_TOKEN="your-hf-token"
   heroku config:set ALLOWED_HOSTS="your-app.herokuapp.com"
   heroku config:set CORS_ALLOWED_ORIGINS="https://your-frontend.vercel.app"
   ```

10. **Deploy to Heroku**
    ```bash
    git add .
    git commit -m "Prepare for Heroku deployment"
    git push heroku main
    
    # Run migrations
    heroku run python manage.py migrate
    
    # Create superuser (optional)
    heroku run python manage.py createsuperuser
    ```

11. **Open Your App**
    ```bash
    heroku open
    ```

### Heroku Add-ons

```bash
# Add PostgreSQL database (free tier)
heroku addons:create heroku-postgresql:mini

# Add Redis for caching (optional)
heroku addons:create heroku-redis:mini

# View logs
heroku logs --tail
```

---

## Alternative Platforms

### Railway.app (Recommended for Django)

1. **Sign up**: https://railway.app/
2. **New Project** → Deploy from GitHub
3. **Select repository**
4. **Add environment variables**
5. **Deploy automatically**

### Render.com

1. **Sign up**: https://render.com/
2. **New Web Service**
3. **Connect GitHub repository**
4. **Configure**:
   ```
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn cini_storyboard.wsgi:application
   ```
5. **Add environment variables**
6. **Create service**

### DigitalOcean App Platform

1. **Sign up**: https://www.digitalocean.com/
2. **Create App** → GitHub
3. **Select repository**
4. **Configure build settings**
5. **Add environment variables**
6. **Deploy**

### AWS Elastic Beanstalk

1. **Install EB CLI**:
   ```bash
   pip install awsebcli
   ```

2. **Initialize**:
   ```bash
   eb init -p python-3.10 cini-storyboard
   ```

3. **Create environment**:
   ```bash
   eb create production
   ```

4. **Deploy**:
   ```bash
   eb deploy
   ```

---

## Database Setup (Supabase)

### Production Database

1. **Upgrade to Pro Plan** (if needed)
   - More storage
   - Better performance
   - Custom domain

2. **Enable Row Level Security**
   ```sql
   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
   ALTER TABLE storyboards ENABLE ROW LEVEL SECURITY;
   
   -- Create policies for authenticated users
   CREATE POLICY "Users can view own projects" 
   ON projects FOR SELECT 
   USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can create own projects" 
   ON projects FOR INSERT 
   WITH CHECK (auth.uid() = user_id);
   ```

3. **Set up Backups**
   - Go to Settings → Database
   - Enable daily backups
   - Set retention period

4. **Connection Pooling**
   - Use connection pooler for better performance
   - Get pooler URL from Supabase dashboard

---

## Post-Deployment

### Testing Production

```bash
# Test frontend
curl https://your-app.vercel.app

# Test backend
curl https://your-api.herokuapp.com/api/projects/

# Test AI generation
curl -X POST https://your-api.herokuapp.com/api/generate/ \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A beautiful sunset"}'
```

### Monitoring

**Frontend (Vercel):**
- Analytics: https://vercel.com/dashboard/analytics
- Logs: https://vercel.com/dashboard/logs

**Backend (Heroku):**
```bash
# View logs
heroku logs --tail

# Monitor metrics
heroku ps
heroku pg:info
```

### Performance Optimization

1. **Enable Caching**
   ```python
   # In settings.py
   CACHES = {
       'default': {
           'BACKEND': 'django.core.cache.backends.redis.RedisCache',
           'LOCATION': os.environ.get('REDIS_URL'),
       }
   }
   ```

2. **CDN for Static Files**
   - Use Vercel Edge Network (automatic)
   - Or configure Cloudflare CDN

3. **Database Optimization**
   - Add indexes to frequently queried fields
   - Use connection pooling
   - Regular VACUUM on PostgreSQL

4. **Image Optimization**
   - Compress images before storage
   - Use WebP format
   - Implement lazy loading

### Security Checklist

- [ ] `DEBUG = False` in production
- [ ] Strong `SECRET_KEY` set
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection protection (Django ORM handles this)
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Secure cookies configured
- [ ] Environment variables protected

### Backup Strategy

```bash
# Backup Heroku PostgreSQL
heroku pg:backups:capture
heroku pg:backups:download

# Backup Supabase (automatic with Pro plan)
# Or manual export from dashboard
```

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "cini-storyboard-api"
          heroku_email: "your-email@example.com"
```

---

## Domain Configuration

### Custom Domain (Vercel)

1. Go to Settings → Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Custom Domain (Heroku)

```bash
# Add domain
heroku domains:add www.yourdomain.com

# Get DNS target
heroku domains

# Add DNS record:
# Type: CNAME
# Name: www
# Value: [DNS target from above]
```

---

## Troubleshooting

### Common Issues

**Issue**: Build fails on Vercel
- Check Node version in `package.json`
- Verify all dependencies are listed
- Check build logs for specific errors

**Issue**: Backend crashes on Heroku
- Check logs: `heroku logs --tail`
- Verify all environment variables are set
- Ensure `Procfile` is correct

**Issue**: CORS errors
- Verify CORS_ALLOWED_ORIGINS includes frontend URL
- Check protocol (http vs https)
- Ensure no trailing slashes

**Issue**: Database connection fails
- Check DATABASE_URL is set
- Verify database credentials
- Check connection limits

---

## Cost Estimation

### Free Tier (Starting)
- **Vercel**: Free (hobby plan)
- **Heroku**: Free (eco dynos)
- **Supabase**: Free (up to 500MB database)
- **Total**: $0/month

### Production (Recommended)
- **Vercel Pro**: $20/month
- **Heroku Standard**: $25/month
- **Supabase Pro**: $25/month
- **Total**: ~$70/month

### Enterprise
- Custom pricing based on usage
- Dedicated support
- SLA guarantees

---

## Support

Need help with deployment?

- 📖 Documentation: Read this guide thoroughly
- 💬 GitHub Discussions: Ask questions
- 🐛 Issues: Report deployment problems
- 📧 Email: support@cinikraft.com

---

**Good luck with your deployment!** 🚀
