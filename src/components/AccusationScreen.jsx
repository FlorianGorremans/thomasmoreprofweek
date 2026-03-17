import React from 'react';
import './AccusationScreen.css';
import { speakDialogue } from '../utils/tts';

const AccusationScreen = ({ suspects, onAccuse, onCancel }) => {
  return (
    <div className="accusation-container">
      <div className="accusation-card">
        <h2>Make Your Accusation</h2>
        <p className="subtitle">
          You've reviewed the evidence and interrogated the suspects. 
          Who is the murderer?
        </p>

        <div className="suspect-grid">
          {suspects.map(suspect => (
            <div 
              key={suspect.id} 
              className="accuse-suspect-card"
              onMouseEnter={() => speakDialogue(suspect.name, suspect.voice)}
            >
              <div className="accuse-avatar">{suspect.avatar}</div>
              <h3>{suspect.name}</h3>
              <p>{suspect.role}</p>
              <button className="danger" onClick={() => onAccuse(suspect.id)}>
                Accuse {suspect.name}
              </button>
            </div>
          ))}
        </div>

        <button className="cancel-btn" onClick={onCancel}>
          Return to Investigation
        </button>
      </div>
    </div>
  );
};

export default AccusationScreen;
