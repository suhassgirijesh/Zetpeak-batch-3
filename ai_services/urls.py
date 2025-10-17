from django.urls import path
from . import views

urlpatterns = [
    # Example endpoint for AI image generation
    path('generate-image/', views.GenerateAIImageView.as_view(), name='generate_ai_image'),
]
