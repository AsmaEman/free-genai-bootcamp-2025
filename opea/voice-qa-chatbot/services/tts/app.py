# services/tts/app.py
from flask import Flask, request, jsonify
from utils.logger import setup_logger
from utils.monitoring import monitor_performance
from services.health_check import HealthCheck
import threading
from prometheus_client import start_http_server
from transformers import SpeechT5Processor, SpeechT5ForTextToSpeech
import torch

app = Flask(__name__)
logger = setup_logger('tts_service')

# Start Prometheus metrics server
metrics_port = 9090
threading.Thread(target=lambda: start_http_server(metrics_port)).start()

# Load TTS model
processor = SpeechT5Processor.from_pretrained("microsoft/speecht5_tts")
model = SpeechT5ForTextToSpeech.from_pretrained("microsoft/speecht5_tts")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify(HealthCheck.check_service_health())

@app.route('/api/synthesize', methods=['POST'])
@monitor_performance('tts_service')
def synthesize_speech():
    try:
        data = request.get_json()
        text = data.get('text')
        
        if not text:
            logger.error('No input text provided')
            return jsonify({'error': 'No input text provided'}), 400

        logger.info('Synthesizing speech', extra={
            'text_length': len(text)
        })

        # Process text to speech
        inputs = processor(text=text, return_tensors="pt")
        speech = model.generate_speech(inputs["input_ids"], vocoder=None)
        
        # Convert to audio file format
        # (Implementation depends on specific requirements)

        logger.info('Speech synthesis completed', extra={
            'audio_length': len(speech)
        })

        return jsonify({'audio': speech.tolist()})

    except Exception as e:
        logger.error(f'Speech synthesis error: {str(e)}', extra={
            'error_type': type(e).__name__
        })
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
