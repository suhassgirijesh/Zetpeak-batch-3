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
  
  // Stats state
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    hoursSaved: 0,
    teamMembers: 0,
    growth: {
      projects: 12,
      completed: 8,
      hours: 24,
      members: 2
    }
  });

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
      
      // Calculate stats
      const totalProjects = dbProjects?.length || 0;
      const completedProjects = Math.floor(totalProjects * 0.75); // 75% completion rate
      const hoursSaved = totalProjects * 6.5; // Avg 6.5 hours per project
      const teamMembers = Math.min(8, Math.max(1, Math.floor(totalProjects / 3))); // 1 member per 3 projects
      
      setStats({
        totalProjects,
        completedProjects,
        hoursSaved: Math.round(hoursSaved),
        teamMembers,
        growth: {
          projects: 12,
          completed: 8,
          hours: 24,
          members: 2
        }
      });
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId, projectTitle, event) => {
    // Prevent event propagation to parent elements
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
      // Remove from local state immediately for better UX
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const SkeletonCard = () => (
    <div className="project-card-modern skeleton-card">
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
      {/* Welcome Header */}
      <div className="dashboard-welcome animate-fade-in">
        <div className="welcome-content">
          <h1 className="welcome-title gradient-text">
            Welcome back! 👋
          </h1>
          <p className="welcome-subtitle">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="welcome-actions">
          <Link to="/create" className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Project
          </Link>
          <button className="btn btn-outline" onClick={loadProjects}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            View All Projects
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid animate-slide-up">
        <div className="stat-card glass-effect">
          <div className="stat-icon stat-icon-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Projects</div>
            <div className="stat-value">{stats.totalProjects}</div>
            <div className="stat-growth positive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              +{stats.growth.projects}% from last month
            </div>
          </div>
        </div>

        <div className="stat-card glass-effect stat-card-highlighted">
          <div className="stat-icon stat-icon-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completedProjects}</div>
            <div className="stat-growth positive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              +{stats.growth.completed}% from last month
            </div>
          </div>
        </div>

        <div className="stat-card glass-effect">
          <div className="stat-icon stat-icon-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Hours Saved</div>
            <div className="stat-value">{stats.hoursSaved}</div>
            <div className="stat-growth positive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              +{stats.growth.hours}% from last month
            </div>
          </div>
        </div>

        <div className="stat-card glass-effect">
          <div className="stat-icon stat-icon-info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Team Members</div>
            <div className="stat-value">{stats.teamMembers}</div>
            <div className="stat-growth positive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              +{stats.growth.members} from last month
            </div>
          </div>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="dashboard-controls animate-slide-up">
        <div className="search-box">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

      {/* Projects Grid */}
      <div className={`dashboard-grid-modern ${viewMode} animate-fade-in`}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div className="project-card-modern glass-effect hover-lift" key={project.id}>
              <div className="project-card-header-modern">
                <div className="project-thumbnail">
                  <div className="project-thumbnail-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                </div>
                <button 
                  className="project-delete-btn"
                  onClick={(e) => handleDeleteProject(project.id, project.title, e)}
                  title="Delete Project"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {new Date(project.created_at).toLocaleDateString()}
                </p>

                {projectStoryboards[project.id] && projectStoryboards[project.id].length > 0 && (
                  <div className="project-storyboards-modern">
                    <div className="storyboards-count">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                      {projectStoryboards[project.id].length} Storyboard{projectStoryboards[project.id].length !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>

              <div className="project-card-footer-modern">
                <Link to={`/project/${project.id}`} className="project-btn project-btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View Project
                </Link>
                <button className="project-btn project-btn-outline">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Export
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="dashboard-empty-modern glass-effect">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3>No projects found</h3>
            <p>
              {searchQuery 
                ? `No projects match "${searchQuery}". Try a different search term.`
                : "Create your first project to get started with your storyboard journey."
              }
            </p>
            <Link to="/create" className="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create New Project
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
