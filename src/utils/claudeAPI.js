/**
 * Claude API Integration for Dr. Archives Chatbot
 * Provides intelligent conversational responses using Claude AI
 */

/**
 * Sends a message to Claude API and gets an intelligent response
 * @param {string} userMessage - The user's question/message
 * @param {Array} families - Array of family data from the archive
 * @param {Array} stories - Array of story data from the archive
 * @param {Object} timelineData - Timeline events organized by year
 * @param {Array} conversationHistory - Recent messages for context (last 3-4 messages)
 * @returns {Promise<string>} - Claude's response text
 */
export const sendMessageToClaude = async (
  userMessage,
  families = [],
  stories = [],
  timelineData = {},
  conversationHistory = []
) => {
  try {
    // Create a concise summary of available archive data (optimize tokens)
    const familySummary = createFamilySummary(families);
    const timelineSummary = createTimelineSummary(timelineData);

    // Build the system prompt
    const systemPrompt = `You are Dr. Archives, the Family Stories Guide for the Little Rock School Integration Crisis digital archive (1957-1960).

ABOUT YOU:
You help users explore family experiences during the Little Rock integration crisis through personal stories, photographs, and documents from our archive.

YOUR KNOWLEDGE BASE:
You have access to detailed information about ${families.length} families affected by the integration crisis, including:
- The Little Rock Nine and their families
- Second-wave students (1959) and their families
- Siblings, parents, and extended family members
- Economic impacts, violence, daily life experiences
- Timeline of historical events from 1954-1960

AVAILABLE FAMILIES:
${familySummary}

KEY TIMELINE EVENTS:
${timelineSummary}

RESPONSE GUIDELINES:
1. Always cite specific families when answering (e.g., "According to Melba Pattillo Beals' family story...")
2. Be conversational but academically accurate
3. If information isn't in the archive, acknowledge the gap honestly
4. Distinguish between documented facts and interpretations
5. When asked about families, provide 2-3 sentence summaries (not full profiles)
6. Suggest related questions to help users explore further
7. IMPORTANT: Remind users that for academic research, they should verify responses against primary sources
8. Keep responses concise and engaging (2-4 paragraphs maximum)
9. Use the exact names and details from the archive provided

EXAMPLE RESPONSES:
- Question: "Tell me about Elizabeth Eckford"
  Response: "Elizabeth Eckford was one of the Little Rock Nine who integrated Central High in September 1957. She came from a working-class family of six children. On September 4, 1957, she became the most recognized face of the crisis when she walked alone to Central High and faced a violent mob - the iconic photograph of that moment was nominated for a Pulitzer Prize. Her mother was fired from her teaching job at the State School for the Blind because of Elizabeth's participation in integration. Would you like to know more about how the crisis affected Elizabeth's siblings or her family's economic struggles?"

TONE: Professional, warm, educational. You're a knowledgeable guide, not a robotic database.`;

    // Build conversation messages array
    const messages = buildConversationMessages(conversationHistory, userMessage);

    // API endpoint for Vercel serverless function
    // Works in both development and production
    const apiUrl = '/api/chat';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages
      })
    });

    // Check if request was successful
    if (!response.ok) {
      console.error('Claude API error:', response.status, response.statusText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse response
    const data = await response.json();

    // Extract text from Claude's response
    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text;
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from API');
    }

  } catch (error) {
    console.error('Error calling Claude API:', error);

    // Return user-friendly fallback message
    return "I'm having trouble connecting right now. Please try asking your question again, or explore the family profiles directly on the site. If the problem persists, you can browse the Timeline and Family Stories sections for detailed information.";
  }
};

/**
 * Creates a concise summary of families for the system prompt
 * @param {Array} families - Family data array
 * @returns {string} - Formatted summary
 */
const createFamilySummary = (families) => {
  if (!families || families.length === 0) {
    return 'Families are being loaded from the archive...';
  }

  const summaries = families.slice(0, 15).map(family => {
    const name = family.familyName || 'Unknown Family';
    const period = family.timePeriod || 'Unknown period';
    const children = family.childrenNames || '';
    const location = family.location || '';

    return `• ${name} (${period})${children ? ` - Children: ${children}` : ''}${location ? ` - ${location}` : ''}`;
  });

  return summaries.join('\n');
};

/**
 * Creates a concise summary of timeline events
 * @param {Object} timelineData - Timeline data organized by year
 * @returns {string} - Formatted summary
 */
const createTimelineSummary = (timelineData) => {
  if (!timelineData || Object.keys(timelineData).length === 0) {
    return 'Timeline events are being loaded...';
  }

  const keyEvents = [];

  // Extract major events (up to 10)
  Object.keys(timelineData).slice(0, 5).forEach(year => {
    const yearData = timelineData[year];
    if (yearData.historical && yearData.historical.length > 0) {
      // Get first 2 major events per year
      yearData.historical.slice(0, 2).forEach(event => {
        keyEvents.push(`• ${year}: ${event.title}`);
      });
    }
  });

  return keyEvents.join('\n') || 'Major events from 1954-1960 integration crisis';
};

/**
 * Builds the messages array for Claude API from conversation history
 * @param {Array} conversationHistory - Previous messages
 * @param {string} currentMessage - Current user message
 * @returns {Array} - Formatted messages array
 */
const buildConversationMessages = (conversationHistory, currentMessage) => {
  const messages = [];

  // Add recent conversation history (last 3-4 exchanges for context)
  const recentHistory = conversationHistory.slice(-6); // Last 6 messages = 3 exchanges

  recentHistory.forEach(msg => {
    if (msg.type === 'user') {
      messages.push({
        role: 'user',
        content: msg.message
      });
    } else if (msg.type === 'bot') {
      messages.push({
        role: 'assistant',
        content: msg.message
      });
    }
  });

  // Add current user message
  messages.push({
    role: 'user',
    content: currentMessage
  });

  return messages;
};

/**
 * Estimates token usage and cost for a conversation
 * @param {string} userMessage - User's message
 * @param {Array} conversationHistory - Recent messages
 * @returns {Object} - Estimation object with tokens and cost
 */
export const estimateTokenUsage = (userMessage, conversationHistory = []) => {
  // Rough estimation (1 token ≈ 4 characters)
  const systemPromptTokens = 500; // Approximate
  const contextTokens = Math.ceil(JSON.stringify(conversationHistory).length / 4);
  const userMessageTokens = Math.ceil(userMessage.length / 4);
  const responseTokens = 800; // Max we're allowing

  const totalTokens = systemPromptTokens + contextTokens + userMessageTokens + responseTokens;

  // Claude Sonnet pricing (as of 2025)
  // Input: $3 per million tokens
  // Output: $15 per million tokens
  const inputCost = ((systemPromptTokens + contextTokens + userMessageTokens) / 1000000) * 3;
  const outputCost = (responseTokens / 1000000) * 15;
  const totalCost = inputCost + outputCost;

  return {
    estimatedTokens: totalTokens,
    estimatedCost: totalCost.toFixed(6),
    breakdown: {
      systemPrompt: systemPromptTokens,
      context: contextTokens,
      userMessage: userMessageTokens,
      response: responseTokens
    }
  };
};

export default sendMessageToClaude;
