import React, { useState, useEffect } from 'react';

const ChatBotPrompt = ({ onChatBotOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Check if prompt was already dismissed in this session
    const dismissed = sessionStorage.getItem('chatbotPromptDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Show prompt immediately with fade-in animation (0.5s)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleDismiss = (e) => {
    e.stopPropagation();
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

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className={`chatbot-prompt-widget ${isVisible ? 'visible' : ''}`}
      onClick={handleClick}
    >
      <div className="chatbot-prompt-icon">
        💬
      </div>
      <div className="chatbot-prompt-text">
        {isMobile ? "Chat with Dr. Archives for quick research" : "Got questions? Do a quick research by chatting with Dr. Archives"}
      </div>
      <button
        className="chatbot-prompt-close"
        onClick={handleDismiss}
        aria-label="Dismiss prompt"
      >
        ×
      </button>
      <div className="chatbot-prompt-arrow"></div>
    </div>
  );
};

export default ChatBotPrompt;
