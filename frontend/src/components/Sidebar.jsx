import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  // Don't show the sidebar on landing, login, or signup pages
  const hideSidebar = ["/", "/login", "/signup"].includes(location.pathname);

  useEffect(() => {
    // Add or remove body class based on sidebar visibility
    if (hideSidebar) {
      document.body.classList.add('no-sidebar');
    } else {
      document.body.classList.remove('no-sidebar');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('no-sidebar');
    };
  }, [hideSidebar]);

  if (hideSidebar) {
    return null;
  }

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar-modern">
      <div className="sidebar-container">
        {/* Logo */}
        <Link to="/dashboard" className="sidebar-logo">
          <div className="logo-circle">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="url(#logoGradient)" />
              <text 
                x="20" 
                y="20" 
                textAnchor="middle" 
                dominantBaseline="central"
                fill="white"
                fontSize="22"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                C
              </text>
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">CiniKraft</span>
        </Link>

        {/* Main Title */}
        <div className="sidebar-title">Dashboard</div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={`sidebar-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <div className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span>Overview</span>
          </Link>

          <Link 
            to="/create" 
            className={`sidebar-nav-item ${isActive('/create') ? 'active' : ''}`}
          >
            <div className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <span>New Project</span>
          </Link>

          <Link 
            to="/projects" 
            className={`sidebar-nav-item ${isActive('/projects') ? 'active' : ''}`}
          >
            <div className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <span>All Projects</span>
          </Link>

          <Link 
            to="/profile" 
            className={`sidebar-nav-item ${isActive('/profile') ? 'active' : ''}`}
          >
            <div className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span>Profile</span>
          </Link>

          <Link 
            to="/dashboard" 
            className="sidebar-nav-item"
          >
            <div className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m5.66-13.66l-4.24 4.24m0 4.24l4.24 4.24M23 12h-6m-6 0H1m18.66 5.66l-4.24-4.24m0-4.24l-4.24-4.24"/>
              </svg>
            </div>
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
