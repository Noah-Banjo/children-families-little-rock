import React, { useState } from 'react';
import './CitationModal.css';

const CitationModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const citationText = "Adebanjo, Oluseyi Noah. (2025). Preserving the Untold Stories: Leveraging Emerging Technologies (AI and Machine Learning) for Archiving Hidden Histories of Children and Families Impacted by the Little Rock School Integration Crisis [Master's thesis, University of Arkansas at Little Rock].";

  const handleCopy = () => {
    navigator.clipboard.writeText(citationText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="citation-modal-overlay" onClick={onClose}>
      <div className="citation-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="citation-modal-header">
          <h2>Cite This Work</h2>
          <button className="citation-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="citation-modal-body">
          <div className="citation-text">
            {citationText}
          </div>
          <button
            className="copy-citation-btn"
            onClick={handleCopy}
          >
            {copied ? '✓ Copied!' : 'Copy Citation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitationModal;
