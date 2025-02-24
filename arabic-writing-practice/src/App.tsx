import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArabicDrawingCanvas from './components/ArabicDrawingCanvas';
import ArabicLearningModule from './components/ArabicLearningModule';
import ArabicTranscriptionExercise from './components/ArabicTranscriptionExercise';
import ProgressDashboard from './components/ProgressDashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<ArabicLearningModule />} /> {/* Default route */}
          <Route path="/learn" element={<ArabicLearningModule />} />
          <Route path="/write" element={<ArabicDrawingCanvas />} />
          <Route path="/read" element={<ArabicTranscriptionExercise />} />
          <Route path="/progress" element={<ProgressDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;