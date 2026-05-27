const FAMILY_PROFILES = `
THE LITTLE ROCK NINE FAMILIES (1957):

1. The Green Family
   - Student: Ernest Green (one of the Little Rock Nine)
   - Household: Ernest and his parents
   - Role in crisis: Ernest Green was the only senior among the Little Rock Nine and the first Black student to graduate from Central High School in May 1958.

2. The Pattillo-Beals Family
   - Student: Melba Pattillo Beals (one of the Little Rock Nine)
   - Siblings: younger brother Conrad Pattillo
   - Melba documented her experiences in the memoir "Warriors Don't Cry." The family faced relentless threats and economic retaliation. Her grandmother India inspired her resilience throughout the crisis.

3. The Walls-LaNier Family
   - Student: Carlotta Walls (one of the Little Rock Nine)
   - Siblings: younger sisters Tina and Loujuana Walls
   - Carlotta was the youngest of the Nine to enroll. The family's home was bombed in February 1960. She later documented her story in "A Mighty Long Way."

4. The Roberts Family
   - Student: Terrence Roberts (one of the Little Rock Nine)
   - Siblings: one of seven children
   - The family relocated to California after the crisis, where Terrence completed his senior year. His large sibling network meant the family bore collective pressure and upheaval from the integration effort.

5. The Brown-Trickey Family
   - Student: Minnijean Brown (one of the Little Rock Nine)
   - Siblings: younger sister Phyllis Brown
   - Minnijean was the only one of the Nine to be expelled mid-year (February 1958) after retaliating against persistent harassment. She finished the school year in New York. The family's experience highlighted the psychological toll on siblings who watched but could not intervene.

6. The Mothershed-Wair Family
   - Student: Thelma Mothershed (one of the Little Rock Nine)
   - Siblings: one of four sisters
   - Thelma had a heart condition, which made her participation especially precarious. Her three sisters navigated the community fallout while Thelma endured daily harassment inside Central High.

7. The Ray-Karlmark Family
   - Student: Gloria Ray (one of the Little Rock Nine)
   - Siblings: youngest of three children
   - Gloria was the youngest of three in her family. After the 1958-59 school year was cancelled (the Lost Year), she completed her education in Stockholm, Sweden, later becoming a tech entrepreneur.

8. The Thomas Family
   - Student: Jefferson Thomas (one of the Little Rock Nine)
   - Siblings: eldest of seven children
   - As the eldest of seven, Jefferson carried particular weight as the family's standard-bearer. He persevered through all three years at Central High despite daily harassment, graduating in 1960.

9. The Eckford Family
   - Student: Elizabeth Eckford (one of the Little Rock Nine)
   - Siblings: second eldest of six siblings
   - Elizabeth arrived alone at Central High on September 4, 1957, without knowledge of the group meeting point. The photograph of her facing the mob became one of the most iconic images of the civil rights era. Her mother was subsequently fired from her teaching position at the State School for the Blind. Elizabeth was the second eldest of six children, meaning the family's economic devastation affected multiple dependents.

SECOND-WAVE INTEGRATION FAMILIES (1959 — enrolled after the Lost Year):

10. The Hampton-Jordan Family
    - Student: Sybil Hampton (later Dr. Sybil Jordan Hampton)
    - Siblings: one brother
    - Sybil was among the students who integrated Hall High School in 1959 as part of the second wave. She later became a prominent educator and civic leader. The family's experience represents the continuation of the integration struggle beyond the Nine's story.

11. The Johnson Family
    - Student: Sandra Johnson
    - Sandra was part of the 1959 second-wave integration cohort. Her documentation contributes to the broader record of families who carried the integration effort forward after the Lost Year.

12. The Henderson Family
    - Student: Franklin Henderson
    - Franklin Henderson was among the second-wave students who integrated Little Rock schools in 1959. His family's story reflects the ongoing community support networks required to sustain integration across multiple years.

ADDITIONAL DOCUMENTED FAMILY (1957):

13. The Hill Family
    - Student: Jane Hill (1957)
    - Jane Hill's documentation provides an additional perspective on the 1957 cohort and the family experiences that surrounded the initial integration effort.
`;

export const sendMessageToClaude = async (
  userMessage,
  families = [],
  stories = [],
  timelineData = {},
  conversationHistory = []
) => {
  try {
    const timelineSummary = createTimelineSummary(timelineData);

    const systemPrompt = `You are Dr. Archives, the Family Stories Guide for the Little Rock School Integration Crisis digital archive (1957-1960).

ABOUT YOU:
You help users explore family experiences during the Little Rock integration crisis through personal stories, photographs, and documents from our archive. This archive is based on original research including oral history interviews, published memoirs, newspaper archives (Arkansas Gazette, Arkansas State Press, Detroit Tribune), and the Butler Center's archival collections.

DOCUMENTED FAMILY PROFILES:
This archive documents 13 families directly affected by the integration crisis. These are their stories:
${FAMILY_PROFILES}

KEY TIMELINE EVENTS:
${timelineSummary}

RESPONSE GUIDELINES:
1. Always cite specific families and individuals by name when answering.
2. Be conversational but academically accurate.
3. If a detail is not in the documented profiles above, acknowledge that honestly — do not invent details.
4. Distinguish between documented facts and interpretations.
5. When asked about a family, give a focused 2-3 paragraph response — not a full profile dump.
6. End responses with a natural follow-up suggestion to encourage further exploration.
7. Keep responses concise and engaging (2-4 paragraphs maximum).

FORMATTING RULES (strictly follow these):
- Write in plain prose. Do NOT use markdown — no **bold**, no *italics*, no ### headers.
- For lists, use a plain dash (- ) at the start of each item, nothing else.
- Never wrap words in asterisks or any other symbols for emphasis.
- Emphasize important names or phrases by position in the sentence, not by formatting characters.

TONE: Professional, warm, educational. You are a knowledgeable guide, not a robotic database.`;

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
    return "I'm having trouble connecting right now. Please try asking your question again, or explore the family profiles directly on the site.";
  }
};

const createTimelineSummary = (timelineData) => {
  if (!timelineData || Object.keys(timelineData).length === 0) {
    return 'Major events from 1954-1960 integration crisis';
  }

  const keyEvents = [];

  Object.keys(timelineData).slice(0, 5).forEach(year => {
    const yearData = timelineData[year];
    if (yearData.historical && yearData.historical.length > 0) {
      yearData.historical.slice(0, 2).forEach(event => {
        keyEvents.push(`- ${year}: ${event.title}`);
      });
    }
  });

  return keyEvents.join('\n') || 'Major events from 1954-1960 integration crisis';
};

const buildConversationMessages = (conversationHistory, currentMessage) => {
  const messages = [];

  conversationHistory.slice(-6).forEach(msg => {
    if (msg.type === 'user') {
      messages.push({ role: 'user', content: msg.message });
    } else if (msg.type === 'bot' && msg.message) {
      messages.push({ role: 'assistant', content: msg.message });
    }
  });

  messages.push({ role: 'user', content: currentMessage });

  return messages;
};

export default sendMessageToClaude;
