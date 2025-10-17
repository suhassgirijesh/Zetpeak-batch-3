from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Project, Storyboard, UserProfile
from .serializers import (
    GenerateStoryboardSerializer, 
    GenerateStoryboardResponseSerializer,
    StoryboardSerializer,
    ProjectSerializer
)
from ai_services.ai_generation import generate_ai_image, parse_script


@method_decorator(csrf_exempt, name='dispatch')
class GenerateStoryboardView(APIView):
    # permission_classes = [IsAuthenticated]  # Temporarily disabled for testing
    
    def post(self, request, *args, **kwargs):
        """
        Generate a storyboard from script text using AI image generation
        """
        serializer = GenerateStoryboardSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        script = serializer.validated_data['script']
        ai_provider = serializer.validated_data.get('ai_provider', 'auto')
        project_id = serializer.validated_data.get('project_id')
        
        # Get or create user profile (create default user for testing)
        from django.contrib.auth.models import User
        user, created = User.objects.get_or_create(username='testuser', defaults={'email': 'test@example.com'})
        user_profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Check if user can generate more storyboards
        if not user_profile.can_generate_more():
            return Response({
                "error": "Monthly generation limit reached"
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        # Parse script into scenes
        scenes = parse_script(script)
        if not scenes:
            return Response({
                "error": "No valid scenes found in script"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create project
        project = None
        if project_id:
            try:
                project = Project.objects.get(id=project_id, user=user)
            except Project.DoesNotExist:
                return Response({
                    "error": "Project not found"
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            # Create a default project
            project = Project.objects.create(
                user=user,
                title=f"Storyboard {scenes[0][:50]}...",
                script=script
            )
        
        # Create storyboard record
        storyboard = Storyboard.objects.create(
            project=project,
            user=user,
            ai_provider=ai_provider,
            status='generating'
        )
        
        # Generate images for each scene
        storyboard_images = []
        try:
            for i, scene_text in enumerate(scenes):
                print(f"Generating image {i+1}/{len(scenes)}: {scene_text[:50]}...")
                
                try:
                    # Generate AI image
                    image_data = generate_ai_image(scene_text, provider=ai_provider)
                    
                    scene_data = {
                        "text": scene_text,
                        "image": image_data,
                        "scene_number": i + 1
                    }
                    
                    if not image_data:
                        scene_data["error"] = "AI generation failed, using placeholder"
                    
                    storyboard_images.append(scene_data)
                    
                except Exception as e:
                    print(f"Error generating scene {i+1}: {e}")
                    # Add scene with error
                    storyboard_images.append({
                        "text": scene_text,
                        "image": None,
                        "scene_number": i + 1,
                        "error": str(e)
                    })
            
            # Update storyboard with generated scenes
            storyboard.scenes = storyboard_images
            storyboard.status = 'completed'
            storyboard.save()
            
            # Update user profile usage
            user_profile.increment_usage(scenes_count=len(scenes))
            
            response_data = {
                "storyboard_id": storyboard.id,
                "scenes": storyboard_images,
                "total_scenes": len(scenes),
                "ai_provider_used": ai_provider,
                "status": "completed"
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            # Update storyboard with error status
            storyboard.status = 'failed'
            storyboard.error_message = str(e)
            storyboard.save()
            
            return Response({
                "error": f"Storyboard generation failed: {str(e)}",
                "storyboard_id": storyboard.id
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class StoryboardListView(APIView):
    # permission_classes = [IsAuthenticated]  # Temporarily disabled for testing
    
    def get(self, request, *args, **kwargs):
        """
        List all storyboards for the current user
        """
        # For testing, get all storyboards without user filtering
        storyboards = Storyboard.objects.all().order_by('-created_at')
        serializer = StoryboardSerializer(storyboards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class StoryboardDetailView(APIView):
    # permission_classes = [IsAuthenticated]  # Temporarily disabled for testing
    
    def get(self, request, pk, *args, **kwargs):
        """
        Retrieve a storyboard by ID
        """
        # For testing, get storyboard without user filtering
        storyboard = get_object_or_404(Storyboard, id=pk)
        serializer = StoryboardSerializer(storyboard)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, pk, *args, **kwargs):
        """
        Delete a storyboard by ID
        """
        # For testing, get storyboard without user filtering
        storyboard = get_object_or_404(Storyboard, id=pk)
        storyboard.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class ProjectListCreateView(APIView):
    # permission_classes = [IsAuthenticated]  # Temporarily disabled for testing
    
    def get(self, request, *args, **kwargs):
        """List all projects for the current user"""
        # For testing, get all projects without user filtering
        projects = Project.objects.all().order_by('-created_at')
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        """Create a new project"""
        # For testing, create with default user
        from django.contrib.auth.models import User
        user, created = User.objects.get_or_create(username='testuser', defaults={'email': 'test@example.com'})
        
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class ProjectDetailView(APIView):
    # permission_classes = [IsAuthenticated]  # Temporarily disabled for testing
    
    def get(self, request, pk, *args, **kwargs):
        """Retrieve a project by ID"""
        # For testing, get project without user filtering
        project = get_object_or_404(Project, id=pk)
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, pk, *args, **kwargs):
        """Update a project"""
        # For testing, get project without user filtering
        project = get_object_or_404(Project, id=pk)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, *args, **kwargs):
        """Delete a project"""
        # For testing, get project without user filtering
        project = get_object_or_404(Project, id=pk)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
