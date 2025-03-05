import React, { useState } from 'react';

const VoiceInputHandler = () => {
    const [transcript, setTranscript] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');

    const startListening = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            setTranscript(result);
            sendToServer(result);
        };
        recognition.start();
    };

    const sendToServer = async (text) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: text }),
            });
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            setResponse(data.response);
        } catch (error) {
            setError('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={startListening}>Start Voice Input</button>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <p>Transcript: {transcript}</p>
            <p>Response: {response}</p>
        </div>
    );
};

export default VoiceInputHandler; 