// Django API service for Cini Storyboard Generator
// This replaces the Supabase client with Django REST API calls

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function to get authentication headers
const getAuthHeaders = () => {
  // For now, we'll implement basic session-based auth
  // You can later integrate with token-based authentication
  return {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCsrfToken(),
  };
};

// Get CSRF token from Django
const getCsrfToken = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') {
      return value;
    }
  }
  return '';
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    credentials: 'include', // Include cookies for session auth
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// =========================================
// STORYBOARD OPERATIONS
// =========================================

export const storyboardService = {
  // Generate a new storyboard
  async generateStoryboard(scriptData) {
    try {
      const response = await apiRequest('/storyboards/generate/', {
        method: 'POST',
        body: JSON.stringify({
          script: scriptData.script,
          ai_provider: scriptData.ai_provider || 'auto',
          project_id: scriptData.project_id || null,
        }),
      });
      
      return response;
    } catch (error) {
      console.error('Error generating storyboard:', error);
      throw error;
    }
  },

  // Get storyboard by ID
  async getStoryboard(storyboardId) {
    try {
      const response = await apiRequest(`/storyboards/${storyboardId}/`);
      return response;
    } catch (error) {
      console.error('Error fetching storyboard:', error);
      throw error;
    }
  },

  // Export storyboard as PDF
  async exportToPDF(storyboardId) {
    try {
      const url = `${API_BASE_URL}/storyboards/${storyboardId}/export/pdf/`;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      // Return blob for download
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    }
  },

  // Export storyboard as PowerPoint
  async exportToPPTX(storyboardId) {
    try {
      const url = `${API_BASE_URL}/storyboards/${storyboardId}/export/pptx/`;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      // Return blob for download
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error exporting PPTX:', error);
      throw error;
    }
  },
};

// =========================================
// AUTHENTICATION OPERATIONS
// =========================================

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await apiRequest('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({
          username: credentials.email, // Django uses username field
          password: credentials.password,
        }),
      });
      
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await apiRequest('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({
          username: userData.email,
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
        }),
      });
      
      return response;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      const response = await apiRequest('/auth/logout/', {
        method: 'POST',
      });
      
      return response;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiRequest('/auth/user/');
      return response;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },
};

// =========================================
// PROJECT OPERATIONS (Future Implementation)
// =========================================

export const projectService = {
  // Get all projects for the current user
  async getProjects() {
    try {
      const response = await apiRequest('/projects/');
      return response;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Create a new project
  async createProject(projectData) {
    try {
      const response = await apiRequest('/projects/', {
        method: 'POST',
        body: JSON.stringify({
          title: projectData.title,
          description: projectData.description || null,
          script: projectData.script || null,
        }),
      });
      
      return response;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project
  async updateProject(projectId, projectData) {
    try {
      const response = await apiRequest(`/projects/${projectId}/`, {
        method: 'PUT',
        body: JSON.stringify(projectData),
      });
      
      return response;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  async deleteProject(projectId) {
    try {
      await apiRequest(`/projects/${projectId}/`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },
};

// =========================================
// UTILITY FUNCTIONS
// =========================================

export const utils = {
  // Download blob as file
  downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};