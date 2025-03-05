# Use the official Python image
FROM python:3.9-slim as base

# Set the working directory
WORKDIR /app

# Copy the requirements files for all services
COPY speech_recognition_service/requirements.txt ./speech_recognition_service/requirements.txt
COPY text_generation_service/requirements.txt ./text_generation_service/requirements.txt
COPY tts_service/requirements.txt ./tts_service/requirements.txt
COPY orchestrator_service/requirements.txt ./orchestrator_service/requirements.txt

# Install dependencies for all services
RUN pip install --no-cache-dir -r ./speech_recognition_service/requirements.txt
RUN pip install --no-cache-dir -r ./text_generation_service/requirements.txt
RUN pip install --no-cache-dir -r ./tts_service/requirements.txt
RUN pip install --no-cache-dir -r ./orchestrator_service/requirements.txt

# Copy the application code for all services
COPY speech_recognition_service ./speech_recognition_service
COPY text_generation_service ./text_generation_service
COPY tts_service ./tts_service
COPY orchestrator_service ./orchestrator_service

# Expose the ports for all services
EXPOSE 5000 5001 5002 5003

# Command to run all services
CMD ["sh", "-c", "python orchestrator_service/app.py & python speech_recognition_service/app.py & python text_generation_service/app.py & python tts_service/app.py"]