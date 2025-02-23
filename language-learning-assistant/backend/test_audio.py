import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.audio_generator import AudioGenerator

# Test question data
test_question = {
    "Introduction": "استمع إلى المحادثة التالية وأجب عن السؤال",  # Listen to the following conversation and answer the question
    "Conversation": """
    الرجل: عفواً، هل تتوقف هذه الحافلة عند محطة المترو؟
    المرأة: نعم، المحطة القادمة هي محطة المترو
    الرجل: شكراً لك. كم من الوقت سيستغرق؟
    المرأة: حوالي خمس دقائق
    """,
    "Question": "كم من الوقت يستغرق الوصول إلى محطة المترو؟",  # How long does it take to reach the metro station?
    "Options": [
        "ثلاث دقائق",      # Three minutes
        "خمس دقائق",       # Five minutes
        "عشر دقائق",       # Ten minutes
        "خمسة عشر دقيقة"   # Fifteen minutes
    ]
}

def test_audio_generation():
    print("Initializing audio generator...")
    generator = AudioGenerator()
    
    print("\nParsing conversation...")
    parts = generator.parse_conversation(test_question)
    
    print("\nParsed conversation parts:")
    for speaker, text, gender in parts:
        print(f"Speaker: {speaker} ({gender})")
        print(f"Text: {text}")
        print("---")
    
    print("\nGenerating audio file...")
    audio_file = generator.generate_audio(test_question)
    print(f"Audio file generated: {audio_file}")
    
    return audio_file

if __name__ == "__main__":
    try:
        audio_file = test_audio_generation()
        print("\nTest completed successfully!")
        print(f"You can find the audio file at: {audio_file}")
    except Exception as e:
        print(f"\nError during test: {str(e)}")
