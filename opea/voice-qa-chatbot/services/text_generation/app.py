# services/text_generation/app.py
from flask import Flask, request, jsonify
from utils.logger import setup_logger
from utils.monitoring import monitor_performance
from services.health_check import HealthCheck
import threading
from prometheus_client import start_http_server
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)
logger = setup_logger('text_generation_service')

# Start Prometheus metrics server
metrics_port = 9090
threading.Thread(target=lambda: start_http_server(metrics_port)).start()

# Load model and tokenizer
model_name = "gpt2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify(HealthCheck.check_service_health())

@app.route('/api/generate', methods=['POST'])
@monitor_performance('text_generation_service')
def generate_text():
    try:
        data = request.get_json()
        input_text = data.get('text')
        
        if not input_text:
            logger.error('No input text provided')
            return jsonify({'error': 'No input text provided'}), 400

        logger.info('Generating response', extra={
            'input_length': len(input_text)
        })

        # Generate response
        inputs = tokenizer(input_text, return_tensors="pt")
        outputs = model.generate(
            inputs["input_ids"],
            max_length=100,
            num_return_sequences=1,
            pad_token_id=tokenizer.eos_token_id
        )
        response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

        logger.info('Response generated successfully', extra={
            'response_length': len(response_text)
        })

        return jsonify({'generated_text': response_text})

    except Exception as e:
        logger.error(f'Text generation error: {str(e)}', extra={
            'error_type': type(e).__name__
        })
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
