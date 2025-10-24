// Django API service to replace Supabase
const API_BASE_URL = 'http://127.0.0.1:8000/api';

class DjangoApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for CSRF
      ...options,
    };

    console.log('Making API request to:', url, config);

    try {
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      // Handle empty responses (204 No Content for DELETE requests)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { data: null, error: null };
      }
      
      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return { data, error: null };
      }
      
      // For non-JSON responses, return the response object itself
      return { data: response, error: null };
    } catch (error) {
      console.error('API request failed:', error);
      return { data: null, error: error.message };
    }
  }

  // Project methods
  async createProject(projectData) {
    return this.request('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async getProjects() {
    return this.request('/projects/');
  }

  async getProject(id) {
    return this.request(`/projects/${id}/`);
  }

  async updateProject(id, updates) {
    return this.request(`/projects/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}/`, {
      method: 'DELETE',
    });
  }

  // Storyboard methods
  async generateStoryboard(storyboardData) {
    return this.request('/storyboards/generate/', {
      method: 'POST',
      body: JSON.stringify(storyboardData),
    });
  }

  async getStoryboard(id) {
    return this.request(`/storyboards/${id}/`);
  }

  async getStoryboards() {
    return this.request('/storyboards/');
  }

  // Export methods
  async exportPDF(storyboardId) {
    const url = `${this.baseURL}/storyboards/${storyboardId}/export/pdf/`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Export failed! status: ${response.status}`);
    }
    
    return response.blob();
  }

  async exportPPTX(storyboardId) {
    const url = `${this.baseURL}/storyboards/${storyboardId}/export/pptx/`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Export failed! status: ${response.status}`);
    }
    
    return response.blob();
  }

  // Auth methods (placeholder for future implementation)
  async login(credentials) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout/', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/user/me/');
  }
}

// Create and export a singleton instance
const djangoApiService = new DjangoApiService();
export default djangoApiService;

// Also export the class for testing
export { DjangoApiService };