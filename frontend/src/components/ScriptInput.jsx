import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import djangoApiService from "../services/djangoApi.js";
import "./ScriptInput.modern.css";

export default function ScriptInput() {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { title } = location.state || { title: "New Project" };

  const [script, setScript] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [aiProvider, setAiProvider] = useState("huggingface"); // Default to Hugging Face
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [autoSaved, setAutoSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Calculate stats
  const wordCount = script.trim() ? script.trim().split(/\s+/).length : 0;
  const charCount = script.length;
  
  // Count scenes - handle both "Scene X:" format and line-by-line format
  let sceneCount = 0;
  if (script.trim()) {
    // First try to match "Scene X:" pattern
    const explicitScenes = script.match(/Scene\s+\d+:/gi);
    if (explicitScenes && explicitScenes.length > 0) {
      sceneCount = explicitScenes.length;
    } else {
      // If no explicit scene markers, count non-empty lines (each line is a scene)
      const lines = script.split('\n').filter(line => line.trim().length > 0);
      sceneCount = lines.length;
    }
  }

  useEffect(() => {
    // Load project details if available
    const loadProjectData = async () => {
      try {
        if (projectId && !projectId.startsWith('proj_')) {
          const { data: projectData, error } = await djangoApiService.getProject(projectId);
          if (projectData && !error) {
            setProject(projectData);
            if (projectData.script) {
              setScript(projectData.script);
            }
          } else if (error) {
            console.warn('Project not found, creating new project:', error);
            // If project doesn't exist, we'll create a new one when user submits
            setProject(null);
          }
        }
      } catch (error) {
        console.warn('Error loading project, will create new one:', error);
        // If project loading fails, we'll create a new one when user submits
        setProject(null);
      }
    };
    
    loadProjectData();
  }, [projectId]);

  // Auto-save functionality
  useEffect(() => {
    if (!script.trim() || !projectId || projectId.startsWith('proj_')) return;
    
    const autoSaveTimer = setTimeout(async () => {
      try {
        await djangoApiService.updateProject(projectId, { script });
        setAutoSaved(true);
        setLastSaved(new Date());
        setTimeout(() => setAutoSaved(false), 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 3000); // Auto-save after 3 seconds of inactivity
    
    return () => clearTimeout(autoSaveTimer);
  }, [script, projectId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScript(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!script.trim()) return;
    setLoading(true);
    
    try {
      // First, update the project with the script (only if project exists)
      if (projectId && !projectId.startsWith('proj_') && project) {
        await djangoApiService.updateProject(projectId, { script });
      }
      
      // Generate storyboard with AI provider
      const res = await fetch("http://127.0.0.1:8000/api/storyboards/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          script, 
          ai_provider: aiProvider 
        }),
      });
      
      const data = await res.json();
      
      if (data.storyboard_id) {
        // Storyboard is already saved in Django backend
        console.log('Storyboard generated successfully:', data.storyboard_id);
        
        // Navigate to storyboard viewer
        navigate(`/storyboard/${data.storyboard_id}`, {
          state: { storyboardData: data },
        });
      } else {
        alert(
          "Failed to generate storyboard. Please check the script and try again."
        );
        console.error("Server response error:", data);
      }
    } catch (err) {
      alert("An error occurred while generating the storyboard.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="script-main-modern">
      {/* Animated Background */}
      <div className="script-bg-animated">
        <div className="script-orb script-orb-1"></div>
        <div className="script-orb script-orb-2"></div>
        <div className="script-orb script-orb-3"></div>
      </div>

      {/* Header */}
      <div className="script-header-modern animate-fade-in">
        <div className="script-header-top">
          <Link to="/dashboard" className="back-btn-modern hover-lift">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </Link>
          <div className="auto-save-indicator">
            {autoSaved && (
              <span className="saved-badge animate-slide-up">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Auto-saved
              </span>
            )}
            {lastSaved && !autoSaved && (
              <span className="last-saved-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Last saved {new Date(lastSaved).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="script-title-wrapper">
          <div className="script-title-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <h1 className="script-title-modern text-glow">
              {project?.title || title}
            </h1>
            <p className="script-subtitle-modern">
              Write your script, and we'll generate a stunning storyboard with AI ✨
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="script-stats-bar glass-effect animate-slide-up card-hover">
        <div className="stat-item stat-item-primary">
          <div className="stat-icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Scenes</span>
            <span className="stat-value gradient-text">{sceneCount || 0}</span>
          </div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item stat-item-success">
          <div className="stat-icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Words</span>
            <span className="stat-value">{wordCount}</span>
          </div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item stat-item-info">
          <div className="stat-icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Characters</span>
            <span className="stat-value">{charCount}</span>
          </div>
        </div>
        <div className="stat-progress">
          <div className="stat-progress-bar" style={{ width: `${Math.min((sceneCount / 10) * 100, 100)}%` }}></div>
        </div>
      </div>

      <form className="script-form-modern animate-fade-in" onSubmit={handleSubmit}>
        <div className="script-editor-container">
          {/* Editor Section */}
          <div className="editor-panel glass-effect card-hover">
            <div className="editor-header">
              <div className="editor-header-left">
                <div className="editor-icon-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div>
                  <h3 className="editor-title">Script Editor</h3>
                  <p className="editor-description">Write your cinematic story scene by scene</p>
                </div>
              </div>
              <div className="editor-tools">
                <label htmlFor="script-file" className="upload-btn-modern btn-glow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Import Script
                </label>
                <input
                  type="file"
                  id="script-file"
                  className="script-file-input-hidden"
                  accept=".txt"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="editor-body">
              <textarea
                className="script-textarea-modern"
                placeholder="🎬 Scene 1: A cinematic sunrise over mountains, golden light breaking through clouds.

🎥 Scene 2: A lone wolf stands on a cliff, howling at the full moon.

🌅 Scene 3: The hero walks toward the horizon, determined and fearless.

💡 Pro Tips:
• Start each scene with 'Scene N:' for clarity
• Be vivid and descriptive for stunning AI results
• Include visual details: lighting, mood, colors
• Keep each scene focused and cinematic"
                required
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows="16"
              />
              {script.trim() && (
                <div className="editor-footer">
                  <div className="editor-footer-hint">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Your script is ready for AI generation
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="settings-panel glass-effect card-hover">
            <div className="settings-header">
              <div className="settings-icon-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6"/>
                  <path d="m1 12h6m6 0h6"/>
                </svg>
              </div>
              <div>
                <h3 className="settings-title">Generation Settings</h3>
                <p className="settings-description">Configure your AI storyboard</p>
              </div>
            </div>

            <div className="settings-body">
              <div className="settings-group">
                <label className="setting-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  Aspect Ratio
                </label>
                <select
                  className="select-modern"
                  required
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                >
                  <option value="16:9">📺 16:9 Widescreen</option>
                  <option value="4:3">📺 4:3 Standard</option>
                  <option value="9:16">📱 9:16 Vertical</option>
                  <option value="1:1">⬜ 1:1 Square</option>
                </select>
              </div>

              <div className="settings-group">
                <label className="setting-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                  AI Provider
                </label>
                <select
                  className="select-modern"
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                >
                  <option value="huggingface">🤗 Hugging Face (Free)</option>
                  <option value="auto">🔄 Auto-Select</option>
                  <option value="openai">🎨 OpenAI DALL-E</option>
                  <option value="stability">⚡ Stability AI</option>
                  <option value="replicate">🔄 Replicate</option>
                </select>
              </div>

              <div className="info-box">
                <div className="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
                <div className="info-content">
                  <strong>💡 Pro Tip:</strong>
                  <p>Use Hugging Face for instant free generation. Other providers may require API keys and offer premium quality.</p>
                </div>
              </div>

              <div className="generation-preview">
                <div className="preview-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>Generation Preview</span>
                </div>
                <div className="preview-stats">
                  <div className="preview-stat">
                    <span className="preview-stat-label">Scenes to generate:</span>
                    <span className="preview-stat-value">{sceneCount || 0}</span>
                  </div>
                  <div className="preview-stat">
                    <span className="preview-stat-label">Est. time:</span>
                    <span className="preview-stat-value">{sceneCount ? `~${sceneCount * 15}s` : '0s'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                type="button"
                className="btn btn-outline btn-cancel-modern"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-generate-modern btn-glow"
                disabled={loading || !script.trim()}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    Generate Storyboard
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
