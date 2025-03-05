from flask import Flask, request, jsonify
import whisper
import os
import logging

app = Flask(__name__)
model = whisper.load_model("base")  # Load the Whisper model

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    audio_path = "temp_audio.wav"
    audio_file.save(audio_path)

    try:
        result = model.transcribe(audio_path)
        return jsonify({'transcript': result['text']})
    except Exception as e:
        logging.error(f"Error during transcription: {e}")
        return jsonify({'error': 'Transcription failed'}), 500
    finally:
        os.remove(audio_path)  # Clean up the temporary file

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True) 