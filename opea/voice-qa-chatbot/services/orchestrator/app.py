# services/orchestrator/app.py
from flask import Flask, request, jsonify
from utils.logger import setup_logger
from utils.monitoring import monitor_performance
from services.health_check import HealthCheck
import threading
from prometheus_client import start_http_server
import requests

app = Flask(__name__)
logger = setup_logger('orchestrator_service')

# Start Prometheus metrics server
metrics_port = 9090
threading.Thread(target=lambda: start_http_server(metrics_port)).start()

# Service URLs
SPEECH_RECOGNITION_URL = "http://speech_recognition:8000/api/transcribe"
TEXT_GENERATION_URL = "http://text_generation:8000/api/generate"
TTS_URL = "http://tts:8000/api/synthesize"

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify(HealthCheck.check_service_health())

@app.route('/api/ask', methods=['POST'])
@monitor_performance('orchestrator_service')
def process_request():
    try:
        logger.info('Processing new request')

        # Step 1: Speech Recognition
        if 'audio' in request.files:
            audio_file = request.files['audio']
            files = {'audio': (audio_file.filename, audio_file)}
            transcription_response = requests.post(SPEECH_RECOGNITION_URL, files=files)
            text_input = transcription_response.json()['text']
        else:
            text_input = request.json.get('text', '')

        # Step 2: Text Generation
        generation_response = requests.post(
            TEXT_GENERATION_URL,
            json={'text': text_input}
        )
        generated_text = generation_response.json()['generated_text']

        # Step 3: Text-to-Speech
        tts_response = requests.post(
            TTS_URL,
            json={'text': generated_text}
        )

        logger.info('Request processed successfully')

        return jsonify({
            'text': generated_text,
            'audio': tts_response.json()['audio']
        })

    except Exception as e:
        logger.error(f'Request processing error: {str(e)}', extra={
            'error_type': type(e).__name__
        })
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
