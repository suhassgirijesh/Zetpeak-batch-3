import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.modern.css";
import { supabase } from "../supabaseClient";
import djangoApiService from "../services/djangoApi";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const isAuthenticated = !!localStorage.getItem("token");
  // Consider authenticated if we have a server-side current user
  const showAuthenticated = isAuthenticated || !!currentUser;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch current user data (attempt regardless of local token so UI can show server-side user)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await djangoApiService.getCurrentUser();
        console.log('Header: getCurrentUser response', { data, error });
        if (data && !error) {
          setCurrentUser(data);
        } else if (error) {
          // keep currentUser null but log for debugging
          console.warn('Header: getCurrentUser error', error);
        }
      } catch (err) {
        console.error('Header: failed to fetch current user', err);
      }
    };

    fetchUser();
  }, []);

  // Don't show the header on the landing, login, or signup pages
  if (["/", "/login", "/signup"].includes(location.pathname)) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`header-modern ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/dashboard" className="header-logo-modern">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" stroke="url(#gradient1)" strokeWidth="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="url(#gradient1)" strokeWidth="2"/>
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">CiniKraft</span>
        </Link>

        <nav className="header-nav-modern">
          {showAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link-modern ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                Dashboard
              </Link>
              <Link 
                to="/create" 
                className={`nav-link-modern ${isActive('/create') ? 'active' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Project
              </Link>

              <div className="header-user-menu">
                <button className="user-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <div className="user-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="chevron">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="user-dropdown glass-effect">
                    <div className="dropdown-header">
                      <div className="user-info">
                        <div className="user-name">{currentUser?.username || 'User Account'}</div>
                        <div className="user-email">{currentUser?.email || 'user@example.com'}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Profile Settings
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="mobile-menu glass-effect">
          <Link to="/dashboard" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </Link>
          <Link to="/create" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Project
          </Link>
          <div className="mobile-menu-divider"></div>
          <button className="mobile-menu-item" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
