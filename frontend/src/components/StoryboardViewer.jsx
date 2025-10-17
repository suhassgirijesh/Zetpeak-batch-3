import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import djangoApiService from "../services/djangoApi.js";
import { exportStoryboardToPDF, exportStoryboardImages } from "../utils/exportUtils.js";
import "./StoryboardViewer.modern.css";

export default function StoryboardViewer() {
  const location = useLocation();
  const { storyboardId } = useParams();
  const [storyboardData, setStoryboardData] = useState(location.state?.storyboardData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // UI State
  const [viewMode, setViewMode] = useState("grid"); // grid, list, timeline
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedScene, setSelectedScene] = useState(null); // For lightbox
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // If we don't have storyboard data but have an ID, try to load from database
    const loadStoryboardFromDatabase = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load from Django backend
        const { data: dbStoryboard, error: dbError } = await djangoApiService.getStoryboard(storyboardId);
        
        if (dbError) {
          throw new Error(dbError);
        }
        
        if (dbStoryboard && dbStoryboard.scenes) {
          setStoryboardData({
            scenes: dbStoryboard.scenes,
            storyboard_id: dbStoryboard.id,
            project_title: dbStoryboard.project?.title || 'Untitled Project',
            ai_provider: dbStoryboard.ai_provider,
            created_at: dbStoryboard.created_at
          });
        } else {
          setError('Storyboard not found or has no scenes');
        }
      } catch (error) {
        console.error('Error loading storyboard:', error);
        setError(`Failed to load storyboard: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (!storyboardData && storyboardId) {
      loadStoryboardFromDatabase();
    }
  }, [storyboardId, storyboardData]);

  if (loading) {
    return (
      <main className="storyboard-main">
        <Link to="/dashboard" className="back-link">
          &lt; Back to Dashboard
        </Link>
        <h2 className="storyboard-title">Loading Storyboard...</h2>
        <div className="loading-spinner">🔄 Loading your storyboard...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="storyboard-main">
        <Link to="/dashboard" className="back-link">
          &lt; Back to Dashboard
        </Link>
        <h2 className="storyboard-title">Storyboard Not Found</h2>
        <p>{error}</p>
        <p>Please create a new project or check the storyboard ID.</p>
      </main>
    );
  }

  if (!storyboardData || !storyboardData.scenes) {
    return (
      <main className="storyboard-main-modern">
        <div className="error-container glass-effect animate-fade-in">
          <div className="error-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2>Storyboard Not Found</h2>
          <p>Could not find the storyboard data. Please create a new project first.</p>
          <Link to="/dashboard" className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { scenes } = storyboardData;

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Lightbox controls
  const openLightbox = (index) => setSelectedScene(index);
  const closeLightbox = () => setSelectedScene(null);
  const nextScene = () => setSelectedScene(prev => (prev + 1) % scenes.length);
  const prevScene = () => setSelectedScene(prev => (prev - 1 + scenes.length) % scenes.length);

  // Export functions
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const result = await exportStoryboardToPDF(
        scenes, 
        storyboardData.project_title || 'Storyboard'
      );
      
      if (result.success) {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'export-notification success';
        notification.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div>
            <strong>PDF exported successfully!</strong>
            <p>${result.fileName}</p>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
      } else {
        alert(`❌ Failed to export PDF.\n\nError: ${result.error}`);
      }
    } catch (error) {
      console.error('Export PDF error:', error);
      alert(`❌ An error occurred while exporting PDF.\n\n${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImages = async () => {
    setIsExporting(true);
    try {
      const result = await exportStoryboardImages(
        scenes,
        storyboardData.project_title || 'Storyboard'
      );
      
      if (result.success) {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'export-notification success';
        notification.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div>
            <strong>Images exported successfully!</strong>
            <p>${result.fileName}</p>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
      } else {
        alert(`❌ Failed to export images.\n\nError: ${result.error}`);
      }
    } catch (error) {
      console.error('Export images error:', error);
      alert(`❌ An error occurred while exporting images.\n\n${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className={`storyboard-main-modern ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {/* Header */}
      <div className="storyboard-header-modern animate-fade-in">
        <div className="header-left">
          <Link to="/dashboard" className="back-btn-modern">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </Link>
          <div className="title-section">
            <h1 className="storyboard-title-modern gradient-text">
              {storyboardData.project_title || "Storyboard"}
            </h1>
            <p className="scene-count-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              {scenes.length} Scene{scenes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="header-actions">
          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
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
            <button
              className={`view-btn ${viewMode === "timeline" ? "active" : ""}`}
              onClick={() => setViewMode("timeline")}
              title="Timeline View"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3" y2="6.01"/>
                <line x1="3" y1="12" x2="3" y2="12.01"/>
                <line x1="3" y1="18" x2="3" y2="18.01"/>
              </svg>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="zoom-controls glass-effect">
            <button onClick={handleZoomOut} disabled={zoomLevel <= 50} title="Zoom Out">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
            <span className="zoom-level">{zoomLevel}%</span>
            <button onClick={handleZoomIn} disabled={zoomLevel >= 200} title="Zoom In">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
            <button onClick={handleResetZoom} className="reset-zoom" title="Reset Zoom">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
            </button>
          </div>

          {/* Export Menu */}
          <div className="export-menu">
            <button 
              className="btn btn-outline" 
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="spinner-small"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  Export PDF
                </>
              )}
            </button>
            <button 
              className="btn btn-outline" 
              onClick={handleExportImages}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="spinner-small"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  Export Images
                </>
              )}
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button className="fullscreen-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
            {isFullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Storyboard Content */}
      <div 
        className={`storyboard-content-modern ${viewMode} animate-fade-in`}
        style={{ '--zoom-level': `${zoomLevel}%` }}
      >
        {scenes.map((scene, index) => (
          <div 
            className="scene-card-modern glass-effect hover-lift" 
            key={index}
            onClick={() => openLightbox(index)}
          >
            <div className="scene-image-wrapper">
              <img
                src={`data:image/png;base64,${scene.image}`}
                alt={`Scene ${index + 1}: ${scene.text}`}
                className="scene-image-modern"
                loading="lazy"
              />
              <div className="scene-overlay">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                  <line x1="11" y1="8" x2="11" y2="14"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
            </div>
            <div className="scene-info-modern">
              <div className="scene-header">
                <span className="scene-number-badge">Scene {index + 1}</span>
                <span className="scene-duration">~5s</span>
              </div>
              <p className="scene-description-modern">{scene.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedScene !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <button className="lightbox-nav lightbox-prev" onClick={prevScene}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <div className="lightbox-image-container">
              <img
                src={`data:image/png;base64,${scenes[selectedScene].image}`}
                alt={`Scene ${selectedScene + 1}`}
                className="lightbox-image"
              />
              <div className="lightbox-info">
                <h3>Scene {selectedScene + 1} of {scenes.length}</h3>
                <p>{scenes[selectedScene].text}</p>
              </div>
            </div>

            <button className="lightbox-nav lightbox-next" onClick={nextScene}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            <div className="lightbox-thumbnails">
              {scenes.map((scene, index) => (
                <div
                  key={index}
                  className={`lightbox-thumb ${index === selectedScene ? 'active' : ''}`}
                  onClick={() => setSelectedScene(index)}
                >
                  <img src={`data:image/png;base64,${scene.image}`} alt={`Thumb ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
