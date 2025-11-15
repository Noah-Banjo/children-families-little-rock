import React, { useState, useEffect } from 'react';

const ChatBotPrompt = ({ onChatBotOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if prompt was already dismissed in this session
    const dismissed = sessionStorage.getItem('chatbotPromptDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Show prompt after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('chatbotPromptDismissed', 'true');
  };

  const handleClick = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('chatbotPromptDismissed', 'true');
    if (onChatBotOpen) {
      onChatBotOpen();
    }
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="chatbot-prompt" onClick={handleClick}>
      <button className="prompt-dismiss" onClick={(e) => {
        e.stopPropagation();
        handleDismiss();
      }}>
        ×
      </button>
      <div className="prompt-content">
        <span className="prompt-icon">💬</span>
        <p className="prompt-text">
          <strong>Ask Dr. Archives!</strong> Click here to explore family stories with AI assistance
        </p>
      </div>
      <div className="prompt-arrow">↘️</div>
    </div>
  );
};

export default ChatBotPrompt;
