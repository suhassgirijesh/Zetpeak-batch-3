"""
Example usage of the AI Image Generator
Demonstrates different ways to use the extracted AI image generation functionality
"""

import os
import base64
from ai_image_generator import (
    AIImageGenerator, 
    generate_single_image, 
    generate_storyboard_images,
    parse_script_to_scenes
)
from config import AI_CONFIG

def example_1_simple_usage():
    """Example 1: Simple single image generation"""
    print("=== Example 1: Simple Image Generation ===")
    
    result = generate_single_image(
        prompt="A knight standing in front of a medieval castle at sunset",
        provider="huggingface",
        config=AI_CONFIG
    )
    
    if result['success']:
        print(f"✅ Image generated successfully!")
        print(f"Provider: {result['provider']}")
        print(f"Generation time: {result['generation_time']:.2f}s")
        
        # Save image to file
        save_base64_image(result['image_data'], "simple_example.jpg")
        print("💾 Image saved as 'simple_example.jpg'")
    else:
        print(f"❌ Generation failed: {result.get('error', 'Unknown error')}")
        if result.get('fallback'):
            print("🔄 Placeholder image was used as fallback")

def example_2_advanced_usage():
    """Example 2: Advanced usage with custom parameters"""
    print("\n=== Example 2: Advanced Image Generation ===")
    
    # Initialize generator with configuration
    generator = AIImageGenerator(config=AI_CONFIG)
    
    # Show available providers
    print(f"Available providers: {generator.get_available_providers()}")
    
    # Generate with custom parameters
    result = generator.generate_image(
        prompt="A futuristic cityscape with flying cars",
        provider="huggingface",
        style_prompt="cyberpunk, neon lights, detailed, 4k",
        width=1024,
        height=768,
        steps=25,
        guidance_scale=8.0
    )
    
    if result['success']:
        print(f"✅ Advanced generation successful!")
        print(f"Provider used: {result['provider']}")
        print(f"Generation time: {result['generation_time']:.2f}s")
        
        save_base64_image(result['image_data'], "advanced_example.jpg")
        print("💾 Image saved as 'advanced_example.jpg'")
    else:
        print(f"❌ Generation failed: {result.get('error', 'Unknown error')}")

def example_3_storyboard_generation():
    """Example 3: Generate complete storyboard from script"""
    print("\n=== Example 3: Storyboard Generation ===")
    
    script = """
    INT. DETECTIVE OFFICE - NIGHT
    A dimly lit office with rain pattering against the windows. Detective SARAH sits at her desk, examining evidence.

    CLOSE-UP - MYSTERIOUS LETTER
    A handwritten letter with cryptic symbols. Sarah's eyes narrow as she studies the strange markings.

    INT. DETECTIVE OFFICE - CONTINUOUS  
    Sarah picks up her phone with urgency. The desk lamp casts dramatic shadows across her face.

    EXT. CITY STREET - NIGHT
    Rain falls heavily on the empty street. Neon signs reflect in puddles as a figure watches from the shadows.
    """
    
    results = generate_storyboard_images(
        script_text=script,
        provider="huggingface",
        config=AI_CONFIG,
        style_prompt="film noir, cinematic, dramatic lighting"
    )
    
    print(f"Generated storyboard with {len(results)} scenes:")
    
    for i, scene in enumerate(results):
        status = "✅" if scene['success'] else "❌"
        print(f"{status} Scene {scene['scene_number']}: {scene['description'][:50]}...")
        print(f"   Location: {scene['location']}, Time: {scene['time_of_day']}")
        print(f"   Generation time: {scene['generation_time']:.1f}s")
        
        if scene['success']:
            filename = f"storyboard_scene_{scene['scene_number']}.jpg"
            save_base64_image(scene['image_data'], filename)
            print(f"   💾 Saved as {filename}")
        else:
            print(f"   ❌ Error: {scene.get('error', 'Unknown error')}")

def example_4_error_handling():
    """Example 4: Error handling and fallbacks"""
    print("\n=== Example 4: Error Handling ===")
    
    # Try with auto provider (will test all available providers)
    generator = AIImageGenerator(config=AI_CONFIG)
    
    result = generator.generate_image(
        prompt="A beautiful mountain landscape at sunrise",
        provider="auto"  # This will try all providers in order
    )
    
    if result['success']:
        print(f"✅ Image generated with provider: {result['provider']}")
    else:
        if result.get('fallback'):
            print("🔄 All AI providers failed, used placeholder fallback")
            print(f"Error was: {result['error']}")
            save_base64_image(result['image_data'], "fallback_example.jpg")
            print("💾 Placeholder saved as 'fallback_example.jpg'")

def example_5_batch_processing():
    """Example 5: Batch processing multiple prompts"""
    print("\n=== Example 5: Batch Processing ===")
    
    prompts = [
        "A spaceship landing on an alien planet",
        "A wizard casting a spell in a dark forest",
        "A robot working in a futuristic factory",
        "A pirate ship sailing through stormy seas"
    ]
    
    generator = AIImageGenerator(config=AI_CONFIG)
    
    for i, prompt in enumerate(prompts):
        print(f"Generating image {i+1}/{len(prompts)}: {prompt}")
        
        result = generator.generate_image(
            prompt=prompt,
            provider="huggingface",
            style_prompt="detailed illustration, concept art"
        )
        
        if result['success']:
            filename = f"batch_{i+1}_{prompt.split()[1]}.jpg"
            save_base64_image(result['image_data'], filename)
            print(f"   ✅ Saved as {filename}")
        else:
            print(f"   ❌ Failed: {result.get('error', 'Unknown error')}")

def save_base64_image(base64_data: str, filename: str):
    """Helper function to save base64 image data to file"""
    try:
        with open(filename, "wb") as f:
            f.write(base64.b64decode(base64_data))
    except Exception as e:
        print(f"Error saving image {filename}: {e}")

def display_usage_instructions():
    """Display usage instructions"""
    print("\n" + "="*60)
    print("AI IMAGE GENERATOR - USAGE INSTRUCTIONS")
    print("="*60)
    print("""
    This AI image generator can be used in multiple ways:

    1. SIMPLE USAGE:
       from ai_image_generator import generate_single_image
       result = generate_single_image("your prompt", "huggingface")

    2. ADVANCED USAGE:
       from ai_image_generator import AIImageGenerator
       generator = AIImageGenerator(config=your_config)
       result = generator.generate_image("prompt", "provider")

    3. STORYBOARD GENERATION:
       from ai_image_generator import generate_storyboard_images
       results = generate_storyboard_images("script text", "huggingface")

    4. CONFIGURATION:
       - Edit config.py with your API keys
       - Or set environment variables
       - Available providers: huggingface, openai, stability

    5. INTEGRATION:
       - Copy ai_image_generator.py and config.py to your project
       - Install dependencies: pip install Pillow requests openai
       - Import and use in your Python code

    For web framework integration (Django/Flask/FastAPI):
    - The generator returns JSON-compatible dictionaries
    - Base64 image data can be sent directly to frontend
    - Error handling is built-in with fallbacks
    """)

if __name__ == "__main__":
    print("🎨 AI Image Generator Examples")
    print("===============================")
    
    # Run all examples
    example_1_simple_usage()
    example_2_advanced_usage()
    example_3_storyboard_generation()
    example_4_error_handling()
    example_5_batch_processing()
    
    display_usage_instructions()
    
    print("\n✨ All examples completed!")
    print("Check the generated image files in the current directory.")