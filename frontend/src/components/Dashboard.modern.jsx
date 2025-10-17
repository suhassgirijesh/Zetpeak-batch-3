import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import djangoApiService from "../services/djangoApi.js";
import "./Dashboard.modern.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projectStoryboards, setProjectStoryboards] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data: dbProjects, error } = await djangoApiService.getProjects();
      if (error) {
        throw new Error(error);
      }
      setProjects(dbProjects || []);
      setFilteredProjects(dbProjects || []);
      setProjectStoryboards({});
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId, projectTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    try {
      const { error } = await djangoApiService.deleteProject(projectId);
      if (error) {
        throw new Error(error);
      }
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const SkeletonCard = () => (
    <div className="project-card skeleton-card">
      <div className="skeleton skeleton-img"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-button"></div>
    </div>
  );

  if (loading) {
    return (
      <main className="dashboard-modern">
        <div className="dashboard-header-modern">
          <div>
            <h2 className="dashboard-title-modern animate-slide-up">My Projects</h2>
            <p className="dashboard-subtitle-modern animate-slide-up">Manage and organize your storyboard projects</p>
          </div>
        </div>
        <div className={`dashboard-grid-modern ${viewMode}`}>
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-modern">
        <div className="dashboard-error-modern glass-effect">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={loadProjects} className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-modern">
      <div className="dashboard-header-modern animate-slide-up">
        <div>
          <h2 className="dashboard-title-modern">My Projects</h2>
          <p className="dashboard-subtitle-modern">Manage and organize your storyboard projects</p>
        </div>
        <Link to="/create" className="btn btn-primary btn-create hover-glow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Project
        </Link>
      </div>

      {projects.length > 0 && (
        <div className="dashboard-toolbar animate-fade-in">
          <div className="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery("")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className={`dashboard-grid-modern ${viewMode}`}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div
              className="project-card-modern hover-lift animate-scale-in"
              key={project.id}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="project-card-header-modern">
                <div className="project-card-thumbnail">
                  <div className="thumbnail-gradient"></div>
                  <div className="thumbnail-icon">🎬</div>
                </div>
                <button
                  className="project-delete-btn"
                  onClick={() => handleDeleteProject(project.id, project.title)}
                  title="Delete Project"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="project-card-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-date">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {new Date(project.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>

                {projectStoryboards[project.id] && projectStoryboards[project.id].length > 0 && (
                  <div className="project-storyboards-modern">
                    <span className="storyboard-count">
                      📋 {projectStoryboards[project.id].length} storyboard{projectStoryboards[project.id].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                <div className="project-actions">
                  <Link to={`/script/${project.id}`} className="btn btn-secondary btn-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </Link>
                  <button className="btn btn-secondary btn-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Export
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="dashboard-empty-modern">
            <div className="empty-icon">📁</div>
            <h3>No projects found</h3>
            <p>{searchQuery ? 'Try a different search term' : 'Create your first project to get started'}</p>
            {!searchQuery && (
              <Link to="/create" className="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Create Your First Project
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
