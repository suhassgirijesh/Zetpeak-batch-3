import os
import base64
import requests
import time
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import openai
from huggingface_hub import InferenceClient
from django.conf import settings

# API Keys from Django settings
OPENAI_API_KEY = getattr(settings, 'OPENAI_API_KEY', None)
STABILITY_API_KEY = getattr(settings, 'STABILITY_API_KEY', None)
HUGGINGFACE_API_KEY = getattr(settings, 'HUGGINGFACE_API_KEY', None)
REPLICATE_API_TOKEN = getattr(settings, 'REPLICATE_API_TOKEN', None)

def generate_image_openai_dalle(prompt, style="vivid"):
    """Generate image using OpenAI DALL-E 3 API"""
    try:
        if not OPENAI_API_KEY:
            raise ValueError("OpenAI API key not found")
        
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        
        # Enhance prompt for storyboard style
        enhanced_prompt = f"Storyboard panel illustration: {prompt}. Cinematic style, professional storyboard sketch, black and white with selective color highlights."
        
        response = client.images.generate(
            model="dall-e-3",
            prompt=enhanced_prompt,
            size="1024x1024",
            quality="standard",
            style=style,
            n=1
        )
        
        image_url = response.data[0].url
        
        # Download and convert to base64
        img_response = requests.get(image_url)
        if img_response.status_code == 200:
            return base64.b64encode(img_response.content).decode('utf-8')
        else:
            raise Exception("Failed to download generated image")
            
    except Exception as e:
        print(f"DALL-E Error: {e}")
        return None

def generate_image_stability_ai(prompt):
    """Generate image using Stability AI API"""
    try:
        if not STABILITY_API_KEY:
            raise ValueError("Stability AI API key not found")
        
        url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
        
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {STABILITY_API_KEY}",
        }
        
        # Enhanced prompt for storyboard
        enhanced_prompt = f"Professional storyboard illustration, {prompt}, cinematic framing, sketch style, high contrast, detailed composition"
        
        body = {
            "steps": 40,
            "width": 1024,
            "height": 1024,
            "seed": 0,
            "cfg_scale": 5,
            "samples": 1,
            "text_prompts": [
                {
                    "text": enhanced_prompt,
                    "weight": 1
                },
                {
                    "text": "blurry, bad quality, distorted",
                    "weight": -1
                }
            ],
        }
        
        response = requests.post(url, headers=headers, json=body)
        
        if response.status_code == 200:
            data = response.json()
            return data["artifacts"][0]["base64"]
        else:
            raise Exception(f"Stability AI API error: {response.status_code}")
            
    except Exception as e:
        print(f"Stability AI Error: {e}")
        return None

def generate_image_huggingface(prompt, model="stabilityai/stable-diffusion-xl-base-1.0"):
    """Generate image using Hugging Face Inference API with direct requests"""
    try:
        if not HUGGINGFACE_API_KEY:
            raise ValueError("Hugging Face API key not found")
        
        # Try multiple models in order of preference
        models_to_try = [
            "stabilityai/stable-diffusion-xl-base-1.0",
            "runwayml/stable-diffusion-v1-5",
            "CompVis/stable-diffusion-v1-4"
        ]
        
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
        
        # Enhanced prompt for storyboard
        enhanced_prompt = f"Professional storyboard illustration: {prompt}. Cinematic composition, dramatic lighting, detailed sketch style."
        
        for model_name in models_to_try:
            try:
                print(f"Trying model: {model_name}")
                API_URL = f"https://api-inference.huggingface.co/models/{model_name}"
                
                response = requests.post(
                    API_URL,
                    headers=headers,
                    json={"inputs": enhanced_prompt},
                    timeout=60
                )
                
                if response.status_code == 200:
                    # Convert bytes to base64
                    img_str = base64.b64encode(response.content).decode('utf-8')
                    print(f"✓ Successfully generated with {model_name}")
                    return img_str
                elif response.status_code == 503:
                    print(f"Model {model_name} is loading, trying next...")
                    continue
                else:
                    print(f"Model {model_name} failed with status {response.status_code}")
                    continue
                    
            except Exception as model_error:
                print(f"Error with model {model_name}: {model_error}")
                continue
        
        raise Exception("All Hugging Face models failed")
            
    except Exception as e:
        print(f"Hugging Face Error: {e}")
        return None

