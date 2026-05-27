export const sendMessageToClaude = async (
  userMessage,
  families = [],
  stories = [],
  timelineData = {},
  conversationHistory = []
) => {
  try {
    const familySummary = createFamilySummary(families);
    const timelineSummary = createTimelineSummary(timelineData);

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
7. Keep responses concise and engaging (2-4 paragraphs maximum)
8. Use the exact names and details from the archive provided

FORMATTING RULES (strictly follow these):
- Write in plain prose. Do NOT use markdown — no **bold**, no *italics*, no ### headers.
- For lists, use a plain dash (- ) at the start of each item, nothing else.
- Never wrap words in asterisks or any other symbols for emphasis.
- Emphasize important names or phrases by position in the sentence, not by formatting characters.

EXAMPLE RESPONSES:
- Question: "Tell me about Elizabeth Eckford"
  Response: "Elizabeth Eckford was one of the Little Rock Nine who integrated Central High in September 1957. She came from a working-class family of six children. On September 4, 1957, she became the most recognized face of the crisis when she walked alone to Central High and faced a violent mob - the iconic photograph of that moment was nominated for a Pulitzer Prize. Her mother was fired from her teaching job at the State School for the Blind because of Elizabeth's participation in integration. Would you like to know more about how the crisis affected Elizabeth's siblings or her family's economic struggles?"

TONE: Professional, warm, educational. You're a knowledgeable guide, not a robotic database.`;

    const messages = buildConversationMessages(conversationHistory, userMessage);

    const response = await fetch('/api/chat', {
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

    if (!response.ok) {
      console.error('Claude API error:', response.status, response.statusText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text;
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from API');
    }

  } catch (error) {
    console.error('Error calling Claude API:', error);
    return "I'm having trouble connecting right now. Please try asking your question again, or explore the family profiles directly on the site. If the problem persists, you can browse the Timeline and Family Stories sections for detailed information.";
  }
};

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

const createTimelineSummary = (timelineData) => {
  if (!timelineData || Object.keys(timelineData).length === 0) {
    return 'Timeline events are being loaded...';
  }

  const keyEvents = [];

  Object.keys(timelineData).slice(0, 5).forEach(year => {
    const yearData = timelineData[year];
    if (yearData.historical && yearData.historical.length > 0) {
      yearData.historical.slice(0, 2).forEach(event => {
        keyEvents.push(`• ${year}: ${event.title}`);
      });
    }
  });

  return keyEvents.join('\n') || 'Major events from 1954-1960 integration crisis';
};

const buildConversationMessages = (conversationHistory, currentMessage) => {
  const messages = [];

  const recentHistory = conversationHistory.slice(-6);

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

  messages.push({
    role: 'user',
    content: currentMessage
  });

  return messages;
};

export default sendMessageToClaude;
