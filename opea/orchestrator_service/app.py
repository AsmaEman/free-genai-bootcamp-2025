from flask import Flask, request, jsonify
import requests
import logging
from flask_limiter import Limiter

app = Flask(__name__)
limiter = Limiter(app, key_func=lambda: 'global')

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.route('/api/ask', methods=['POST'])
@limiter.limit("5 per minute")  # Rate limiting
def ask():
    user_input = request.json['input']
    
    # Call Speech Recognition service
    try:
        transcribe_response = requests.post('http://localhost:5001/api/transcribe', files={'audio': user_input})
        transcript = transcribe_response.json()['transcript']
        
        # Call Text Generation service
        generate_response = requests.post('http://localhost:5002/api/generate', json={'text': transcript})
        generated_text = generate_response.json()['response']
        
        # Call TTS service
        tts_response = requests.post('http://localhost:5003/api/synthesize', json={'text': generated_text})
        
        return jsonify({'response': generated_text})
    except Exception as e:
        logging.error(f"Error in orchestrator: {e}")
        return jsonify({'error': 'Processing failed'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True) 