import React from 'react';

const ArabicLearningModule = () => {
  const arabicCharacters = [
    { letter: 'ا', audio: '/audio/a.mp3' },
    { letter: 'ب', audio: '/audio/b.mp3' },
    // Add more characters with audio files
  ];

  return (
    <div>
      <h2>Learn Arabic Characters</h2>
      <div className="character-grid">
        {arabicCharacters.map((char) => (
          <div key={char.letter} className="character-card">
            <h3>{char.letter}</h3>
            <audio controls>
              <source src={char.audio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArabicLearningModule; 