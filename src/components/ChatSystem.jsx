import React, { useState, useRef, useEffect } from 'react';
import './ChatSystem.css';
import { generateAIResponse } from '../utils/aiSimulation';
import { speakDialogue } from '../utils/tts';

const ChatSystem = ({ suspect, history, addMessage, isMurderer, victimName, relationshipToVictim }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    // Add user message immediately
    const userMsg = { sender: 'player', text: inputText };
    addMessage(userMsg);

    const query = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Await the full response before doing anything else
      const responseText = await generateAIResponse(query, suspect, isMurderer, victimName, relationshipToVictim);
      addMessage({ sender: 'ai', text: responseText });
      // Only start TTS after the complete response is received
      speakDialogue(responseText, suspect.voice);
    } catch (err) {
      console.error('AI response error:', err);
      addMessage({ sender: 'ai', text: 'I have nothing to say about that.' });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!suspect) return <div className="chat-system empty">Select a suspect to interrogate.</div>;

  return (
    <div className="chat-system">
      <div className="chat-header">
        <div className="suspect-avatar small">{suspect.avatar}</div>
        <div className="chat-title">
          <h3>Interrogating: {suspect.name}</h3>
          <span className="status">Online</span>
        </div>
      </div>

      <div className="chat-messages">
        {history.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.sender}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper ai">
            <div className="message-bubble typing">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          placeholder={`Ask ${suspect.name} a question...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
        />
        <button className="primary" onClick={handleSend} disabled={isTyping || !inputText.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSystem;
