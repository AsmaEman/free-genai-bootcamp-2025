from flask import Flask, request, send_file, jsonify
from transformers import pipeline
import tempfile
import logging

app = Flask(__name__)
tts = pipeline('text-to-speech', model='Speech-T5')

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.route('/api/synthesize', methods=['POST'])
def synthesize():
    text = request.json['text']
    try:
        audio = tts(text)
        
        # Save audio to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            tmp_file.write(audio['audio'])
            tmp_file_path = tmp_file.name

        return send_file(tmp_file_path, mimetype='audio/wav')
    except Exception as e:
        logging.error(f"Error during TTS synthesis: {e}")
        return jsonify({'error': 'Text-to-speech synthesis failed'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True) 