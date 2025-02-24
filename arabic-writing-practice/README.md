Arabic Writing Practice App
Overview
The Arabic Writing Practice App is an interactive application designed to help users learn and practice writing Arabic characters. The app features various modes for learning characters, practicing writing, and recognizing characters through transliteration exercises. It is built using React and Vite for a fast and responsive user experience.
Features
Learn Arabic Characters: Interactive display of Arabic letters with audio pronunciation and stroke order animations.
Drawing Practice: Users can draw Arabic characters on a canvas with real-time feedback.
Transliteration Exercises: Users can practice transliterating Arabic characters with multiple-choice questions.
Progress Tracking: Monitor user progress and accuracy rates.
Responsive Design: Fully compatible with both desktop and mobile devices.
Technologies Used
React: A JavaScript library for building user interfaces.
Vite: A build tool that provides a fast development environment.
TypeScript: A superset of JavaScript that adds static types.
@vitejs/plugin-react-swc: A Vite plugin for React that uses SWC for faster builds.
React Router: For handling routing within the application.
TensorFlow.js: For implementing real-time OCR (Optical Character Recognition).
Setup Instructions
 Install Vite Plugin:
If you encounter issues with the Vite plugin, ensure you have the correct version:
Project Structure
Component Descriptions
1. App.tsx
The main application component that sets up routing for the application. It defines the routes for different modules of the app.
2. ArabicDrawingCanvas.tsx
This component allows users to draw Arabic characters on an HTML5 canvas. It includes functionality for starting, drawing, and stopping the drawing process, as well as submitting the drawn character for OCR processing.
3. ArabicLearningModule.tsx
Displays a list of Arabic characters along with audio pronunciation. This module helps users learn the characters interactively.
4. ArabicTranscriptionExercise.tsx
Provides a transliteration exercise where users can see an Arabic character and type its transliteration. It validates the user input and provides feedback.
5. ProgressDashboard.tsx
Displays the user's progress in learning Arabic characters. It can show statistics such as accuracy rates and areas for improvement.
6. useOCR.ts
A custom hook that handles the OCR functionality using TensorFlow.js. It loads the model and processes the drawn character from the canvas.
Running the Application
1. Start the Development Server:
Open in Browser:
Navigate to http://localhost:3000 in your web browser to view the application.
Usage
Learn Characters: Navigate to /learn to view the Arabic characters and listen to their pronunciations.
Practice Writing: Go to /write to draw Arabic characters and submit them for recognition.
Transcription Exercise: Visit /read to practice transliterating Arabic characters.
View Progress: Check your progress at /progress.