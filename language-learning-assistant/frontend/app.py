import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import streamlit as st
from backend.chat import BedrockChat

# Initialize BedrockChat
chat = BedrockChat()

st.title("Language Learning Assistant")

user_input = st.text_input("You: ", "")

if st.button("Send"):
    if user_input:
        response = chat.generate_response(user_input)
        st.text_area("Bot:", value=response, height=200)
    else:
        st.warning("Please enter a message.")
