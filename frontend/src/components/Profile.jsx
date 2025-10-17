import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { setTheme, getSavedTheme } from "../utils/theme";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [notification, setNotification] = useState(null);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    username: "",
    bio: "",
    company: "",
    location: "",
    website: "",
    avatar: "",
  });

  const [preferences, setPreferences] = useState({
    theme: "dark",
    notifications: true,
    emailUpdates: true,
    autoSave: true,
    language: "en",
  });

  const [stats, setStats] = useState({
    projectsCreated: 0,
    scenesGenerated: 0,
    memberSince: "",
    lastActive: "",
  });

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setProfileData({
          fullName: user.user_metadata?.full_name || "",
          email: user.email || "",
          username: user.user_metadata?.username || user.email?.split('@')[0] || "",
          bio: user.user_metadata?.bio || "",
          company: user.user_metadata?.company || "",
          location: user.user_metadata?.location || "",
          website: user.user_metadata?.website || "",
          avatar: user.user_metadata?.avatar_url || "",
        });

        // Calculate stats
        setStats({
          projectsCreated: 12, // This should come from database
          scenesGenerated: 148, // This should come from database
          memberSince: new Date(user.created_at).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }),
          lastActive: "Today",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      showNotification("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadUserProfile();
    
    // Load saved theme preference
    const savedTheme = getSavedTheme();
    setPreferences(prev => ({
      ...prev,
      theme: savedTheme
    }));
  }, [loadUserProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Apply theme immediately when changed
    if (key === "theme") {
      setTheme(value);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: profileData.fullName,
            username: profileData.username,
            bio: profileData.bio,
            company: profileData.company,
            location: profileData.location,
            website: profileData.website,
            avatar_url: profileData.avatar,
          }
        });

        if (error) throw error;
        
        showNotification("Profile updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      showNotification("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    showNotification("Preferences saved successfully!", "success");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your projects will be permanently deleted."
    );
    
    if (confirmed) {
      const doubleConfirm = window.confirm(
        "FINAL WARNING: This will permanently delete all your data. Type 'DELETE' to confirm."
      );
      
      if (doubleConfirm) {
        try {
          // In production, you'd call an API endpoint to handle account deletion
          await supabase.auth.signOut();
          localStorage.clear();
          navigate("/");
        } catch (error) {
          console.error("Error deleting account:", error);
          showNotification("Failed to delete account", "error");
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header glass-effect">
        <div className="profile-header-content">
          <button className="back-button" onClick={() => navigate("/dashboard")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          <h1 className="profile-title gradient-text">Account Settings</h1>
          <p className="profile-subtitle">Manage your profile and preferences</p>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {notification.type === "success" ? (
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"/>
            ) : (
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            )}
          </svg>
          {notification.message}
        </div>
      )}

      <div className="profile-container">
        {/* Sidebar */}
        <div className="profile-sidebar glass-effect">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Profile" />
              ) : (
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </div>
            <h3 className="profile-name">{profileData.fullName || profileData.username}</h3>
            <p className="profile-email">{profileData.email}</p>
          </div>

          <div className="profile-stats-sidebar">
            <div className="stat-item-sidebar">
              <div className="stat-value-sidebar">{stats.projectsCreated}</div>
              <div className="stat-label-sidebar">Projects</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item-sidebar">
              <div className="stat-value-sidebar">{stats.scenesGenerated}</div>
              <div className="stat-label-sidebar">Scenes</div>
            </div>
          </div>

          <nav className="profile-nav">
            <button
              className={`profile-nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Profile Information
            </button>
            <button
              className={`profile-nav-item ${activeTab === "preferences" ? "active" : ""}`}
              onClick={() => setActiveTab("preferences")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
              </svg>
              Preferences
            </button>
            <button
              className={`profile-nav-item ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Security
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          {activeTab === "profile" && (
            <div className="profile-section glass-effect">
              <div className="section-header">
                <h2 className="section-title">Profile Information</h2>
                <p className="section-subtitle">Update your personal details</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Choose a username"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    className="form-input"
                    disabled
                  />
                  <span className="form-hint">Email cannot be changed</span>
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={profileData.company}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Your company name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="City, Country"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={profileData.website}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Avatar URL</label>
                  <input
                    type="url"
                    name="avatar"
                    value={profileData.avatar}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-outline" onClick={loadUserProfile}>
                  Reset Changes
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="spinner-small"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="profile-section glass-effect">
              <div className="section-header">
                <h2 className="section-title">Preferences</h2>
                <p className="section-subtitle">Customize your experience</p>
              </div>

              <div className="preferences-list">
                <div className="preference-item">
                  <div className="preference-info">
                    <h4 className="preference-title">Theme</h4>
                    <p className="preference-description">Choose your preferred color scheme</p>
                  </div>
                  <select
                    value={preferences.theme}
                    onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                    className="preference-select"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4 className="preference-title">Language</h4>
                    <p className="preference-description">Select your preferred language</p>
                  </div>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange("language", e.target.value)}
                    className="preference-select"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4 className="preference-title">Push Notifications</h4>
                    <p className="preference-description">Receive notifications about your projects</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={preferences.notifications}
                      onChange={(e) => handlePreferenceChange("notifications", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4 className="preference-title">Email Updates</h4>
                    <p className="preference-description">Get email updates about new features</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={preferences.emailUpdates}
                      onChange={(e) => handlePreferenceChange("emailUpdates", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4 className="preference-title">Auto-save</h4>
                    <p className="preference-description">Automatically save your work</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={preferences.autoSave}
                      onChange={(e) => handlePreferenceChange("autoSave", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" onClick={handleSavePreferences}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="profile-section glass-effect">
              <div className="section-header">
                <h2 className="section-title">Security Settings</h2>
                <p className="section-subtitle">Manage your account security</p>
              </div>

              <div className="security-info">
                <div className="info-card">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <div>
                    <h4>Account Created</h4>
                    <p>{stats.memberSince}</p>
                  </div>
                </div>

                <div className="info-card">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div>
                    <h4>Last Active</h4>
                    <p>{stats.lastActive}</p>
                  </div>
                </div>
              </div>

              <div className="danger-zone">
                <h3 className="danger-title">Danger Zone</h3>
                <p className="danger-description">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="btn btn-danger" onClick={handleDeleteAccount}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
