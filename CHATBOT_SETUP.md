# Dr. Archives Chatbot - Setup & Deployment Guide

## Overview
This chatbot uses a **single integrated server** approach that works for both local development and production deployment on Render.

## Architecture
- **Frontend**: React app (creates browser UI)
- **Backend**: Express server (handles Claude API calls securely)
- **Single Deployment**: One server serves both the React build AND API endpoints

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create or verify `.env` file in project root:
```
REACT_APP_ANTHROPIC_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE
```

**Get your API key:**
- Visit: https://console.anthropic.com/
- Sign up/login
- Go to API Keys section
- Create new key and copy it

### 3. Run Development Mode (Two Terminals)

**Terminal 1 - Backend Server:**
```bash
npm run server
```
- Runs on `http://localhost:3001`
- Handles `/api/chat` endpoint
- Proxies requests to Anthropic API

**Terminal 2 - React Development Server:**
```bash
npm start
```
- Runs on `http://localhost:3000`
- Hot-reloads on code changes
- Calls backend at `localhost:3001/api/chat`

### 4. Test the Chatbot
1. Open browser to `http://localhost:3000`
2. Click chat button (💬) in bottom-right corner
3. Try: "Tell me about Elizabeth Eckford"
4. Verify you get intelligent AI response

---

## Production Deployment on Render

### Step 1: Build the React App
```bash
npm run build
```
This creates an optimized production build in `/build` folder.

### Step 2: Test Production Locally (Optional)
```bash
npm run start:prod
```
- Serves the production build on port 3001
- Simulates production environment

### Step 3: Deploy to Render

#### A. Push Code to GitHub
```bash
git add .
git commit -m "Update chatbot for single-server deployment"
git push origin main
```

#### B. Configure Render Web Service

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com/
   - Select your service: `children-families-little-rock`

2. **Update Build Command:**
   ```
   npm install && npm run build
   ```

3. **Update Start Command:**
   ```
   node server.js
   ```

4. **Add Environment Variable:**
   - Go to "Environment" tab
   - Click "Add Environment Variable"
   - **Key:** `REACT_APP_ANTHROPIC_API_KEY`
   - **Value:** (paste your API key from .env file)
   - Click "Save Changes"

5. **Add NODE_ENV Variable:**
   - Click "Add Environment Variable" again
   - **Key:** `NODE_ENV`
   - **Value:** `production`
   - Click "Save Changes"

6. **Trigger Deployment:**
   - Render will automatically redeploy when you push to GitHub
   - Or click "Manual Deploy" → "Deploy latest commit"

### Step 4: Verify Live Site
1. Wait for deployment to complete (2-5 minutes)
2. Visit: `https://childrenandfamilieslr.com`
3. Click chat button (💬)
4. Test with: "Tell me about Elizabeth Eckford"
5. Verify AI response appears

---

## How It Works

### Development Mode:
```
Browser (localhost:3000)
  ↓
React Dev Server
  ↓ fetch('http://localhost:3001/api/chat')
  ↓
Express Server (localhost:3001)
  ↓ fetch('https://api.anthropic.com/v1/messages')
  ↓
Claude API
```

### Production Mode:
```
Browser (childrenandfamilieslr.com)
  ↓
Express Server serves React build files
  ↓ fetch('/api/chat') [same domain]
  ↓
Express Server /api/chat endpoint
  ↓ fetch('https://api.anthropic.com/v1/messages')
  ↓
Claude API
```

---

## Troubleshooting

### Chatbot says "I'm having trouble connecting"

**Check 1: API Key**
```bash
# In terminal where server is running:
# Look for this line:
🔑 API Key configured: true

# If it says false, check your .env file
```

**Check 2: Server Health**
```bash
# Test backend endpoint:
curl http://localhost:3001/api/health

# Should return:
{"status":"ok","environment":"development","hasApiKey":true}
```

**Check 3: Browser Console**
- Open browser DevTools (F12)
- Check Console tab for error messages
- Look for network errors to `/api/chat`

**Check 4: Network Tab**
- Open Network tab in DevTools
- Send a chat message
- Look for `/api/chat` request
- Check if it's failing (red) or succeeding (green)

### Production Issues

**Issue: Chatbot works locally but not on live site**

1. **Verify Environment Variable on Render:**
   - Go to Render Dashboard → Your Service → Environment
   - Confirm `REACT_APP_ANTHROPIC_API_KEY` exists
   - Confirm `NODE_ENV` = `production`

2. **Check Render Logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Look for this on startup:
     ```
     🚀 Server running on port 10000
     🔑 API Key configured: true
     🌐 Serving React build from /build folder
     ```

3. **Rebuild If Needed:**
   - Sometimes environment variables need a fresh deploy
   - Go to Render Dashboard → Manual Deploy → "Clear build cache & deploy"

---

## Security Notes

✅ **API Key is Secure:**
- Stored in environment variables (never in code)
- `.env` file is in `.gitignore`
- API calls go through backend server (not exposed to browser)
- Only backend has access to API key

✅ **CORS is Handled:**
- Production: Frontend and backend on same domain (no CORS issues)
- Development: Backend has CORS enabled for localhost

---

## Mobile Support

The chatbot is fully mobile-responsive:
- **Mobile (< 768px):** Full-screen chat interface
- **Desktop (≥ 768px):** Bottom-right popup window (420×700px)
- **Touch-friendly:** 48px minimum tap targets
- **Keyboard-safe:** Input field prevents iOS zoom (16px font size)

---

## Files Modified

- `/server.js` - Integrated Express server (NEW)
- `/package.json` - Added server dependencies and scripts
- `/src/utils/claudeAPI.js` - Updated to call local backend
- `/.env` - API key configuration
- `/.gitignore` - Excludes .env files

---

## Commands Reference

```bash
# Development
npm start              # React dev server (localhost:3000)
npm run server         # Backend server (localhost:3001)

# Production
npm run build          # Build React app
npm run start:prod     # Test production build locally

# Deployment
git push origin main   # Triggers auto-deploy on Render
```

---

## Questions?

If the chatbot still doesn't work after following this guide:
1. Check Render logs for errors
2. Verify API key is correct
3. Test the health endpoint: `https://childrenandfamilieslr.com/api/health`
4. Check browser console for errors
