import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import djangoApiService from '../services/djangoApi.js';
import './Dashboard.modern.css';
import './AllProjects.css';

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projectStoryboards, setProjectStoryboards] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = [...projects];
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setFilteredProjects(filtered);
  }, [searchQuery, projects, sortBy]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data: dbProjects, error } = await djangoApiService.getProjects();
      if (error) {
        throw new Error(error);
      }
      console.log('📁 All Projects loaded:', dbProjects);
      setProjects(dbProjects || []);
      setFilteredProjects(dbProjects || []);
      
      // Load storyboards for each project to get thumbnails
      const storyboardsMap = {};
      if (dbProjects && dbProjects.length > 0) {
        const { data: allStoryboards } = await djangoApiService.getStoryboards();
        console.log('🎬 All storyboards:', allStoryboards);
        if (allStoryboards) {
          // Group storyboards by project_id
          allStoryboards.forEach(storyboard => {
            // The API returns nested project object, so we need to access storyboard.project.id
            const projectId = typeof storyboard.project === 'object' ? storyboard.project.id : storyboard.project;
            if (!storyboardsMap[projectId]) {
              storyboardsMap[projectId] = [];
            }
            storyboardsMap[projectId].push(storyboard);
          });
          console.log('🗂️ Storyboards map:', storyboardsMap);
        }
      }
      setProjectStoryboards(storyboardsMap);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId, projectTitle, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
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

  const clearSearch = () => {
    setSearchQuery('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const SkeletonCard = () => (
    <div className="project-card-modern skeleton-card">
      <div className="skeleton skeleton-img"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-button"></div>
    </div>
  );

  if (error) {
    return (
      <main className="all-projects-modern">
        <div className="all-projects-bg-animated">
          <div className="all-projects-orb all-projects-orb-1"></div>
          <div className="all-projects-orb all-projects-orb-2"></div>
          <div className="all-projects-orb all-projects-orb-3"></div>
        </div>
        
        <div className="all-projects-container">
          <div className="dashboard-error-modern">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3>Unable to Load Projects</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadProjects}>
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="all-projects-modern">
      {/* Animated Background Orbs */}
      <div className="all-projects-bg-animated">
        <div className="all-projects-orb all-projects-orb-1"></div>
        <div className="all-projects-orb all-projects-orb-2"></div>
        <div className="all-projects-orb all-projects-orb-3"></div>
        <div className="all-projects-orb all-projects-orb-4"></div>
      </div>

      <div className="all-projects-container">
        {/* Header */}
        <div className="all-projects-header animate-slide-up">
          <div className="header-content">
            <Link to="/dashboard" className="back-button btn-glow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Dashboard
            </Link>
            
            <div className="header-title-section">
              <div className="header-icon-badge">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <h1 className="page-title text-glow">All Projects</h1>
                <p className="page-subtitle">
                  Manage and explore all your storyboard projects in one place
                </p>
              </div>
            </div>

            <Link to="/create" className="btn btn-primary btn-glow btn-large">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Project
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="projects-stats-bar glass-effect animate-fade-in">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{projects.length}</span>
                <span className="stat-label">Total Projects</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{filteredProjects.length}</span>
                <span className="stat-label">Showing</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{projects.length > 0 ? formatDate(projects[0].created_at) : 'N/A'}</span>
                <span className="stat-label">Latest</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="dashboard-toolbar animate-fade-in">
          <div className="search-box">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              type="text"
              className="search-input"
              placeholder="Search projects by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={clearSearch}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          <div className="toolbar-actions">
            {/* Sort Dropdown */}
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>

            {/* View Toggle */}
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button 
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List View"
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
        </div>

        {/* Projects Grid */}
        <div className={`dashboard-grid-modern ${viewMode} animate-fade-in`}>
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div className="project-card-modern glass-effect hover-lift" key={project.id}>
                <div className="project-card-header-modern">
                  <div className="project-thumbnail">
                    {projectStoryboards[project.id] && 
                     projectStoryboards[project.id].length > 0 && 
                     projectStoryboards[project.id][0].scenes && 
                     projectStoryboards[project.id][0].scenes.length > 0 && 
                     projectStoryboards[project.id][0].scenes[0].image ? (
                      <img 
                        src={`data:image/png;base64,${projectStoryboards[project.id][0].scenes[0].image}`}
                        alt={`${project.title} thumbnail`}
                        className="project-thumbnail-image"
                      />
                    ) : (
                      <div className="project-thumbnail-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <button 
                    className="project-delete-btn"
                    onClick={(e) => handleDeleteProject(project.id, project.title, e)}
                    title="Delete Project"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>

                <div className="project-card-body-modern">
                  <h3 className="project-title-modern">{project.title}</h3>
                  <p className="project-date-modern">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Created {formatDate(project.created_at)}
                  </p>
                  <div className="project-storyboards-modern">
                    <div className="storyboards-count">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                        <polyline points="17 2 12 7 7 2"/>
                      </svg>
                      {projectStoryboards[project.id]?.length || 0} Storyboard{projectStoryboards[project.id]?.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="project-card-footer-modern">
                  <Link 
                    to={`/project/${project.id}`} 
                    className="project-btn project-btn-primary"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    View Details
                  </Link>
                  <Link 
                    to={`/script/${project.id}`}
                    className="project-btn project-btn-outline"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Script
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="dashboard-empty-modern">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <h3>{searchQuery ? 'No Projects Found' : 'No Projects Yet'}</h3>
              <p>
                {searchQuery 
                  ? `No projects match "${searchQuery}". Try a different search term.`
                  : 'Get started by creating your first storyboard project.'
                }
              </p>
              {!searchQuery && (
                <Link to="/create" className="btn btn-primary btn-glow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Create Your First Project
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