def generate_placeholder_image(prompt, width=1024, height=1024):
    """Generate a placeholder image with the scene text"""
    try:
        # Create a simple placeholder image with better styling
        img = Image.new('RGB', (width, height), color='#f8f9fa')
        draw = ImageDraw.Draw(img)
        
        # Draw a border
        draw.rectangle([20, 20, width-20, height-20], outline='#6c757d', width=4)
        
        # Try to use fonts
        try:
            title_font = ImageFont.truetype("arial.ttf", 32)
            text_font = ImageFont.truetype("arial.ttf", 20)
        except:
            title_font = ImageFont.load_default()
            text_font = ImageFont.load_default()
        
        # Add title
        title = "STORYBOARD PREVIEW"
        try:
            title_bbox = draw.textbbox((0, 0), title, font=title_font)
            title_width = title_bbox[2] - title_bbox[0]
            title_x = (width - title_width) // 2
            draw.text((title_x, 80), title, fill='#495057', font=title_font)
        except:
            draw.text((width//2 - 100, 80), title, fill='#495057', font=title_font)
        
        # Format the prompt text
        words = prompt.split()
        lines = []
        current_line = ""
        
        for word in words:
            test_line = current_line + (" " if current_line else "") + word
            if len(test_line) <= 40:  # Characters per line
                current_line = test_line
            else:
                if current_line:
                    lines.append(current_line)
                current_line = word
        if current_line:
            lines.append(current_line)
        
        # Draw text lines
        start_y = height // 2 - (len(lines) * 15)
        for i, line in enumerate(lines[:10]):  # Max 10 lines
            try:
                line_bbox = draw.textbbox((0, 0), line, font=text_font)
                line_width = line_bbox[2] - line_bbox[0]
                x = (width - line_width) // 2
            except:
                x = width // 2 - len(line) * 5
            y = start_y + i * 30
            draw.text((x, y), line, fill='#212529', font=text_font)
        
        # Add footer
        footer = "Preview - AI image will appear here"
        try:
            footer_bbox = draw.textbbox((0, 0), footer, font=text_font)
            footer_width = footer_bbox[2] - footer_bbox[0]
            footer_x = (width - footer_width) // 2
        except:
            footer_x = width // 2 - len(footer) * 5
        draw.text((footer_x, height - 100), footer, fill='#6c757d', font=text_font)
        
        # Convert to base64
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        return img_str
        
    except Exception as e:
        print(f"Placeholder generation error: {e}")
        # Return a simple base64 encoded 1x1 pixel image as fallback
        return base64.b64encode(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x00\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82').decode('utf-8')

def generate_ai_image(prompt, provider='auto'):
    """
    Main function to generate AI images with fallback system
    """
    providers = {
        'huggingface': generate_image_huggingface,
        'openai': generate_image_openai_dalle,
        'stability': generate_image_stability_ai,
    }
    
    # Auto mode: try providers in order of preference
    if provider == 'auto':
        provider_order = ['huggingface', 'openai', 'stability']
    else:
        provider_order = [provider] if provider in providers else ['huggingface']
    
    for current_provider in provider_order:
        try:
            print(f"Trying {current_provider} for: {prompt[:50]}...")
            result = providers[current_provider](prompt)
            if result:
                print(f"✓ Successfully generated with {current_provider}")
                return result
        except Exception as e:
            print(f"✗ {current_provider} failed: {e}")
            continue
    
    # If all AI providers fail, return placeholder
    print("All AI providers failed, generating placeholder...")
    return generate_placeholder_image(prompt)

def parse_script(script):
    """Parse script into individual scenes"""
    if not script:
        return []
    
    # Split by double newlines first, then single newlines
    scenes = script.strip().split('\n\n')
    if len(scenes) == 1:
        scenes = script.strip().split('\n')
    
    # Clean up scenes
    scenes = [scene.strip() for scene in scenes if scene.strip()]
    
    return scenes