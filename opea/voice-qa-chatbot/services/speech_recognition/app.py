# services/speech_recognition/app.py
from flask import Flask, request, jsonify
from utils.logger import setup_logger
from utils.monitoring import monitor_performance
from services.health_check import HealthCheck
import threading
from prometheus_client import start_http_server
import whisper

app = Flask(__name__)
logger = setup_logger('speech_recognition_service')

# Start Prometheus metrics server
metrics_port = 9090
threading.Thread(target=lambda: start_http_server(metrics_port)).start()

model = whisper.load_model("base")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify(HealthCheck.check_service_health())

@app.route('/api/transcribe', methods=['POST'])
@monitor_performance('speech_recognition_service')
def transcribe_audio():
    try:
        if 'audio' not in request.files:
            logger.error('No audio file provided')
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        
        logger.info('Processing audio file', extra={
            'filename': audio_file.filename,
            'content_type': audio_file.content_type
        })

        # Process audio with Whisper
        result = model.transcribe(audio_file)
        
        logger.info('Audio transcription completed', extra={
            'text_length': len(result['text'])
        })

        return jsonify({
            'text': result['text'],
            'language': result['language']
        })

    except Exception as e:
        logger.error(f'Transcription error: {str(e)}', extra={
            'error_type': type(e).__name__
        })
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
