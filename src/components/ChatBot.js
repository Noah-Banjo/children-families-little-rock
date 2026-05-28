import React, { useState, useCallback, useEffect, useRef } from 'react';
import { sendMessageToClaude } from '../utils/claudeAPI';

const SendIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 1.5L7.5 9.5M15.5 1.5L10.5 15.5L7.5 9.5M15.5 1.5L1.5 6.5L7.5 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 3L3 11M3 3L11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const ChatBubbleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H3C1.9 3 1 3.9 1 5V15C1 16.1 1.9 17 3 17H7L11 21L15 17H19C20.1 17 21 16.1 21 15V5C21 3.9 20.1 3 19 3Z" fill="currentColor"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1.5L13 12.5H1L7 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M7 5.5V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="7" cy="10" r="0.7" fill="currentColor"/>
  </svg>
);

const quickQuestions = [
  "Tell me about Elizabeth Eckford",
  "What happened in September 1957?",
  "Which families are documented?",
  "How did integration affect children?"
];

const ChatBot = React.memo(({
  families,
  stories,
  timelineData,
  activeSection,
  chatMessages,
  setChatMessages,
  currentMessage,
  setCurrentMessage,
  isChatOpen,
  setIsChatOpen
}) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) setDisclaimerVisible(true);
  }, [isChatOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) scrollToBottom();
  }, [chatMessages, isChatOpen]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isChatOpen]);

  const hideDisclaimer = useCallback((e) => {
    e.stopPropagation();
    setDisclaimerVisible(false);
  }, []);

  const sendMessage = useCallback(async (messageText) => {
    if (isLoading) return;
    setHasInteracted(true);
    setIsLoading(true);

    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      message: messageText,
      timestamp: new Date().toISOString()
    }]);

    setChatMessages(prev => [...prev, {
      id: Date.now() + 1,
      type: 'bot',
      message: '',
      isTyping: true
    }]);

    try {
      const response = await sendMessageToClaude(messageText, families, stories, timelineData, chatMessages);
      setChatMessages(prev =>
        prev.filter(msg => !msg.isTyping).concat([{
          id: Date.now() + 2,
          type: 'bot',
          message: response,
          timestamp: new Date().toISOString()
        }])
      );
    } catch (error) {
      console.error('Error getting response from Claude:', error);
      setChatMessages(prev =>
        prev.filter(msg => !msg.isTyping).concat([{
          id: Date.now() + 2,
          type: 'bot',
          message: "I'm having trouble connecting right now. Please try again, or explore the family profiles directly on the site.",
          timestamp: new Date().toISOString(),
          isError: true
        }])
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, families, stories, timelineData, chatMessages, setChatMessages]);

  const handleSendMessage = useCallback(() => {
    if (!currentMessage.trim()) return;
    const text = currentMessage.trim();
    setCurrentMessage('');
    sendMessage(text);
  }, [currentMessage, setCurrentMessage, sendMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleSuggestionClick = useCallback((suggestion) => {
    sendMessage(suggestion);
  }, [sendMessage]);

  return (
    <div className="chatbot-container">
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="chatbot-toggle"
          aria-label="Open chat with Dr. Archives"
        >
          <ChatBubbleIcon />
        </button>
      )}

      {isChatOpen && (
        <div className="enhanced-chatbot" role="dialog" aria-label="Dr. Archives Chat">

          {/* Header */}
          <div className="enhanced-chatbot-header">
            <div className="enhanced-chatbot-avatar">🎓</div>
            <div className="chatbot-identity">
              <div className="chatbot-name-row">
                <h4>Dr. Archives</h4>
                <span className="chatbot-status-badge">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
              <p className="chatbot-subtitle">Your Personal Historian</p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="chatbot-close-btn"
              aria-label="Close chat"
            >
              <CloseIcon size={14} />
            </button>
          </div>

          {/* Disclaimer — flex row, no absolute positioning */}
          {disclaimerVisible && (
            <div className="chatbot-disclaimer-banner" role="note">
              <span className="disclaimer-icon-wrap">
                <WarningIcon />
              </span>
              <p className="disclaimer-text">
                <strong>Important:</strong> This chatbot does not replace professional historians or primary archival research. Use responses as a starting point for further investigation.
              </p>
              <button
                type="button"
                className="disclaimer-dismiss-btn"
                onClick={hideDisclaimer}
                aria-label="Dismiss disclaimer"
              >
                <CloseIcon size={11} />
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="enhanced-chatbot-messages" aria-live="polite" aria-label="Conversation">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`enhanced-message ${msg.type}${msg.isTyping ? ' typing' : ''}${msg.isError ? ' error' : ''}`}
              >
                <div className="message-content">
                  {msg.isTyping ? (
                    <div className="typing-indicator" aria-label="Dr. Archives is typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <p style={{ whiteSpace: 'pre-line' }}>{msg.message}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {!hasInteracted && (
            <div className="quick-suggestions">
              <p className="suggestions-label">Suggested questions</p>
              <div className="suggestions-list">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    className="suggestion-btn"
                    onClick={() => handleSuggestionClick(q)}
                    disabled={isLoading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="enhanced-chatbot-input">
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about families, events, or historical context…"
                className="enhanced-input"
                rows="1"
                disabled={isLoading}
                aria-label="Type your message"
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading}
                className="enhanced-send-btn"
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </div>
            <p className="ai-disclaimer-mini">
              Cross-reference with the{' '}
              <a href="/thesis/thesis.pdf" target="_blank" rel="noopener noreferrer" className="disclaimer-source-link">
                primary sources used in this research
              </a>
            </p>
          </div>

        </div>
      )}
    </div>
  );
});

ChatBot.displayName = 'ChatBot';

export default ChatBot;
