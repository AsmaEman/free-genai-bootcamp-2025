
# Arabic Language Learning Assistant

An AI-powered language learning application that helps users learn Arabic through interactive conversations, audio generation, and personalized feedback.

## Features

- **Interactive Conversations**: Engage in Arabic conversations with AI-powered responses
- **Audio Generation**: Text-to-speech functionality for Arabic language practice
- **Question Generation**: Dynamic generation of context-based questions
- **Progress Tracking**: Monitor your learning progress
- **YouTube Content Integration**: Learn from Arabic YouTube content
- **Vector Search**: Find similar questions and content for better learning

## Project Structure

├── backend/
│ ├── data/
│ │ ├── questions/
│ │ └── transcripts/
│ ├── get_transcript.py
│ ├── structured_data.py
│ ├── test_audio.py
│ └── transcript_extractor.py
├── frontend/
│ └── app.py
└── requirements.txt

Install dependencies

pip install -r requirements.txt

Configure AWS Credentials

export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION=""

Run the application

streamlit run frontend/app.py

Usage
Start Learning

Launch the application

Choose a learning topic

Engage in conversations

Practice pronunciation with audio


