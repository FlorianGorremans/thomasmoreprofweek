import React, { useState } from 'react';
import './DetectiveInterface.css';
import SuspectList from './SuspectList';
import EvidencePanel from './EvidencePanel';
import ChatSystem from './ChatSystem';

const DetectiveInterface = ({ suspects, victim, evidence, chatHistory, addChatMessage, murdererId }) => {
  const [activeSuspectId, setActiveSuspectId] = useState(suspects[0].id);

  const activeSuspect = suspects.find(s => s.id === activeSuspectId);

  return (
    <div className="detective-interface">
      <div className="sidebar left-sidebar">
        <h3>Suspects</h3>
        <SuspectList 
          suspects={suspects} 
          activeId={activeSuspectId} 
          onSelect={setActiveSuspectId} 
        />
      </div>

      <div className="main-chat-area">
        <ChatSystem 
          suspect={activeSuspect} 
          history={chatHistory[activeSuspectId] || []} 
          addMessage={(msg) => addChatMessage(activeSuspectId, msg)}
          isMurderer={activeSuspectId === murdererId}
          victimName={victim?.name}
          relationshipToVictim={activeSuspect?.relationshipToVictim}
        />
      </div>

      <div className="sidebar right-sidebar">
        <h3>Evidence</h3>
        <EvidencePanel evidence={evidence} />
      </div>
    </div>
  );
};

export default DetectiveInterface;
