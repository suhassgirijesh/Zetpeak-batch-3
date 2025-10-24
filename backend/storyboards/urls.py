from django.urls import path
from . import views
from .export_views import ExportPDFView, ExportPPTXView

urlpatterns = [
    # User endpoints
    path('user/me/', views.CurrentUserView.as_view(), name='current_user'),
    
    # Project endpoints
    path('projects/', views.ProjectListCreateView.as_view(), name='project_list_create'),
    path('projects/<uuid:pk>/', views.ProjectDetailView.as_view(), name='project_detail'),
    
    # Storyboard endpoints
    path('storyboards/', views.StoryboardListView.as_view(), name='storyboard_list'),
    path('storyboards/generate/', views.GenerateStoryboardView.as_view(), name='generate_storyboard'),
    path('storyboards/<uuid:pk>/', views.StoryboardDetailView.as_view(), name='storyboard_detail'),
    
    # Export endpoints
    path('storyboards/<uuid:storyboard_id>/export/pdf/', ExportPDFView.as_view(), name='export_pdf'),
    path('storyboards/<uuid:storyboard_id>/export/pptx/', ExportPPTXView.as_view(), name='export_pptx'),
]
