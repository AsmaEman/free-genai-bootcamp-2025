from youtube_transcript_api import YouTubeTranscript
import os

class ArabicTranscriptExtractor:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.transcript_dir = os.path.join(self.base_dir, 'backend', 'data', 'transcripts')
        os.makedirs(self.transcript_dir, exist_ok=True)

    def extract_transcript(self, video_id):
        try:
            # Get transcript with Arabic language preference
            transcript = YouTubeTranscript.get_transcript(
                video_id, 
                languages=['ar']  # Specify Arabic language
            )
            
            # Format the transcript
            formatted_transcript = self.format_transcript(transcript)
            
            # Save transcript
            self.save_transcript(video_id, formatted_transcript)
            
            return formatted_transcript
            
        except Exception as e:
            print(f"Error extracting transcript: {str(e)}")
            return None

    def format_transcript(self, transcript):
        # Combine transcript pieces into coherent segments
        text_segments = []
        current_segment = []
        
        for entry in transcript:
            text = entry['text']
            # Check if it's end of sentence or long enough segment
            if text.endswith(('.', '؟', '!', '،')):
                current_segment.append(text)
                text_segments.append(' '.join(current_segment))
                current_segment = []
            else:
                current_segment.append(text)
                
        return text_segments

    def save_transcript(self, video_id, transcript):
        file_path = os.path.join(self.transcript_dir, f"{video_id}.txt")
        with open(file_path, 'w', encoding='utf-8') as f:
            for segment in transcript:
                f.write(f"{segment}\n")

# Example usage:
def main():
    # Example Arabic YouTube videos for language learning
    arabic_videos = [
        {
            'id': 'VIDEO_ID_1',  # Replace with actual Arabic video IDs
            'title': 'Basic Arabic Conversation',
            'topic': 'Daily Conversation'
        },
        {
            'id': 'VIDEO_ID_2',
            'title': 'Shopping in Arabic',
            'topic': 'Shopping'
        }
    ]
    
    extractor = ArabicTranscriptExtractor()
    
    for video in arabic_videos:
        print(f"Extracting transcript for: {video['title']}")
        transcript = extractor.extract_transcript(video['id'])
        if transcript:
            print("Successfully extracted transcript")
            # Create practice questions from transcript
            questions = create_practice_questions(transcript, video['topic'])
            
def create_practice_questions(transcript, topic):
    """Convert transcript into practice questions"""
    questions = []
    
    for segment in transcript:
        # Create a question based on the segment
        question = {
            "Introduction": "Listen to this conversation",
            "Conversation": segment,
            "Question": "What is the main topic of this conversation?",
            "Options": [
                # Generate relevant options based on content
            ],
            "topic": topic
        }
        questions.append(question)
    
    return questions
