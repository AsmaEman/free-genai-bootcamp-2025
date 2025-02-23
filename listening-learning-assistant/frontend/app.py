import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import streamlit as st
from backend.chat import BedrockChat

# Initialize BedrockChat
chat = BedrockChat()

# Set page configuration for RTL (Right-to-Left) support
st.set_page_config(
    page_title="مساعد تعلم اللغة العربية",  # Arabic Language Learning Assistant
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for RTL support and Arabic font
st.markdown("""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap');
        
        .stTextInput > div > div > input {
            direction: rtl;
            font-family: 'Noto Sans Arabic', sans-serif;
        }
        .stTextArea > div > div > textarea {
            direction: rtl;
            font-family: 'Noto Sans Arabic', sans-serif;
        }
        .css-1y4p8pa {
            direction: rtl;
            font-family: 'Noto Sans Arabic', sans-serif;
        }
    </style>
""", unsafe_allow_html=True)

st.title("Language Learning Assistant")

# Add language selection (optional)
language = st.sidebar.selectbox(
    "Select Language",
    ["Arabic", "English"],
    index=0
)

user_input = st.text_input(
    "You: " if language == "English" else "أدخل رسالتك: ",
    "",
    key="user_input"
)

if st.button("Send" if language == "English" else "إرسال"):
    if user_input:
        response = chat.generate_response(user_input)
        st.text_area(
            "Bot:" if language == "English" else "المساعد:",
            value=response,
            height=200,
            key="bot_response"
        )
    else:
        st.warning(
            "Please enter a message." if language == "English" else "الرجاء إدخال رسالة."
        )

# Add a footer with instructions
st.markdown("---")
if language == "English":
    st.markdown("""
        ### Instructions:
        - Type your question in Arabic or English
        - Click Send to get a response
        - The assistant will help you learn Arabic
    """)
else:
    st.markdown("""
        ### تعليمات:
        - اكتب سؤالك باللغة العربية أو الإنجليزية
        - انقر على إرسال للحصول على رد
        - سيساعدك المساعد في تعلم اللغة العربية
    """)
