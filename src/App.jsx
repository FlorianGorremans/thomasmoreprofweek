import React, { useState, useEffect } from 'react';
import './App.css';
import { suspectsData } from './data/suspects';
import { getEvidenceData } from './data/evidence';
import StorySetup from './components/StorySetup';
import DetectiveInterface from './components/DetectiveInterface';
import AccusationScreen from './components/AccusationScreen';
import ResultScreen from './components/ResultScreen';

function App() {
  const [phase, setPhase] = useState('SETUP'); // SETUP, INVESTIGATING, ACCUSING, RESULT
  
  // Initialize victim once at game start
  const [victim] = useState(() => suspectsData[Math.floor(Math.random() * suspectsData.length)]);
  
  const [activeSuspects, setActiveSuspects] = useState([]);
  const [murdererId, setMurdererId] = useState(null);
  const [accusedId, setAccusedId] = useState(null);
  const [chatHistory, setChatHistory] = useState({});

  // Initialize game
  const startGame = () => {
    // Living suspects (everyone but the victim)
    const livingSuspects = suspectsData.filter(s => s.id !== victim.id);
    setActiveSuspects(livingSuspects);

    // Select murderer from living suspects
    const randomMurderer = livingSuspects[Math.floor(Math.random() * livingSuspects.length)];
    setMurdererId(randomMurderer.id);

    // Initialize empty chat history for living suspects
    const initialHistory = {};
    livingSuspects.forEach(s => {
      initialHistory[s.id] = [{
        sender: 'ai',
        text: `I am ${s.name}. I don't know what you expect to hear from me about ${victim.name}'s death.`
      }];
    });
    setChatHistory(initialHistory);
    setPhase('INVESTIGATING');
  };

  const handleAccusation = (suspectId) => {
    setAccusedId(suspectId);
    setPhase('RESULT');
  };

  const addChatMessage = (suspectId, message) => {
    setChatHistory(prev => ({
      ...prev,
      [suspectId]: [...prev[suspectId], message]
    }));
  };

  const restartGame = () => {
    setPhase('SETUP');
    setMurdererId(null);
    setAccusedId(null);
    setChatHistory({});
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Murder Mystery Detective</h1>
        {phase === 'INVESTIGATING' && (
          <button className="danger" onClick={() => setPhase('ACCUSING')}>
            Make Accusation
          </button>
        )}
      </header>

      <main className="app-main">
        {phase === 'SETUP' && <StorySetup onStart={startGame} victim={victim} />}

        {phase === 'INVESTIGATING' && (
          <DetectiveInterface
            suspects={activeSuspects}
            victim={victim}
            evidence={getEvidenceData(victim)}
            chatHistory={chatHistory}
            addChatMessage={addChatMessage}
            murdererId={murdererId}
          />
        )}

        {phase === 'ACCUSING' && (
          <AccusationScreen
            suspects={activeSuspects}
            onAccuse={handleAccusation}
            onCancel={() => setPhase('INVESTIGATING')}
          />
        )}

        {phase === 'RESULT' && (
          <ResultScreen
            accusedId={accusedId}
            murdererId={murdererId}
            suspects={suspectsData}
            onRestart={restartGame}
          />
        )}
      </main>
    </div>
  );
}

export default App;
