from rest_framework import serializers
from .models import Project, Storyboard, UserProfile
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class StoryboardSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    total_scenes = serializers.ReadOnlyField()
    
    class Meta:
        model = Storyboard
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class GenerateStoryboardSerializer(serializers.Serializer):
    """Serializer for storyboard generation request"""
    script = serializers.CharField(max_length=10000, help_text="Script text to generate storyboard from")
    ai_provider = serializers.ChoiceField(
        choices=[
            ('auto', 'Auto'),
            ('huggingface', 'Hugging Face'),
            ('openai', 'OpenAI DALL-E'),
            ('stability', 'Stability AI'),
        ],
        default='auto',
        help_text="AI provider to use for image generation"
    )
    project_id = serializers.UUIDField(required=False, help_text="Optional project ID to associate with this storyboard")


class GenerateStoryboardResponseSerializer(serializers.Serializer):
    """Serializer for storyboard generation response"""
    storyboard_id = serializers.UUIDField()
    scenes = serializers.ListField()
    total_scenes = serializers.IntegerField()
    ai_provider_used = serializers.CharField()
    status = serializers.CharField()