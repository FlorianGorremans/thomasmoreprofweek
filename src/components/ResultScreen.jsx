import React from 'react';
import './ResultScreen.css';
import { speakDialogue } from '../utils/tts';

const ResultScreen = ({ accusedId, murdererId, suspects, onRestart }) => {
  const isCorrect = accusedId === murdererId;
  const accusedSuspect = suspects.find(s => s.id === accusedId);
  const correctSuspect = suspects.find(s => s.id === murdererId);

  return (
    <div className="result-container">
      <div className={`result-card ${isCorrect ? 'success' : 'failure'}`}>
        <div className="result-icon">
          {isCorrect ? '✅' : '❌'}
        </div>
        
        <h2>{isCorrect ? 'Case Solved!' : 'Wrong Suspect!'}</h2>
        
        <div className="result-content">
          {isCorrect ? (
            <>
              <p className="verdict">
                You correctly identified <strong 
                  className="hover-speak" 
                  onMouseEnter={() => speakDialogue(correctSuspect.name, correctSuspect.voice)}
                >{correctSuspect.name}</strong> as the murderer!
              </p>
              <div className="explanation">
                <h3>The Truth:</h3>
                <p>
                  <span 
                    className="hover-speak" 
                    onMouseEnter={() => speakDialogue(correctSuspect.name, correctSuspect.voice)}
                  >{correctSuspect.name}</span> couldn't hide the inconsistencies any longer. 
                  Under intense pressure, they confessed. Motivated by 
                  "{correctSuspect.motive.toLowerCase()}", they slipped past security 
                  and did the deed. They thought they had the perfect alibi, but a good 
                  detective always sees through the lies.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="verdict">
                You accused <strong 
                  className="hover-speak" 
                  onMouseEnter={() => speakDialogue(accusedSuspect.name, accusedSuspect.voice)}
                >{accusedSuspect.name}</strong>, but they were innocent!
              </p>
              <div className="explanation">
                <h3>What actually happened:</h3>
                <p>
                  While you were busy interrogating the wrong person, the real killer, 
                  <strong 
                    className="hover-speak" 
                    onMouseEnter={() => speakDialogue(correctSuspect.name, correctSuspect.voice)}
                  > {correctSuspect.name}</strong>, managed to destroy the remaining 
                  evidence and flee the country. 
                </p>
                <p>
                  They were motivated by "{correctSuspect.motive.toLowerCase()}". 
                  The case is now cold, and your badge might be on the line.
                </p>
              </div>
            </>
          )}
        </div>

        <button className="primary restart-btn" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
