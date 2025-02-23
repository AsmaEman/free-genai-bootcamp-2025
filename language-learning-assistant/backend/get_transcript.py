from youtube_transcript_api import YouTubeTranscriptApi
from typing import Optional, List, Dict
import os

class YouTubeTranscriptDownloader:
    def __init__(self, languages: List[str] = ["ar", "en"]):
        """
        Initialize the transcript downloader
        
        Args:
            languages (List[str]): List of language codes to try, in order of preference
                                 'ar' for Arabic, 'en' for English
        """
        self.languages = languages
        # Create transcripts directory if it doesn't exist
        os.makedirs("./transcripts", exist_ok=True)

    def extract_video_id(self, url: str) -> Optional[str]:
        """
        Extract video ID from YouTube URL
        
        Args:
            url (str): YouTube URL
            
        Returns:
            Optional[str]: Video ID if found, None otherwise
        """
        if "v=" in url:
            return url.split("v=")[1][:11]
        elif "youtu.be/" in url:
            return url.split("youtu.be/")[1][:11]
        return None

    def get_transcript(self, video_id: str) -> Optional[List[Dict]]:
        """
        Download YouTube Transcript
        
        Args:
            video_id (str): YouTube video ID or URL
            
        Returns:
            Optional[List[Dict]]: Transcript if successful, None otherwise
        """
        # Extract video ID if full URL is provided
        if "youtube.com" in video_id or "youtu.be" in video_id:
            video_id = self.extract_video_id(video_id)
            
        if not video_id:
            print("Error: Invalid video ID or URL")
            return None

        print(f"Downloading transcript for video ID: {video_id}")
        
        try:
            # Try to get transcript in preferred languages
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=self.languages)
            
            # Check if transcript is empty
            if not transcript:
                print("No transcript found")
                return None
                
            return transcript
            
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return None

    def save_transcript(self, transcript: List[Dict], filename: str) -> bool:
        """
        Save transcript to file
        
        Args:
            transcript (List[Dict]): Transcript data
            filename (str): Output filename
            
        Returns:
            bool: True if successful, False otherwise
        """
        filename = f"./transcripts/{filename}.txt"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                # Write transcript with timestamps
                for entry in transcript:
                    start_time = self._format_timestamp(entry['start'])
                    text = entry['text']
                    f.write(f"[{start_time}] {text}\n")
            return True
        except Exception as e:
            print(f"Error saving transcript: {str(e)}")
            return False

    def _format_timestamp(self, seconds: float) -> str:
        """
        Format timestamp from seconds to HH:MM:SS
        
        Args:
            seconds (float): Time in seconds
            
        Returns:
            str: Formatted time string
        """
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        seconds = int(seconds % 60)
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

def main(video_url: str, print_transcript: bool = False):
    """
    Main function to download and save transcript
    
    Args:
        video_url (str): YouTube video URL or ID
        print_transcript (bool): Whether to print the transcript to console
    """
    # Initialize downloader
    downloader = YouTubeTranscriptDownloader()
    
    # Get transcript
    transcript = downloader.get_transcript(video_url)
    
    if transcript:
        # Save transcript
        video_id = downloader.extract_video_id(video_url)
        if downloader.save_transcript(transcript, video_id):
            print(f"Transcript saved successfully to {video_id}.txt")
            
            if print_transcript:
                print("\nTranscript:")
                for entry in transcript:
                    time = downloader._format_timestamp(entry['start'])
                    print(f"[{time}] {entry['text']}")
        else:
            print("Failed to save transcript")
    else:
        print("Failed to get transcript")

if __name__ == "__main__":
    # Example usage
    video_url = "https://www.youtube.com/watch?v=iwDset20ADY&list=PLsr1ERsR7y1kPNrfbpljPRfu_pBvxYS1J"  # Replace with actual video URL
    main(video_url, print_transcript=True)
