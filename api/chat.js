// Vercel Serverless Function for Claude API
// This handles chatbot requests on Vercel

// The key is read only on the server. ANTHROPIC_API_KEY is the preferred name.
// The old REACT_APP_ name still works so existing deployments keep running.
const getApiKey = () => process.env.ANTHROPIC_API_KEY || process.env.REACT_APP_ANTHROPIC_API_KEY;

// Limits so the endpoint cannot be used as a free general-purpose proxy.
const ALLOWED_MODELS = ['claude-sonnet-5'];
const MAX_TOKENS_CAP = 1500;
const MAX_SYSTEM_CHARS = 120000;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 8000;

// Optional. Set ALLOWED_ORIGINS to a comma-separated list to restrict browser access.
// When it is not set, behavior is unchanged.
const pickOrigin = (req) => {
  const list = (process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);
  if (list.length === 0) return '*';
  const origin = req.headers.origin;
  return list.includes(origin) ? origin : list[0];
};

const validMessages = (messages) =>
  Array.isArray(messages) &&
  messages.length > 0 &&
  messages.length <= MAX_MESSAGES &&
  messages.every(
    (m) =>
      m &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      m.content.length <= MAX_MESSAGE_CHARS
  );

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', pickOrigin(req));
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, max_tokens, system, messages } = req.body || {};

    // Validate API key exists
    const apiKey = getApiKey();
    if (!apiKey) {
      console.error('API key not configured');
      return res.status(500).json({
        error: 'API key not configured. Add ANTHROPIC_API_KEY to Vercel environment variables.'
      });
    }

    // Validate the request before spending any tokens
    const chosenModel = model || ALLOWED_MODELS[0];
    if (!ALLOWED_MODELS.includes(chosenModel)) {
      return res.status(400).json({ error: 'Model not allowed' });
    }
    if (system !== undefined && (typeof system !== 'string' || system.length > MAX_SYSTEM_CHARS)) {
      return res.status(400).json({ error: 'Invalid system prompt' });
    }
    if (!validMessages(messages)) {
      return res.status(400).json({ error: 'Invalid messages' });
    }

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: chosenModel,
        max_tokens: Math.min(Number(max_tokens) || 1024, MAX_TOKENS_CAP),
        system,
        messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return res.status(response.status).json({
        error: `API request failed: ${response.statusText}`
      });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
