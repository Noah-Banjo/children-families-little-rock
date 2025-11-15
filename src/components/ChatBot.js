import React, { useState, useCallback, useEffect, useRef } from 'react';
import { sendMessageToClaude } from '../utils/claudeAPI';

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
  const [disclaimerCollapsed, setDisclaimerCollapsed] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load disclaimer state from localStorage
  useEffect(() => {
    const collapsed = localStorage.getItem('chatbotDisclaimerCollapsed') === 'true';
    setDisclaimerCollapsed(collapsed);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  // Auto-focus input when chat opens (mobile)
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      // Delay to ensure chat is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isChatOpen]);

  // Toggle disclaimer collapse
  const toggleDisclaimer = useCallback(() => {
    const newState = !disclaimerCollapsed;
    setDisclaimerCollapsed(newState);
    localStorage.setItem('chatbotDisclaimerCollapsed', String(newState));
  }, [disclaimerCollapsed]);

  // Send message handler - now uses Claude API
  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || isLoading) return;

    const messageToSend = currentMessage.trim();
    setCurrentMessage('');
    setHasInteracted(true);
    setIsLoading(true);

    // Add user message immediately
    const userMsg = {
      id: Date.now(),
      type: 'user',
      message: messageToSend,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Add typing indicator
    const typingMsg = {
      id: Date.now() + 1,
      type: 'bot',
      message: 'Dr. Archives is thinking...',
      isTyping: true
    };

    setChatMessages(prev => [...prev, typingMsg]);

    try {
      // Call Claude API with full context
      const response = await sendMessageToClaude(
        messageToSend,
        families,
        stories,
        timelineData,
        chatMessages
      );

      // Remove typing indicator and add Claude's response
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

      // Remove typing indicator and show error message
      setChatMessages(prev =>
        prev.filter(msg => !msg.isTyping).concat([{
          id: Date.now() + 2,
          type: 'bot',
          message: "I'm having trouble connecting right now. Please try asking your question again, or explore the family profiles directly on the site.",
          timestamp: new Date().toISOString(),
          isError: true
        }])
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentMessage, setChatMessages, setCurrentMessage, families, stories, timelineData, chatMessages, isLoading]);

  // Handle Enter key (submit) and Shift+Enter (new line)
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Quick suggestion click handler
  const handleSuggestionClick = useCallback(async (suggestion) => {
    if (isLoading) return;

    setCurrentMessage('');
    setHasInteracted(true);
    setIsLoading(true);

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      message: suggestion,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Add typing indicator
    const typingMsg = {
      id: Date.now() + 1,
      type: 'bot',
      message: 'Dr. Archives is thinking...',
      isTyping: true
    };

    setChatMessages(prev => [...prev, typingMsg]);

    try {
      const response = await sendMessageToClaude(
        suggestion,
        families,
        stories,
        timelineData,
        chatMessages
      );

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
          message: "I'm having trouble connecting right now. Please try again.",
          timestamp: new Date().toISOString(),
          isError: true
        }])
      );
    } finally {
      setIsLoading(false);
    }
  }, [setChatMessages, families, stories, timelineData, chatMessages, isLoading]);

  return (
    <div className="chatbot-container">
      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="chatbot-toggle"
          aria-label="Open chat with Dr. Archives"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="enhanced-chatbot">
          {/* Header */}
          <div className="enhanced-chatbot-header">
            <div className="chatbot-info">
              <div className="enhanced-chatbot-avatar">🎓</div>
              <div>
                <h4>Dr. Archives</h4>
                <p>Your Personal Historian</p>
              </div>
            </div>
            <div className="chatbot-status">
              <div className="status-indicator"></div>
              <span>Online</span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="chatbot-close-btn"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Disclaimer Banner - Collapsible */}
          <div className={`chatbot-disclaimer-banner ${disclaimerCollapsed ? 'collapsed' : ''}`}>
            {disclaimerCollapsed ? (
              <div className="disclaimer-collapsed" onClick={toggleDisclaimer}>
                <span className="disclaimer-icon">⚠️</span>
                <span className="disclaimer-collapsed-text">Disclaimer</span>
                <button
                  className="disclaimer-expand-btn"
                  aria-label="Expand disclaimer"
                >
                  ▼
                </button>
              </div>
            ) : (
              <>
                <button
                  className="disclaimer-collapse-btn"
                  onClick={toggleDisclaimer}
                  aria-label="Collapse disclaimer"
                >
                  ×
                </button>
                <span className="disclaimer-icon">⚠️</span>
                <p className="disclaimer-text">
                  <strong>Important Note:</strong> This chatbot does not replace traditional archival research or professional historians. Users are advised to verify chatbot responses against primary sources. The bot synthesizes information based on available data in this exhibit but cannot evaluate historical nuance or resolve interpretive ambiguities the way trained historians can. Use this as a starting point for further investigation.
                </p>
              </>
            )}
          </div>

          {/* Messages Area */}
          <div className="enhanced-chatbot-messages">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`enhanced-message ${msg.type} ${msg.isTyping ? 'typing' : ''}`}>
                <div className="message-content">
                  {msg.isTyping ? (
                    <div className="typing-indicator">
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

          {/* Quick Suggestions - Above input, hide after interaction */}
          {!hasInteracted && (
            <div className="quick-suggestions">
              <p className="suggestions-label">Quick Questions:</p>
              <div className="suggestions-grid">
                <button
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick("Tell me about Elizabeth Eckford")}
                  disabled={isLoading}
                >
                  Tell me about Elizabeth Eckford
                </button>
                <button
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick("What happened in September 1957?")}
                  disabled={isLoading}
                >
                  What happened in September 1957?
                </button>
                <button
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick("Which families are documented here?")}
                  disabled={isLoading}
                >
                  Which families are documented?
                </button>
                <button
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick("How did integration affect children?")}
                  disabled={isLoading}
                >
                  How did integration affect children?
                </button>
              </div>
            </div>
          )}

          {/* Input Area - Fixed at bottom */}
          <div className="enhanced-chatbot-input">
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about families, events, or historical context..."
                className="enhanced-input"
                rows="2"
                disabled={isLoading}
                aria-label="Type your message"
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading}
                className="enhanced-send-btn"
                aria-label="Send message"
              >
                <span className="send-icon">📤</span>
              </button>
            </div>
            <p className="ai-disclaimer-mini">
              Powered by Claude AI • Always verify against primary sources
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

ChatBot.displayName = 'ChatBot';

export default ChatBot;
