import React from 'react';
import './SuspectList.css';
import { speakDialogue } from '../utils/tts';

const SuspectList = ({ suspects, activeId, onSelect }) => {
  return (
    <div className="suspect-list">
      {suspects.map(suspect => (
        <div 
          key={suspect.id} 
          className={`suspect-card ${activeId === suspect.id ? 'active' : ''}`}
          onClick={() => onSelect(suspect.id)}
          onMouseEnter={() => speakDialogue(suspect.name, suspect.voice)}
        >
          <div className="suspect-avatar">{suspect.avatar}</div>
          <div className="suspect-info">
            <h4>{suspect.name}</h4>
            <span className="suspect-role">{suspect.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuspectList;
