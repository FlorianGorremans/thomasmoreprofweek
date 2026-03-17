import React, { useState, useEffect } from 'react';
import './StorySetup.css';
import { speakDialogue } from '../utils/tts';

const StorySetup = ({ onStart, victim }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleStart = () => {
    const trimmedKey = apiKey.trim();
    if (trimmedKey) {
      localStorage.setItem('gemini_api_key', trimmedKey);
      console.log('[AI] API key saved to localStorage.');
    } else {
      localStorage.removeItem('gemini_api_key');
      console.warn('[AI] No API key provided — AI responses will not be available.');
    }
    onStart();
  };
  return (
    <div className="story-setup-container">
      <div className="story-card">
        <h2>Case File: The Silicon Valley Murder</h2>
        
        <div className="story-details">
          <div className="detail-item">
            <strong>Victim:</strong> <span 
              className="hover-speak" 
              onMouseEnter={() => speakDialogue(victim.name, victim.voice)}
            >{victim.name}</span>, {victim.role}.
          </div>
          <div className="detail-item">
            <strong>Location:</strong> The penthouse office, SynapseTech Headquarters.
          </div>
          <div className="detail-item">
            <strong>Time of Death:</strong> Approximately 11:30 PM last night.
          </div>
        </div>

        <div className="story-description">
          <p>
            {victim.name} was found dead in his office, killed with a ceremonial letter opener 
            that usually sits on his desk. The security system was bypassed, but the killer 
            left behind subtle traces. 
          </p>
          <p>
            You are the lead detective on this case. There are three primary suspects who were 
            in or around the building at the time. You must interrogate them, review the evidence, 
            and uncover who is lying.
          </p>
          <p className="warning">
            Note: The murderer will try to deflect and defend themselves. Press them on specific 
            evidence or motives to see how their story holds up.
          </p>
        </div>

        <div className="api-setup">
          <h4>AI Interrogation Settings</h4>
          <p className="hint">Enter an OpenRouter API Key to enable dynamic AI suspect responses. Your key is only stored locally in your browser.</p>
          <input 
            type="password" 
            placeholder="OpenRouter API Key (optional)" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
          />
        </div>

        <button className="primary start-btn" onClick={handleStart}>
          Begin Investigation
        </button>
      </div>
    </div>
  );
};

export default StorySetup;
