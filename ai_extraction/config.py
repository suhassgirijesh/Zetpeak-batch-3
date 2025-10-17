# Configuration for AI Image Generation
# Copy your API keys here or set as environment variables

AI_CONFIG = {
    # Your API keys from the original project
    # IMPORTANT: Never commit real API keys! Use environment variables instead.
    'HF_TOKEN': 'your_huggingface_token_here',  # Get from https://huggingface.co/settings/tokens
    'HUGGINGFACE_API_KEY': 'your_huggingface_token_here',
    'OPENAI_API_KEY': 'your_openai_api_key_here',
    'STABILITY_API_KEY': 'your_stability_api_key_here',
    'REPLICATE_API_TOKEN': 'your_replicate_api_token_here',
    
    # Default settings
    'DEFAULT_PROVIDER': 'huggingface',
    'DEFAULT_WIDTH': 1024,
    'DEFAULT_HEIGHT': 1024,
    'STYLE_PROMPT': 'professional storyboard illustration, cinematic style, detailed',
    
    # Provider-specific settings
    'HUGGINGFACE_SETTINGS': {
        'steps': 20,
        'guidance_scale': 7.5,
    },
    'OPENAI_SETTINGS': {
        'model': 'dall-e-3',
        'quality': 'standard',
        'style': 'vivid',
    },
    'STABILITY_SETTINGS': {
        'steps': 20,
        'cfg_scale': 7,
        'seed': 0,
    },
    'REPLICATE_SETTINGS': {
        'steps': 20,
        'guidance_scale': 7.5,
    }
}

# Environment variable names (alternative to hardcoded keys above)
ENV_VARS = {
    'HF_TOKEN': 'HF_TOKEN',
    'HUGGINGFACE_API_KEY': 'HUGGINGFACE_API_KEY', 
    'OPENAI_API_KEY': 'OPENAI_API_KEY',
    'STABILITY_API_KEY': 'STABILITY_API_KEY',
    'REPLICATE_API_TOKEN': 'REPLICATE_API_TOKEN'
}