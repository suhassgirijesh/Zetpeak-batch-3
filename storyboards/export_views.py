import io
import base64
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.utils import ImageReader
from pptx import Presentation
from pptx.util import Inches, Pt
from storyboards.models import Storyboard


class ExportPDFView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, storyboard_id, *args, **kwargs):
        """
        Export storyboard as PDF file
        """
        storyboard = get_object_or_404(Storyboard, id=storyboard_id, user=request.user)
        
        if not storyboard.scenes:
            return Response({"error": "No scenes to export"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create PDF in memory
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=landscape(letter))
        
        for panel in storyboard.scenes:
            # Decode base64 image if available
            try:
                if panel.get('image'):
                    img_data = base64.b64decode(panel['image'])
                    img = Image.open(io.BytesIO(img_data))
                    img_reader = ImageReader(img)
                else:
                    img_reader = None
            except Exception:
                img_reader = None
            
            # Draw image
            if img_reader:
                c.drawImage(img_reader, 50, 250, width=500, height=281, 
                           preserveAspectRatio=True, mask='auto')
            
            # Draw text
            c.setFont("Helvetica-Bold", 14)
            scene_text = panel.get('text', 'No description')
            c.drawString(50, 200, f"Scene: {scene_text}")
            c.showPage()
        
        c.save()
        buffer.seek(0)
        
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="storyboard_{storyboard.id}.pdf"'
        return response


class ExportPPTXView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, storyboard_id, *args, **kwargs):
        """
        Export storyboard as PowerPoint file
        """
        storyboard = get_object_or_404(Storyboard, id=storyboard_id, user=request.user)
        
        if not storyboard.scenes:
            return Response({"error": "No scenes to export"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create PowerPoint presentation
        prs = Presentation()
        
        for panel in storyboard.scenes:
            # Add slide
            slide_layout = prs.slide_layouts[5]  # Blank layout
            slide = prs.slides.add_slide(slide_layout)
            
            # Add image if available
            if panel.get('image'):
                try:
                    img_data = base64.b64decode(panel['image'])
                    img_stream = io.BytesIO(img_data)
                    
                    # Add image to slide
                    slide.shapes.add_picture(img_stream, Inches(1), Inches(1), 
                                           width=Inches(8), height=Inches(4.5))
                except Exception as e:
                    print(f"Error adding image to slide: {e}")
            
            # Add text box
            text_box = slide.shapes.add_textbox(Inches(1), Inches(6), Inches(8), Inches(1))
            text_frame = text_box.text_frame
            p = text_frame.paragraphs[0]
            p.text = panel.get('text', 'No description')
            p.font.size = Pt(18)
        
        # Save to memory buffer
        buffer = io.BytesIO()
        prs.save(buffer)
        buffer.seek(0)
        
        response = HttpResponse(
            buffer.getvalue(), 
            content_type='application/vnd.openxmlformats-officedocument.presentationml.presentation'
        )
        response['Content-Disposition'] = f'attachment; filename="storyboard_{storyboard.id}.pptx"'
        return response