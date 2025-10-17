from django.contrib import admin
from .models import Project, Storyboard, UserProfile


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'created_at', 'updated_at']
    list_filter = ['created_at', 'user']
    search_fields = ['title', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(Storyboard) 
class StoryboardAdmin(admin.ModelAdmin):
    list_display = ['id', 'project', 'user', 'ai_provider', 'status', 'total_scenes', 'created_at']
    list_filter = ['status', 'ai_provider', 'created_at', 'user']
    search_fields = ['project__title', 'user__username']
    readonly_fields = ['id', 'created_at', 'updated_at', 'total_scenes']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'preferred_ai_provider', 'total_storyboards_generated', 'monthly_generations_used']
    list_filter = ['preferred_ai_provider', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
