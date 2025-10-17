import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Project(models.Model):
    """Model for managing storyboard projects"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    script = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

    def __str__(self):
        return f"{self.title} - {self.user.username}"


class Storyboard(models.Model):
    """Model for storing generated storyboards"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='storyboards')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='storyboards')
    
    # Store scenes as JSON field (Django's built-in JSONField)
    scenes = models.JSONField(default=list, blank=True)
    
    # Store additional metadata like AI provider used, generation settings, etc.
    metadata = models.JSONField(default=dict, blank=True)
    
    # AI provider used for generation
    ai_provider = models.CharField(max_length=50, default='huggingface')
    
    # Generation status
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('generating', 'Generating'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Error message if generation fails
    error_message = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Storyboard'
        verbose_name_plural = 'Storyboards'

    def __str__(self):
        return f"Storyboard {self.id} for {self.project.title}"

    @property
    def total_scenes(self):
        """Return the total number of scenes in this storyboard"""
        return len(self.scenes) if self.scenes else 0


class UserProfile(models.Model):
    """Extended user profile for additional user data"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # User preferences
    preferred_ai_provider = models.CharField(
        max_length=50, 
        default='huggingface',
        choices=[
            ('huggingface', 'Hugging Face'),
            ('openai', 'OpenAI DALL-E'),
            ('stability', 'Stability AI'),
            ('replicate', 'Replicate'),
        ]
    )
    
    # Usage tracking
    total_storyboards_generated = models.PositiveIntegerField(default=0)
    total_scenes_generated = models.PositiveIntegerField(default=0)
    
    # Account limits (for potential premium features)
    monthly_generation_limit = models.PositiveIntegerField(default=100)
    monthly_generations_used = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"Profile for {self.user.username}"

    def can_generate_more(self):
        """Check if user can generate more storyboards this month"""
        return self.monthly_generations_used < self.monthly_generation_limit

    def increment_usage(self, scenes_count=0):
        """Increment usage counters"""
        self.total_storyboards_generated += 1
        self.total_scenes_generated += scenes_count
        self.monthly_generations_used += 1
        self.save()
