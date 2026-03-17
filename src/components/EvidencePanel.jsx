import React from 'react';
import './EvidencePanel.css';

const EvidencePanel = ({ evidence }) => {
  return (
    <div className="evidence-panel">
      {evidence.map(item => (
        <div key={item.id} className="evidence-item">
          <div className="evidence-icon">{item.icon}</div>
          <div className="evidence-content">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EvidencePanel;
