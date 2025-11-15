const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes (must come BEFORE static file serving)
app.post('/api/chat', async (req, res) => {
  try {
    const { model, max_tokens, system, messages } = req.body;

    // Validate API key exists
    if (!process.env.REACT_APP_ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: 'API key not configured. Add REACT_APP_ANTHROPIC_API_KEY to environment variables.'
      });
    }

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: max_tokens || 1024,
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
    res.json(data);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    hasApiKey: !!process.env.REACT_APP_ANTHROPIC_API_KEY
  });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔑 API Key configured: ${!!process.env.REACT_APP_ANTHROPIC_API_KEY}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Serving React build from /build folder`);
  }
});
