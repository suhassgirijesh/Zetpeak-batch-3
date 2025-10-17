import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import djangoApiService from '../services/djangoApi.js';
import './CreateProject.modern.css';

export default function CreateProject() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data: project, error } = await djangoApiService.createProject({ title });
      
      if (error) throw new Error(error);
      
      navigate(`/script/${project.id}`, { state: { title: project.title } });
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-modern">
      <div className="create-container">
        <Link to="/dashboard" className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </Link>

        <div className="create-content glass-effect animate-slide-up">
          <div className="create-header">
            <div className="create-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <h2 className="create-title">Create New Project</h2>
            <p className="create-subtitle">Start by giving your storyboard project a memorable name</p>
          </div>

          <form className="create-form-modern" onSubmit={handleSubmit}>
            {error && (
              <div className="form-error animate-slide-up">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Project Title <span className="required">*</span>
              </label>
              <input 
                type="text"
                className="form-input" 
                placeholder="e.g., My Epic Short Film" 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                autoFocus
              />
              <p className="form-hint">Choose a descriptive name for your project</p>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary hover-glow"
                disabled={loading || !title.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    Continue to Script
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
