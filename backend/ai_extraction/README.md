# AI Image Generator - Extracted from Django Storyboard Project

This is a portable AI image generation module extracted from the Django storyboard project. It can be used in any Python project to generate AI images using multiple providers.

## Features

- **Multiple AI Providers**: Hugging Face, OpenAI DALL-E, Stability AI
- **Automatic Fallbacks**: If one provider fails, it tries others
- **Professional Placeholders**: Generated when all AI providers fail
- **Storyboard Generation**: Parse scripts and generate images for scenes
- **Easy Integration**: Works with Django, Flask, FastAPI, or standalone scripts
- **Configurable**: Support for environment variables and config files

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure API Keys
Edit `config.py` with your API keys:

```python
AI_CONFIG = {
    'HF_TOKEN': 'your_huggingface_token',
    'OPENAI_API_KEY': 'your_openai_key',
    'STABILITY_API_KEY': 'your_stability_key',
}
```

### 3. Basic Usage

```python
from ai_image_generator import generate_single_image

result = generate_single_image(
    prompt="A knight in medieval armor",
    provider="huggingface"
)

if result['success']:
    # Save the image
    import base64
    with open("image.jpg", "wb") as f:
        f.write(base64.b64decode(result['image_data']))
```

### 4. Advanced Usage

```python
from ai_image_generator import AIImageGenerator
from config import AI_CONFIG

generator = AIImageGenerator(config=AI_CONFIG)

result = generator.generate_image(
    prompt="A futuristic cityscape",
    provider="huggingface",
    width=1024,
    height=768,
    style_prompt="cyberpunk, detailed, 4k"
)
```

### 5. Storyboard Generation

```python
from ai_image_generator import generate_storyboard_images

script = """
INT. OFFICE - DAY
A detective examines evidence at his desk.

EXT. STREET - NIGHT  
Rain falls as a mysterious figure watches.
"""

results = generate_storyboard_images(script, provider="huggingface")

for scene in results:
    print(f"Scene {scene['scene_number']}: {scene['success']}")
```

## API Reference

### AIImageGenerator Class

#### `__init__(config=None)`
Initialize the generator with API configuration.

#### `generate_image(prompt, provider='huggingface', **kwargs)`
Generate a single image.

**Parameters:**
- `prompt` (str): Description of the image to generate
- `provider` (str): AI provider ('huggingface', 'openai', 'stability', 'auto')
- `style_prompt` (str): Additional style instructions
- `width` (int): Image width in pixels
- `height` (int): Image height in pixels

**Returns:**
Dictionary with keys:
- `success` (bool): Whether generation succeeded
- `image_data` (str): Base64 encoded image data
- `provider` (str): Provider used
- `generation_time` (float): Time taken in seconds
- `error` (str): Error message if failed

### Convenience Functions

#### `generate_single_image(prompt, provider, config=None)`
Quick function to generate a single image.

#### `generate_storyboard_images(script_text, provider, config=None)`
Generate images for an entire storyboard from script text.

#### `parse_script_to_scenes(script_text)`
Parse script text into individual scenes.

## Configuration

### Environment Variables
You can set API keys as environment variables instead of hardcoding them:

```bash
export HF_TOKEN="your_huggingface_token"
export OPENAI_API_KEY="your_openai_key"
export STABILITY_API_KEY="your_stability_key"
```

### Provider Settings
Each provider has specific settings that can be customized:

```python
# Hugging Face
result = generator.generate_image(
    prompt="your prompt",
    provider="huggingface",
    steps=25,
    guidance_scale=8.0
)

# OpenAI DALL-E
result = generator.generate_image(
    prompt="your prompt", 
    provider="openai",
    model="dall-e-3",
    quality="hd",
    style="vivid"
)

# Stability AI
result = generator.generate_image(
    prompt="your prompt",
    provider="stability", 
    steps=30,
    cfg_scale=7,
    seed=42
)
```

## Web Framework Integration

### Django Example
```python
from django.http import JsonResponse
from ai_image_generator import AIImageGenerator

def generate_image_api(request):
    generator = AIImageGenerator()
    result = generator.generate_image(
        prompt=request.POST.get('prompt'),
        provider='huggingface'
    )
    return JsonResponse(result)
```

### Flask Example
```python
from flask import Flask, request, jsonify
from ai_image_generator import AIImageGenerator

app = Flask(__name__)
generator = AIImageGenerator()

@app.route('/generate', methods=['POST'])
def generate():
    result = generator.generate_image(
        prompt=request.json.get('prompt'),
        provider='huggingface'
    )
    return jsonify(result)
```

## Error Handling

The generator includes comprehensive error handling:

1. **Provider Fallbacks**: If one provider fails, it tries others
2. **Placeholder Generation**: Creates professional placeholders when all AI fails
3. **Detailed Error Messages**: Provides specific error information
4. **Timeout Handling**: Prevents hanging on slow API calls

## File Structure

```
ai_extraction/
├── ai_image_generator.py    # Main generator class
├── config.py               # Configuration and API keys
├── example_usage.py        # Usage examples
├── requirements.txt        # Dependencies
└── README.md              # This file
```

## Copying to Your Project

To use this in your `C:\Users\91961\Documents\aiml progress\zetpeak\src` directory:

1. Copy these files to your target directory:
   ```bash
   copy ai_image_generator.py "C:\Users\91961\Documents\aiml progress\zetpeak\src\"
   copy config.py "C:\Users\91961\Documents\aiml progress\zetpeak\src\"
   copy requirements.txt "C:\Users\91961\Documents\aiml progress\zetpeak\src\"
   ```

2. Install dependencies:
   ```bash
   cd "C:\Users\91961\Documents\aiml progress\zetpeak\src"
   pip install -r requirements.txt
   ```

3. Update config.py with your API keys

4. Import and use in your code:
   ```python
   from ai_image_generator import generate_single_image
   ```

## License

Extracted from Django storyboard project for reuse. MIT License.

## Support

For issues or questions, refer to the example_usage.py file for comprehensive usage examples.