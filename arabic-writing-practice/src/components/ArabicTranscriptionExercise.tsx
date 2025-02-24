import React, { useState } from 'react';

const ArabicTranscriptionExercise = () => {
  const [userInput, setUserInput] = useState('');
  const arabicCharacter = 'ب'; // Example character

  const handleSubmit = () => {
    // Validate user input against the arabicCharacter
    // Provide feedback
  };

  return (
    <div>
      <h2>Transcribe the Character</h2>
      <p>{arabicCharacter}</p>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type the transliteration"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ArabicTranscriptionExercise; 