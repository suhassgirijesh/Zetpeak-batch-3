"""
Portable AI Image Generation Service
Extracted from Django storyboard project for reuse in any Python project
"""

import os
import base64
import requests
import time
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import logging
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIImageGenerator:
    """
    Portable AI Image Generator supporting multiple providers
    Can be used in any Python project (Django, Flask, FastAPI, standalone scripts)
    """
    
    def __init__(self, config: Optional[Dict[str, str]] = None):
        """
        Initialize with API keys from config or environment variables
        
        Args:
            config: Dictionary with API keys {
                'HF_TOKEN': 'your_huggingface_token',
                'OPENAI_API_KEY': 'your_openai_key',
                'STABILITY_API_KEY': 'your_stability_key',
                'REPLICATE_API_TOKEN': 'your_replicate_token'
            }
        """
        self.config = config or {}
        
        # Load API keys from config or environment
        self.hf_token = self.config.get('HF_TOKEN') or os.getenv('HF_TOKEN') or os.getenv('HUGGINGFACE_API_KEY')
        self.openai_key = self.config.get('OPENAI_API_KEY') or os.getenv('OPENAI_API_KEY')
        self.stability_key = self.config.get('STABILITY_API_KEY') or os.getenv('STABILITY_API_KEY')
        self.replicate_token = self.config.get('REPLICATE_API_TOKEN') or os.getenv('REPLICATE_API_TOKEN')
        
        logger.info("AI Image Generator initialized")
        logger.info(f"Available providers: {self.get_available_providers()}")
    
    def get_available_providers(self) -> list:
        """Get list of available AI providers based on configured API keys"""
        providers = []
        if self.hf_token:
            providers.append('huggingface')
        if self.openai_key:
            providers.append('openai')
        if self.stability_key:
            providers.append('stability')
        if self.replicate_token:
            providers.append('replicate')
        providers.append('placeholder')  # Always available
        return providers
    
    def generate_image(
        self, 
        prompt: str, 
        provider: str = 'huggingface',
        style_prompt: str = "professional storyboard illustration, cinematic style",
        width: int = 1024,
        height: int = 1024,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate an AI image based on the given prompt
        
        Args:
            prompt: The scene description to generate an image for
            provider: AI provider ('huggingface', 'openai', 'stability', 'auto', 'placeholder')
            style_prompt: Additional style instructions
            width: Image width in pixels
            height: Image height in pixels
            **kwargs: Additional provider-specific parameters
            
        Returns:
            Dict with keys: 'success', 'image_data', 'provider', 'generation_time', 'error'
        """
        start_time = time.time()
        
        try:
            if provider == 'auto':
                # Try providers in order of preference
                for auto_provider in ['huggingface', 'openai', 'stability']:
                    if auto_provider in self.get_available_providers():
                        try:
                            result = self._generate_with_provider(
                                prompt, auto_provider, style_prompt, width, height, **kwargs
                            )
                            if result:
                                generation_time = time.time() - start_time
                                return {
                                    'success': True,
                                    'image_data': result,
                                    'provider': auto_provider,
                                    'generation_time': generation_time,
                                    'prompt': prompt
                                }
                        except Exception as e:
                            logger.warning(f"Auto mode: {auto_provider} failed: {e}")
                            continue
                
                # If all fail, use placeholder
                placeholder = self._generate_placeholder_image(prompt, width, height)
                generation_time = time.time() - start_time
                return {
                    'success': False,
                    'image_data': placeholder,
                    'provider': 'placeholder',
                    'generation_time': generation_time,
                    'error': 'All AI providers failed, used placeholder',
                    'fallback': True
                }
            
            else:
                # Use specific provider
                image_data = self._generate_with_provider(
                    prompt, provider, style_prompt, width, height, **kwargs
                )
                
                generation_time = time.time() - start_time
                
                return {
                    'success': True,
                    'image_data': image_data,
                    'provider': provider,
                    'generation_time': generation_time,
                    'prompt': prompt
                }
            
        except Exception as e:
            logger.error(f"Error generating image with {provider}: {str(e)}")
            generation_time = time.time() - start_time
            
            # Fallback to placeholder
            try:
                placeholder = self._generate_placeholder_image(prompt, width, height)
                return {
                    'success': False,
                    'image_data': placeholder,
                    'provider': 'placeholder',
                    'generation_time': generation_time,
                    'error': str(e),
                    'fallback': True
                }
            except Exception as fallback_error:
                return {
                    'success': False,
                    'image_data': None,
                    'provider': provider,
                    'generation_time': generation_time,
                    'error': f"Primary error: {str(e)}, Fallback error: {str(fallback_error)}"
                }
    
    def _generate_with_provider(self, prompt: str, provider: str, style_prompt: str, width: int, height: int, **kwargs) -> str:
        """Generate image with specific provider"""
        full_prompt = f"{style_prompt}, {prompt}"
        
        if provider == 'huggingface':
            return self._generate_huggingface_image(full_prompt, width, height, **kwargs)
        elif provider == 'openai':
            return self._generate_openai_image(full_prompt, width, height, **kwargs)
        elif provider == 'stability':
            return self._generate_stability_image(full_prompt, width, height, **kwargs)
        elif provider == 'placeholder':
            return self._generate_placeholder_image(prompt, width, height)
        else:
            raise ValueError(f"Unknown AI provider: {provider}")
    
    def _generate_huggingface_image(self, prompt: str, width: int, height: int, **kwargs) -> str:
        """Generate image using Hugging Face Inference API"""
        if not self.hf_token:
            raise ValueError("Hugging Face token not configured")
        
        models = [
            "stabilityai/stable-diffusion-xl-base-1.0",
            "runwayml/stable-diffusion-v1-5",
            "CompVis/stable-diffusion-v1-4"
        ]
        
        headers = {"Authorization": f"Bearer {self.hf_token}"}
        
        for model in models:
            try:
                logger.info(f"Trying Hugging Face model: {model}")
                API_URL = f"https://api-inference.huggingface.co/models/{model}"
                
                payload = {
                    "inputs": prompt,
                    "parameters": {
                        "num_inference_steps": kwargs.get('steps', 20),
                        "guidance_scale": kwargs.get('guidance_scale', 7.5),
                    }
                }
                
                response = requests.post(
                    API_URL,
                    headers=headers,
                    json=payload,
                    timeout=60
                )
                
                if response.status_code == 200:
                    image_data = base64.b64encode(response.content).decode('utf-8')
                    logger.info(f"✓ Successfully generated with {model}")
                    return image_data
                elif response.status_code == 503:
                    logger.warning(f"Model {model} is loading, trying next...")
                    continue
                else:
                    logger.warning(f"Model {model} failed with status {response.status_code}")
                    continue
                    
            except Exception as e:
                logger.error(f"Error with model {model}: {str(e)}")
                continue
        
        raise Exception("All Hugging Face models failed")
    
    def _generate_openai_image(self, prompt: str, width: int, height: int, **kwargs) -> str:
        """Generate image using OpenAI DALL-E API"""
        if not self.openai_key:
            raise ValueError("OpenAI API key not configured")
        
        try:
            import openai
            client = openai.OpenAI(api_key=self.openai_key)
            
            # Map dimensions to DALL-E supported sizes
            if width >= 1024 or height >= 1024:
                size = "1024x1024"
            elif width >= 512 or height >= 512:
                size = "1024x1024"  # DALL-E 3 minimum
            else:
                size = "1024x1024"
            
            response = client.images.generate(
                model=kwargs.get('model', 'dall-e-3'),
                prompt=prompt[:4000],  # DALL-E prompt limit
                size=size,
                quality=kwargs.get('quality', 'standard'),
                style=kwargs.get('style', 'vivid'),
                n=1
            )
            
            image_url = response.data[0].url
            
            # Download and convert to base64
            img_response = requests.get(image_url, timeout=30)
            if img_response.status_code == 200:
                base64_image = base64.b64encode(img_response.content).decode('utf-8')
                logger.info("Successfully generated image using OpenAI DALL-E")
                return base64_image
            else:
                raise Exception("Failed to download generated image from OpenAI")
                
        except ImportError:
            raise Exception("OpenAI library not installed. Run: pip install openai")
        except Exception as e:
            raise Exception(f"OpenAI generation failed: {str(e)}")
    
    def _generate_stability_image(self, prompt: str, width: int, height: int, **kwargs) -> str:
        """Generate image using Stability AI API"""
        if not self.stability_key:
            raise ValueError("Stability AI API key not configured")
        
        url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
        
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.stability_key}",
        }
        
        body = {
            "steps": kwargs.get('steps', 20),
            "width": width,
            "height": height,
            "seed": kwargs.get('seed', 0),
            "cfg_scale": kwargs.get('cfg_scale', 7),
            "samples": 1,
            "text_prompts": [
                {
                    "text": prompt,
                    "weight": 1
                },
                {
                    "text": "blurry, bad quality, distorted",
                    "weight": -1
                }
            ],
        }
        
        response = requests.post(url, headers=headers, json=body, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            base64_image = data["artifacts"][0]["base64"]
            logger.info("Successfully generated image using Stability AI")
            return base64_image
        else:
            raise Exception(f"Stability AI API failed with status {response.status_code}: {response.text}")
    
    def _generate_placeholder_image(self, text: str, width: int = 1024, height: int = 1024) -> str:
        """Generate a professional placeholder image with the given text"""
        try:
            img = Image.new('RGB', (width, height), color='#f8f9fa')
            draw = ImageDraw.Draw(img)
            
            # Draw border
            border_width = max(4, width // 256)
            draw.rectangle([20, 20, width-20, height-20], outline='#6c757d', width=border_width)
            
            # Try to use fonts
            try:
                title_font_size = max(24, width // 32)
                text_font_size = max(16, width // 48)
                title_font = ImageFont.truetype("arial.ttf", title_font_size)
                text_font = ImageFont.truetype("arial.ttf", text_font_size)
            except:
                title_font = ImageFont.load_default()
                text_font = ImageFont.load_default()
            
            # Add title
            title = "STORYBOARD PREVIEW"
            try:
                title_bbox = draw.textbbox((0, 0), title, font=title_font)
                title_width = title_bbox[2] - title_bbox[0]
                title_x = (width - title_width) // 2
            except:
                title_x = width // 2 - len(title) * 6
            
            draw.text((title_x, 80), title, fill='#495057', font=title_font)
            
            # Format and draw scene text
            words = text.split()
            lines = []
            current_line = ""
            max_chars = max(30, width // 25)
            
            for word in words:
                test_line = current_line + (" " if current_line else "") + word
                if len(test_line) <= max_chars:
                    current_line = test_line
                else:
                    if current_line:
                        lines.append(current_line)
                    current_line = word
            
            if current_line:
                lines.append(current_line)
            
            # Draw text lines (max 10 lines)
            max_lines = min(10, (height - 300) // 30)
            lines = lines[:max_lines]
            
            start_y = height // 2 - (len(lines) * 15)
            for i, line in enumerate(lines):
                try:
                    line_bbox = draw.textbbox((0, 0), line, font=text_font)
                    line_width = line_bbox[2] - line_bbox[0]
                    x = (width - line_width) // 2
                except:
                    x = width // 2 - len(line) * 5
                
                y = start_y + i * 30
                draw.text((x, y), line, fill='#212529', font=text_font)
            
            # Add footer
            footer = "AI image will appear here"
            try:
                footer_bbox = draw.textbbox((0, 0), footer, font=text_font)
                footer_width = footer_bbox[2] - footer_bbox[0]
                footer_x = (width - footer_width) // 2
            except:
                footer_x = width // 2 - len(footer) * 5
            
            draw.text((footer_x, height - 100), footer, fill='#6c757d', font=text_font)
            
            # Add camera icon
            icon_size = max(24, width // 40)
            icon_x = width - icon_size - 40
            icon_y = height - icon_size - 40
            
            # Simple camera outline
            draw.rectangle([icon_x, icon_y, icon_x + icon_size, icon_y + icon_size], 
                          outline='#adb5bd', width=2)
            center_x = icon_x + icon_size // 2
            center_y = icon_y + icon_size // 2
            radius = icon_size // 4
            draw.ellipse([center_x - radius, center_y - radius, 
                         center_x + radius, center_y + radius], 
                        outline='#adb5bd', width=2)
            
            # Convert to base64
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
            return img_str
            
        except Exception as e:
            logger.error(f"Placeholder generation error: {e}")
            # Return minimal base64 PNG as fallback
            return base64.b64encode(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x00\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82').decode('utf-8')

def parse_script_to_scenes(script_text: str) -> list:
    """Parse script text into individual scenes for storyboard generation"""
    if not script_text:
        return []
    
    scenes = []
    
    # Split by double newlines first, then single newlines
    raw_scenes = script_text.strip().split('\n\n')
    if len(raw_scenes) == 1:
        raw_scenes = script_text.strip().split('\n')
    
    # Clean up and process scenes
    scene_number = 1
    for raw_scene in raw_scenes:
        scene = raw_scene.strip()
        if scene and len(scene) > 10:  # Skip very short lines
            scenes.append({
                'scene_number': scene_number,
                'description': scene,
                'location': extract_location(scene),
                'time_of_day': extract_time_of_day(scene)
            })
            scene_number += 1
    
    return scenes

def extract_location(scene_text: str) -> str:
    """Extract location from scene text"""
    text_upper = scene_text.upper()
    if 'INT.' in text_upper:
        return 'Interior'
    elif 'EXT.' in text_upper:
        return 'Exterior'
    return 'Unknown'

def extract_time_of_day(scene_text: str) -> str:
    """Extract time of day from scene text"""
    text_upper = scene_text.upper()
    if 'DAY' in text_upper:
        return 'Day'
    elif 'NIGHT' in text_upper:
        return 'Night'
    elif 'MORNING' in text_upper:
        return 'Morning'
    elif 'EVENING' in text_upper:
        return 'Evening'
    return 'Unknown'

# Convenience functions for easy integration
def generate_single_image(prompt: str, provider: str = 'huggingface', config: dict = None, **kwargs) -> Dict[str, Any]:
    """
    Convenience function to generate a single image
    
    Args:
        prompt: Scene description
        provider: AI provider to use
        config: Dictionary with API keys
        **kwargs: Additional parameters
        
    Returns:
        Dict with generation results
    """
    generator = AIImageGenerator(config)
    return generator.generate_image(prompt, provider, **kwargs)

def generate_storyboard_images(script_text: str, provider: str = 'huggingface', config: dict = None, **kwargs) -> list:
    """
    Generate images for a complete storyboard from script text
    
    Args:
        script_text: Full script text
        provider: AI provider to use
        config: Dictionary with API keys
        **kwargs: Additional parameters
        
    Returns:
        List of scenes with generated images
    """
    generator = AIImageGenerator(config)
    scenes = parse_script_to_scenes(script_text)
    
    results = []
    for scene in scenes:
        logger.info(f"Generating image for scene {scene['scene_number']}: {scene['description'][:50]}...")
        
        result = generator.generate_image(
            prompt=scene['description'],
            provider=provider,
            **kwargs
        )
        
        # Combine scene info with generation result
        scene_result = {**scene, **result}
        results.append(scene_result)
        
        # Small delay to avoid rate limits
        time.sleep(0.5)
    
    return results