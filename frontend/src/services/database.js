import { supabase } from '../supabaseClient.js'

// =========================================
// PROJECT CRUD OPERATIONS
// =========================================

export const projectService = {
  // Get all projects for the current user
  async getProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  },

  // Create a new project
  async createProject(projectData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: user.id,
            title: projectData.title,
            description: projectData.description || null,
            script: projectData.script || null
          }
        ])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  },

  // Update a project
  async updateProject(projectId, updates) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  },

  // Delete a project
  async deleteProject(projectId) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  },

  // Get a single project by ID
  async getProject(projectId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching project:', error)
      throw error
    }
  }
}

// =========================================
// STORYBOARD CRUD OPERATIONS
// =========================================

export const storyboardService = {
  // Create a new storyboard
  async createStoryboard(projectId, scenes, metadata = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('storyboards')
        .insert([
          {
            project_id: projectId,
            user_id: user.id,
            scenes: scenes,
            metadata: metadata
          }
        ])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating storyboard:', error)
      throw error
    }
  },

  // Get storyboards for a project
  async getStoryboards(projectId) {
    try {
      const { data, error } = await supabase
        .from('storyboards')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching storyboards:', error)
      throw error
    }
  },

  // Get a single storyboard by ID
  async getStoryboard(storyboardId) {
    try {
      const { data, error } = await supabase
        .from('storyboards')
        .select(`
          *,
          projects (
            id,
            title,
            script
          )
        `)
        .eq('id', storyboardId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching storyboard:', error)
      throw error
    }
  },

  // Update a storyboard
  async updateStoryboard(storyboardId, updates) {
    try {
      const { data, error } = await supabase
        .from('storyboards')
        .update(updates)
        .eq('id', storyboardId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating storyboard:', error)
      throw error
    }
  },

  // Delete a storyboard
  async deleteStoryboard(storyboardId) {
    try {
      const { error } = await supabase
        .from('storyboards')
        .delete()
        .eq('id', storyboardId)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting storyboard:', error)
      throw error
    }
  }
}

// =========================================
// AUTHENTICATION HELPERS
// =========================================

export const authService = {
  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const user = await this.getCurrentUser()
    return !!user
  }
}

// =========================================
// MIGRATION HELPER (localStorage to database)
// =========================================

export const migrationService = {
  // Migrate projects from localStorage to database
  async migrateLocalStorageProjects() {
    try {
      const localProjects = JSON.parse(localStorage.getItem('projects') || '[]')
      
      if (localProjects.length === 0) {
        console.log('No local projects to migrate')
        return []
      }

      const migratedProjects = []
      
      for (const localProject of localProjects) {
        try {
          const dbProject = await projectService.createProject({
            title: localProject.title,
            script: localProject.script,
            description: `Migrated from local storage on ${new Date().toISOString()}`
          })
          migratedProjects.push(dbProject)
        } catch (error) {
          console.error('Error migrating project:', localProject.title, error)
        }
      }

      // Clear localStorage after successful migration
      if (migratedProjects.length > 0) {
        localStorage.removeItem('projects')
        console.log(`Successfully migrated ${migratedProjects.length} projects`)
      }

      return migratedProjects
    } catch (error) {
      console.error('Error during migration:', error)
      throw error
    }
  }
}
