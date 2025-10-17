import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import djangoApiService from "../services/djangoApi.js";
import "./ProjectDetail.css";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [storyboards, setStoryboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjectData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load project details
      const { data: projectData, error: projectError } = await djangoApiService.getProject(projectId);
      
      if (projectError) {
        throw new Error(projectError);
      }
      
      setProject(projectData);
      
      // Load all storyboards for this project
      const { data: allStoryboards, error: storyboardsError } = await djangoApiService.getStoryboards();
      
      console.log('📊 All storyboards loaded:', allStoryboards?.length || 0);
      
      if (!storyboardsError && allStoryboards) {
        // Filter storyboards that belong to this project
        // Note: project can be either a UUID string or an object with an 'id' property
        const projectStoryboards = allStoryboards.filter(sb => {
          const sbProjectId = typeof sb.project === 'object' ? sb.project?.id : sb.project;
          console.log('🔍 Checking storyboard:', {
            storyboardId: sb.id,
            projectType: typeof sb.project,
            projectId: sbProjectId,
            matches: sbProjectId && sbProjectId.toString() === projectId
          });
          return sbProjectId && sbProjectId.toString() === projectId;
        });
        
        console.log('✅ Filtered storyboards for this project:', projectStoryboards.length);
        console.log('🖼️  Storyboards with images:', 
          projectStoryboards.filter(sb => sb.scenes?.[0]?.image).length
        );
        
        setStoryboards(projectStoryboards);
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  const handleDeleteStoryboard = async (storyboardId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this storyboard?')) {
      return;
    }
    
    try {
      // Note: You'll need to add a deleteStoryboard method to djangoApiService
      const response = await fetch(`http://127.0.0.1:8000/api/storyboards/${storyboardId}/`, {
        method: 'DELETE',
      });
      
      if (response.ok || response.status === 204) {
        setStoryboards(storyboards.filter(sb => sb.id !== storyboardId));
      } else {
        alert('Failed to delete storyboard');
      }
    } catch (error) {
      console.error('Error deleting storyboard:', error);
      alert('Failed to delete storyboard');
    }
  };

  if (loading) {
    return (
      <main className="project-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading project...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="project-detail-page">
        <div className="error-container glass-effect">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3>Error</h3>
          <p>{error}</p>
          <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="project-detail-page">
      {/* Header */}
      <div className="project-detail-header glass-effect">
        <Link to="/dashboard" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </Link>
        
        <div className="project-header-content">
          <h1 className="project-title gradient-text">{project?.title || 'Untitled Project'}</h1>
          {project?.description && (
            <p className="project-description">{project.description}</p>
          )}
          <div className="project-meta">
            <span className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Created {new Date(project?.created_at).toLocaleDateString()}
            </span>
            <span className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              {storyboards.length} Storyboard{storyboards.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="project-actions">
          <Link 
            to={`/script/${projectId}`} 
            state={{ title: project?.title }}
            className="btn btn-primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create New Storyboard
          </Link>
        </div>
      </div>

      {/* Project Script */}
      {project?.script && (
        <div className="project-script-section glass-effect">
          <h2 className="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Project Script
          </h2>
          <div className="script-content">
            <pre>{project.script}</pre>
          </div>
          <Link 
            to={`/script/${projectId}`} 
            state={{ title: project?.title }}
            className="btn btn-outline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Script
          </Link>
        </div>
      )}

      {/* Storyboards Grid */}
      <div className="storyboards-section">
        <h2 className="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          Saved Storyboards ({storyboards.length})
        </h2>

        {storyboards.length === 0 ? (
          <div className="empty-state glass-effect">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
            </svg>
            <h3>No Storyboards Yet</h3>
            <p>Create your first storyboard by adding a script and generating images</p>
            <Link 
              to={`/script/${projectId}`} 
              state={{ title: project?.title }}
              className="btn btn-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create Storyboard
            </Link>
          </div>
        ) : (
          <div className="storyboards-grid">
            {storyboards.map((storyboard) => (
              <div 
                key={storyboard.id} 
                className="storyboard-card glass-effect"
                onClick={() => navigate(`/storyboard/${storyboard.id}`)}
              >
                <div className="storyboard-card-header">
                  <div className="storyboard-preview">
                    {storyboard.scenes && storyboard.scenes.length > 0 && storyboard.scenes[0].image ? (
                      <img 
                        src={`data:image/png;base64,${storyboard.scenes[0].image}`}
                        alt="First scene"
                        className="preview-image"
                      />
                    ) : (
                      <div className="preview-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <button 
                    className="delete-storyboard-btn"
                    onClick={(e) => handleDeleteStoryboard(storyboard.id, e)}
                    title="Delete Storyboard"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>

                <div className="storyboard-card-body">
                  <div className="storyboard-info">
                    <span className="storyboard-scenes">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      {storyboard.scenes?.length || 0} scenes
                    </span>
                    <span className="storyboard-provider">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6"/>
                      </svg>
                      {storyboard.ai_provider || 'AI'}
                    </span>
                  </div>
                  <div className="storyboard-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {new Date(storyboard.created_at).toLocaleDateString()}
                  </div>
                  <div className="storyboard-status">
                    <span className={`status-badge ${storyboard.status}`}>
                      {storyboard.status}
                    </span>
                  </div>
                </div>

                <div className="storyboard-card-footer">
                  <button className="btn btn-primary btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    View Storyboard
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
