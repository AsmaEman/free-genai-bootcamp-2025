import boto3
import streamlit as st
from typing import Optional, Dict, Any

# Model ID - Using a model that handles Arabic well
MODEL_ID = "amazon.nova-micro-v1:0"

class BedrockChat:
    def __init__(self, model_id: str = MODEL_ID):
        """Initialize Bedrock chat client"""
        self.bedrock_client = boto3.client('bedrock-runtime', region_name="us-east-1")
        self.model_id = model_id
        
    def generate_response(self, message: str, inference_config: Optional[Dict[str, Any]] = None) -> Optional[str]:
        """Generate a response using Amazon Bedrock"""
        if inference_config is None:
            inference_config = {
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 2000,
                # Adding Arabic-specific parameters
                "stop_sequences": [".", "!", "?", "..."]  # Keep in English
            }

        # Prepare the conversation context
        system_context = "You are a friendly assistant helping with Arabic language learning."
        
        messages = [
            {
                "role": "system",
                "content": [{"text": system_context}]
            },
            {
                "role": "user",
                "content": [{"text": message}]
            }
        ]

        try:
            response = self.bedrock_client.converse(
                modelId=self.model_id,
                messages=messages,
                inferenceConfig=inference_config
            )
            return response['output']['message']['content'][0]['text']
            
        except Exception as e:
            st.error(f"Error generating response: {str(e)}")
            return None

    def validate_arabic_text(self, text: str) -> bool:
        """Validate if the text contains Arabic characters"""
        return any('\u0600' <= c <= '\u06FF' for c in text)

if __name__ == "__main__":
    chat = BedrockChat()
    print("Hello! I'm your AI assistant for Arabic language learning. How can I help you today?")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == '/exit':
            break
            
        # Validate Arabic input (optional)
        if not chat.validate_arabic_text(user_input):
            print("Note: No Arabic text found in your message")
            continue
            
        response = chat.generate_response(user_input)
        print("Assistant:", response)
