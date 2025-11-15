import React, { useState, useCallback } from 'react';

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

  // Extract all timeline events into a flat array for searching
  const getAllTimelineEvents = useCallback(() => {
    const allEvents = [];
    Object.keys(timelineData).forEach(year => {
      if (timelineData[year].historical) {
        timelineData[year].historical.forEach(event => {
          allEvents.push({ ...event, year });
        });
      }
      if (timelineData[year].families) {
        timelineData[year].families.forEach(event => {
          allEvents.push({ ...event, year });
        });
      }
    });
    return allEvents;
  }, [timelineData]);

  // Intelligent keyword matching and response generation
  const generateResponse = useCallback((message) => {
    const lowerMessage = message.toLowerCase();

    // ===== FAMILY QUERIES =====

    // Elizabeth Eckford
    if (lowerMessage.includes('elizabeth') || lowerMessage.includes('eckford')) {
      const eckfordFamily = families.find(f =>
        f.familyName?.toLowerCase().includes('eckford') ||
        f.childrenNames?.toLowerCase().includes('elizabeth')
      );

      const eckfordEvents = getAllTimelineEvents().filter(e =>
        e.title?.toLowerCase().includes('elizabeth') ||
        e.title?.toLowerCase().includes('eckford')
      );

      let response = "Elizabeth Eckford was one of the Little Rock Nine, and her story is one of extraordinary courage. ";

      if (eckfordFamily) {
        response += `${eckfordFamily.description || ''} `;
      }

      if (eckfordEvents.length > 0) {
        response += `\n\nKey moments in her journey:\n`;
        eckfordEvents.forEach(event => {
          response += `• ${event.date}: ${event.description}\n`;
        });
      } else {
        response += "On September 4, 1957, she became the face of the integration crisis when she walked alone through an angry mob to Central High School. That iconic photograph captured a 15-year-old girl showing remarkable composure under extreme hatred.";
      }

      response += "\n\nWould you like to know more about the other families or that specific day in 1957?";
      return response;
    }

    // Melba Pattillo / Pattillo-Beals
    if (lowerMessage.includes('melba') || lowerMessage.includes('pattillo') || lowerMessage.includes('beals')) {
      const patilloFamily = families.find(f =>
        f.familyName?.toLowerCase().includes('pattillo') ||
        f.familyName?.toLowerCase().includes('beals') ||
        f.childrenNames?.toLowerCase().includes('melba')
      );

      let response = "Melba Pattillo Beals was one of the Little Rock Nine who endured daily harassment and violence inside Central High School. ";

      if (patilloFamily) {
        response += `${patilloFamily.description || ''} `;
      } else {
        response += "Her mother, Lois Pattillo, was a teacher who strongly supported integration despite the risks to her family. Melba required protection from the 101st Airborne Division just to attend school. ";
      }

      response += "\n\nShe later wrote 'Warriors Don't Cry,' a powerful memoir about her experiences. Her story shows the incredible psychological toll on these young students and their families.";
      response += "\n\nWould you like to explore more about the daily experiences of the Nine or their family support systems?";
      return response;
    }

    // Carlotta Walls
    if (lowerMessage.includes('carlotta') || lowerMessage.includes('walls') || lowerMessage.includes('lanier')) {
      const wallsFamily = families.find(f =>
        f.familyName?.toLowerCase().includes('walls') ||
        f.familyName?.toLowerCase().includes('lanier') ||
        f.childrenNames?.toLowerCase().includes('carlotta')
      );

      const wallsEvents = getAllTimelineEvents().filter(e =>
        e.title?.toLowerCase().includes('carlotta') ||
        e.title?.toLowerCase().includes('walls')
      );

      let response = "Carlotta Walls LaNier was the youngest of the Little Rock Nine and showed remarkable resilience. ";

      if (wallsFamily) {
        response += `${wallsFamily.description || ''} `;
      } else {
        response += "She completed all three years at Central High School (1957-1960) and became the first African American female to graduate from Central High. ";
      }

      if (wallsEvents.length > 0) {
        response += `\n\nKey events:\n`;
        wallsEvents.forEach(event => {
          response += `• ${event.date}: ${event.description}\n`;
        });
      } else {
        response += "\n\nHer family faced severe retaliation - their home was bombed in February 1960, just three months before her graduation. Despite this terror, she persevered and made history.";
      }

      response += "\n\nHer story demonstrates the extreme price families paid for integration.";
      return response;
    }

    // General family queries
    if (lowerMessage.includes('families') || lowerMessage.includes('how many families')) {
      let response = `Our archive currently documents ${families.length} families affected by the Little Rock School Integration Crisis. `;

      if (families.length > 0) {
        response += `\n\nFeatured families include:\n`;
        families.slice(0, 5).forEach(family => {
          response += `\n📍 ${family.familyName || 'Unknown Family'}\n`;
          response += `   Period: ${family.timePeriod || 'Unknown'}\n`;
          response += `   Location: ${family.location || 'Unknown'}\n`;
          if (family.childrenNames) {
            response += `   Children: ${family.childrenNames}\n`;
          }
          if (family.description) {
            response += `   ${family.description.substring(0, 150)}...\n`;
          }
        });

        if (families.length > 5) {
          response += `\n...and ${families.length - 5} more families in our archive.`;
        }
      } else {
        response += "We're actively collecting family stories to preserve these important histories. The three primary families we focus on are the Eckford, Pattillo-Beals, and Walls-LaNier families.";
      }

      response += "\n\nEach family has a unique story of courage. Which family would you like to learn more about?";
      return response;
    }

    // ===== TIMELINE / YEAR QUERIES =====

    // 1957 queries
    if (lowerMessage.includes('1957') || lowerMessage.includes('what happened')) {
      const events1957 = timelineData['1957'];

      let response = "1957 was the pivotal year of the Little Rock integration crisis. ";

      if (events1957 && events1957.historical) {
        response += "Here's what happened:\n\n";
        events1957.historical.forEach(event => {
          response += `📅 ${event.date}: ${event.title}\n   ${event.description}\n\n`;
        });
      } else {
        response += "In spring 1957, nine African American students were selected to integrate Central High School. Governor Faubus called the National Guard to block them on September 2nd. On September 4th, the Little Rock Nine attempted entry but were turned away by soldiers and angry mobs. After weeks of crisis, President Eisenhower deployed the 101st Airborne Division on September 24th, and the Nine finally entered school on September 25th under federal military protection.";
      }

      response += "\n\nThis was a defining moment in Civil Rights history. Would you like to know about specific events or the families' experiences during this time?";
      return response;
    }

    // September 4, 1957 - iconic day
    if (lowerMessage.includes('september 4') || lowerMessage.includes('sep 4') || lowerMessage.includes('first day')) {
      const events = getAllTimelineEvents().filter(e =>
        e.date?.includes('September 4')
      );

      let response = "September 4, 1957 was one of the most significant days in the crisis. ";

      if (events.length > 0) {
        events.forEach(event => {
          response += `${event.description} `;
        });
      } else {
        response += "The Little Rock Nine attempted to enter Central High School but were blocked by the Arkansas National Guard and violent mobs. Elizabeth Eckford, separated from the group due to a miscommunication, walked alone through the crowd in her carefully pressed dress - an image that became iconic of the Civil Rights Movement.";
      }

      response += "\n\nThe courage of these children and their families on this day cannot be overstated. They faced hatred with dignity.";
      return response;
    }

    // General timeline queries
    if (lowerMessage.includes('timeline') || lowerMessage.includes('when') || lowerMessage.includes('events')) {
      const years = Object.keys(timelineData).sort();

      let response = `Our interactive timeline spans ${years[0]} to ${years[years.length - 1]}, documenting both major historical events and family experiences.\n\n`;
      response += "Key periods:\n\n";

      years.forEach(year => {
        const yearData = timelineData[year];
        const eventCount = (yearData.historical?.length || 0) + (yearData.families?.length || 0);
        if (eventCount > 0) {
          response += `📅 ${year}: ${eventCount} documented events\n`;
          if (yearData.historical && yearData.historical.length > 0) {
            response += `   • ${yearData.historical[0].title}\n`;
          }
        }
      });

      response += "\n\nYou can explore the Timeline section to see how personal family stories connect to broader historical events. What specific year or event interests you?";
      return response;
    }

    // ===== TOPIC QUERIES =====

    // Integration experience
    if (lowerMessage.includes('integration') || lowerMessage.includes('school') || lowerMessage.includes('central high')) {
      const integrationEvents = getAllTimelineEvents().filter(e =>
        e.category === 'integration-attempt' ||
        e.category === 'integration-success'
      );

      let response = "The integration of Central High School was a multi-year struggle involving incredible courage from children and families. ";

      if (integrationEvents.length > 0) {
        response += "\n\nKey integration moments:\n\n";
        integrationEvents.slice(0, 5).forEach(event => {
          response += `• ${event.date} (${event.year}): ${event.title}\n  ${event.description}\n\n`;
        });
      }

      response += "These families faced daily violence, harassment, and threats. The children required military protection just to attend school. The cost to families was enormous - economically, emotionally, and physically.";
      return response;
    }

    // Little Rock Nine
    if (lowerMessage.includes('little rock nine') || lowerMessage.includes('the nine') || lowerMessage.includes('nine students')) {
      let response = "The Little Rock Nine were nine African American students who integrated Central High School in 1957:\n\n";
      response += "• Elizabeth Eckford\n• Melba Pattillo (Beals)\n• Carlotta Walls (LaNier)\n• Minnijean Brown\n• Terrance Roberts\n• Ernest Green\n• Gloria Ray (Karlmark)\n• Thelma Mothershed (Wair)\n• Jefferson Thomas\n\n";
      response += "Each faced extraordinary violence and hatred. Their families supported them through unimaginable challenges, including economic retaliation, threats, and social isolation.\n\n";
      response += "Our archive focuses particularly on the Eckford, Pattillo-Beals, and Walls-LaNier families. Which student's story would you like to explore?";
      return response;
    }

    // Children/kids focus
    if (lowerMessage.includes('children') || lowerMessage.includes('kids') || lowerMessage.includes('students')) {
      let response = "The children at the center of this crisis were teenagers - just 15-16 years old - who showed extraordinary courage. ";

      const childrenEvents = getAllTimelineEvents().filter(e =>
        e.category === 'family-experience'
      );

      if (childrenEvents.length > 0) {
        response += "\n\nTheir experiences included:\n\n";
        childrenEvents.forEach(event => {
          response += `• ${event.description}\n`;
        });
      } else {
        response += "They endured:\n\n";
        response += "• Daily physical and verbal abuse\n";
        response += "• Being kicked down stairs, tripped, and spat upon\n";
        response += "• Having acid thrown at them\n";
        response += "• Constant psychological warfare\n";
        response += "• Military escorts just to get to class\n";
      }

      response += "\n\nThese were children bearing the weight of history while trying to get an education. Their families had to make impossible choices about their safety.";
      return response;
    }

    // ===== HELP / NAVIGATION =====

    if (lowerMessage.includes('help') || lowerMessage.includes('can you') || lowerMessage.includes('what can')) {
      let response = "I'm Dr. Archives, and I specialize in the Little Rock School Integration Crisis. I can help you explore:\n\n";
      response += `📚 **Families** (${families.length} documented): Learn about the Eckford, Pattillo-Beals, and Walls-LaNier families\n\n`;
      response += `📅 **Timeline**: Explore events from 1954-1960, including major moments and family experiences\n\n`;
      response += `📖 **Stories** (${stories.length} accounts): Read individual narratives and documents\n\n`;
      response += "🎓 **The Little Rock Nine**: Understand each student's journey\n\n";
      response += "Try asking about:\n";
      response += "• Specific families (Elizabeth Eckford, Melba Pattillo, Carlotta Walls)\n";
      response += "• Years or dates (What happened in 1957?)\n";
      response += "• Topics (integration, children's experiences, family decisions)\n\n";
      response += "What would you like to discover?";
      return response;
    }

    // ===== OFF-TOPIC HANDLING =====

    // Check if completely off-topic (no relevant keywords)
    const relevantKeywords = [
      'little rock', 'integration', 'school', 'central high', 'civil rights',
      'family', 'families', 'student', 'children', 'nine', '1957', '1954',
      'elizabeth', 'eckford', 'melba', 'pattillo', 'carlotta', 'walls',
      'brown', 'faubus', 'eisenhower', 'arkansas', 'segregation'
    ];

    const hasRelevantKeyword = relevantKeywords.some(keyword =>
      lowerMessage.includes(keyword)
    );

    if (!hasRelevantKeyword && lowerMessage.length > 10) {
      let response = "I specialize in the Little Rock School Integration Crisis and the families affected by it. ";

      if (families.length > 0) {
        const randomFamily = families[Math.floor(Math.random() * families.length)];
        response += `Let me tell you about ${randomFamily.familyName || 'one of our documented families'}:\n\n`;
        response += `${randomFamily.description || 'This family experienced the integration crisis firsthand.'}\n\n`;
      } else {
        response += "Let me tell you about the Eckford family:\n\n";
        response += "Elizabeth Eckford was one of the Little Rock Nine. On September 4, 1957, she became the face of the integration crisis when she walked alone through a hostile mob to Central High School.\n\n";
      }

      response += "Is there something specific about the integration crisis you'd like to know?";
      return response;
    }

    // ===== DEFAULT RESPONSE =====

    let response = `I'd be happy to help you explore the Little Rock integration histories in our archive. `;

    if (families.length > 0) {
      response += `We have ${families.length} family stories and ${stories.length} individual accounts documenting this crucial period. `;
    }

    response += "\n\nYou can ask me about:\n";
    response += "• Specific families (Elizabeth Eckford, Melba Pattillo Beals, Carlotta Walls LaNier)\n";
    response += "• Historical events (What happened in 1957? Tell me about September 4th)\n";
    response += "• The integration experience\n";
    response += "• The Little Rock Nine\n\n";
    response += "What aspect of these histories interests you most?";

    return response;
  }, [families, stories, timelineData, getAllTimelineEvents]);

  // Handle sending messages
  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim()) return;

    // Mark as interacted to hide quick questions
    setHasInteracted(true);

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: currentMessage,
    };

    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');

    // Add loading indicator
    const typingMessage = {
      id: Date.now() + 1,
      type: 'bot',
      message: 'Dr. Archives is thinking...',
      isTyping: true
    };
    setChatMessages(prev => [...prev, typingMessage]);

    // Simulate slight delay for natural feel
    setTimeout(() => {
      const response = generateResponse(messageToSend);

      // Remove typing indicator and add response
      setChatMessages(prev =>
        prev.filter(msg => !msg.isTyping).concat([{
          id: Date.now() + 2,
          type: 'bot',
          message: response,
        }])
      );
    }, 800);
  }, [currentMessage, setChatMessages, setCurrentMessage, generateResponse]);

  // Memoize quick suggestion handlers
  const handleSuggestionClick = useCallback((suggestion) => {
    setCurrentMessage(suggestion);
  }, [setCurrentMessage]);

  return (
    <div className="chatbot-container">
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="chatbot-toggle"
        >
          💬
        </button>
      )}

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
            <button onClick={() => setIsChatOpen(false)} className="close-btn">×</button>
          </div>

          {/* Disclaimer Banner */}
          <div className="chatbot-disclaimer-banner">
            <span className="disclaimer-icon">⚠️</span>
            <p className="disclaimer-text">
              <strong>Important Note:</strong> This chatbot does not replace traditional archival research or professional historians. Users are advised to verify chatbot responses against primary sources. The bot synthesizes information based on available data in this exhibit but cannot evaluate historical nuance or resolve interpretive ambiguities the way trained historians can. Use this as a starting point for further investigation.
            </p>
          </div>

          {/* Messages Area */}
          <div className="enhanced-chatbot-messages">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`enhanced-message ${msg.type}`}>
                <div className="message-content">
                  <p style={{ whiteSpace: 'pre-line' }}>{msg.message}</p>
                  <span className="message-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Suggestions - Hide after first interaction */}
          {!hasInteracted && (
            <div className="quick-suggestions">
              <p className="suggestions-label">Quick Questions:</p>
              <div className="suggestions-grid">
                <button
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick("Tell me about Elizabeth Eckford")}
                >
                  Tell me about Elizabeth Eckford
                </button>
                <button
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick("What happened in 1957?")}
                >
                  What happened in 1957?
                </button>
                <button
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick("Which families are documented here?")}
                >
                  Which families are documented?
                </button>
                <button
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick("How did integration affect children?")}
                >
                  How did integration affect children?
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="enhanced-chatbot-input">
            <div className="input-wrapper">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about families, events, or historical context..."
                className="enhanced-input"
                rows="2"
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                className="enhanced-send-btn"
              >
                <span className="send-icon">📤</span>
              </button>
            </div>
            <p className="ai-disclaimer">
              Dr. Archives specializes in Little Rock integration history from our archive
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

ChatBot.displayName = 'ChatBot';

export default ChatBot;
