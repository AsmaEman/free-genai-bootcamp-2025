from flask import Flask, request, jsonify
from transformers import pipeline
import logging
import os
import redis

app = Flask(__name__)
generator = pipeline('text-generation', model='mistral-7B')

# Configure logging
logging.basicConfig(level=logging.INFO)

# Set up Redis for caching
cache = redis.Redis(host=os.getenv('REDIS_HOST', 'localhost'), port=6379, db=0)

@app.route('/api/generate', methods=['POST'])
def generate():
    input_text = request.json['text']
    
    # Check cache first
    cached_response = cache.get(input_text)
    if cached_response:
        return jsonify({'response': cached_response.decode('utf-8')})

    try:
        response = generator(input_text, max_length=50, num_return_sequences=1)
        generated_text = response[0]['generated_text']
        
        # Cache the response
        cache.set(input_text, generated_text)

        return jsonify({'response': generated_text})
    except Exception as e:
        logging.error(f"Error during text generation: {e}")
        return jsonify({'error': 'Text generation failed'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True) 