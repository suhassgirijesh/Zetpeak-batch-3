# 🤝 Contributing to CiniKraft

Thank you for your interest in contributing to CiniKraft! We welcome contributions from everyone.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment.

### Our Standards

**Positive behaviors:**
- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints
- ✅ Gracefully accepting constructive criticism
- ✅ Focusing on what is best for the community

**Unacceptable behaviors:**
- ❌ Trolling, insulting/derogatory comments
- ❌ Public or private harassment
- ❌ Publishing others' private information
- ❌ Other unprofessional conduct

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** - Describe the issue in one sentence
- **Steps to reproduce** - List the exact steps
- **Expected behavior** - What should happen
- **Actual behavior** - What actually happens
- **Screenshots** - If applicable
- **Environment** - OS, Node version, Python version, browser

**Example:**
```markdown
**Bug**: Images don't load in storyboard viewer

**Steps to Reproduce:**
1. Create a new project
2. Generate storyboard
3. Open storyboard viewer

**Expected**: Images should display
**Actual**: Broken image icons appear

**Environment:**
- OS: Windows 11
- Browser: Chrome 120
- Node: v18.17.0
```

### 💡 Suggesting Features

Feature suggestions are welcome! Please include:

- **Use case** - Why is this needed?
- **Proposed solution** - How should it work?
- **Alternatives** - Other approaches considered?
- **Additional context** - Screenshots, mockups, examples

### 🔧 Code Contributions

We accept pull requests for:

- **Bug fixes** - Fix existing issues
- **New features** - Add new functionality
- **Documentation** - Improve docs
- **Performance** - Optimize code
- **Tests** - Add test coverage
- **UI/UX** - Improve user experience

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR-USERNAME/cini-storyboard-generator.git
cd cini-storyboard-generator

# Add upstream remote
git remote add upstream https://github.com/Mukundan150/cini-storyboard-generator.git
```

### 2. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-number-description
```

### 3. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ..
pip install -r django_requirements.txt
```

### 4. Set Up Environment

```bash
# Copy example files
cp .env.example .env
cp frontend/.env.example frontend/.env

# Edit .env files with your credentials
```

### 5. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments where necessary
- Update documentation if needed

### 6. Test Your Changes

```bash
# Test frontend
cd frontend
npm run dev

# Test backend
python manage.py runserver

# Run tests (if available)
npm test
python manage.py test
```

---

## Pull Request Process

### Before Submitting

- ✅ Test your changes thoroughly
- ✅ Update README if needed
- ✅ Add/update comments
- ✅ Follow coding standards
- ✅ Commit with clear messages
- ✅ Rebase on latest main

### Submitting PR

1. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request** on GitHub

3. **Fill in PR template**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement
   
   ## How Has This Been Tested?
   Describe testing done
   
   ## Screenshots (if applicable)
   Add screenshots
   
   ## Checklist
   - [ ] Code follows project style
   - [ ] Self-review completed
   - [ ] Comments added where needed
   - [ ] Documentation updated
   - [ ] No new warnings
   - [ ] Tests added/updated
   ```

### Review Process

- Maintainers will review your PR
- Address feedback if requested
- Once approved, PR will be merged
- You'll be credited as a contributor! 🎉

---

## Coding Standards

### JavaScript/React

```javascript
// ✅ Good
const handleSubmit = async (event) => {
  event.preventDefault();
  
  try {
    const result = await apiCall();
    setData(result);
  } catch (error) {
    console.error('Error:', error);
  }
};

// ❌ Avoid
function submit(e){
  e.preventDefault()
  apiCall().then(r=>setData(r)).catch(e=>console.log(e))
}
```

**Guidelines:**
- Use functional components with hooks
- Use `const` for variables that don't change
- Use arrow functions for handlers
- Add PropTypes or TypeScript types
- Use meaningful variable names
- Keep components under 200 lines
- Extract reusable logic into hooks

### Python/Django

```python
# ✅ Good
def generate_storyboard(script: str) -> list:
    """
    Generate storyboard scenes from script.
    
    Args:
        script: The input script text
        
    Returns:
        List of scene dictionaries
    """
    scenes = []
    # Implementation
    return scenes

# ❌ Avoid
def gen(s):
    sc=[]
    # Implementation
    return sc
```

**Guidelines:**
- Follow PEP 8 style guide
- Use type hints
- Add docstrings to functions
- Use snake_case for variables
- Keep functions focused and small
- Handle exceptions properly

### CSS

```css
/* ✅ Good */
.button-primary {
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.button-primary:hover {
  transform: translateY(-2px);
}

/* ❌ Avoid */
.btn{padding:10px;background:#6366F1}
```

**Guidelines:**
- Use kebab-case for class names
- Use CSS variables for colors
- Group related properties
- Add transitions for animations
- Use rem/em instead of px
- Mobile-first responsive design

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Formatting (no code change)
- **refactor**: Code change (no feat/fix)
- **perf**: Performance improvement
- **test**: Adding tests
- **chore**: Maintenance

### Examples

```bash
# Good commits
git commit -m "feat(dashboard): add project stats cards"
git commit -m "fix(api): resolve CORS error in production"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(css): format dashboard styles"
git commit -m "refactor(auth): simplify login logic"
git commit -m "perf(images): optimize image loading"
git commit -m "test(api): add unit tests for projects endpoint"
git commit -m "chore(deps): update dependencies"

# Bad commits (avoid)
git commit -m "fixed stuff"
git commit -m "wip"
git commit -m "changes"
git commit -m "update"
```

---

## Project Structure

Understanding the codebase:

```
cini-storyboard-generator/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app component
│   └── package.json
├── ai_services/             # AI generation service
│   ├── ai_generation.py     # AI logic
│   └── views.py            # API endpoints
├── storyboards/            # Storyboard management
│   ├── models.py           # Database models
│   ├── views.py            # API views
│   └── serializers.py      # DRF serializers
├── cini_storyboard/        # Django settings
│   └── settings.py
└── manage.py               # Django CLI
```

---

## Need Help?

- 📖 **Read the docs**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- 💬 **Ask questions**: Open a GitHub Discussion
- 🐛 **Report bugs**: Create an Issue
- 📧 **Contact**: support@cinikraft.com

---

## Recognition

Contributors will be:
- ✨ Listed in README
- 🏆 Credited in release notes
- 🎖️ Given GitHub contributor badge

**Thank you for contributing!** 🎉

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).
