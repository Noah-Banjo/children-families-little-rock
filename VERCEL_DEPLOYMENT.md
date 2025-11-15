# Dr. Archives Chatbot - Vercel Deployment Guide

## Overview
This chatbot uses **Vercel serverless functions** for API routes. No separate backend server needed!

## Architecture
- **Frontend**: React app (static files)
- **API**: Vercel serverless function at `/api/chat.js`
- **Single Deployment**: Vercel handles both frontend and API automatically

---

## Vercel Deployment Steps

### 1. Add Environment Variable in Vercel

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Select your project:** `children-families-little-rock`
3. **Go to Settings** → **Environment Variables**
4. **Add New Variable:**
   - **Name:** `REACT_APP_ANTHROPIC_API_KEY`
   - **Value:** `your-anthropic-api-key-here` (get from .env file or Anthropic console)
   - **Environment:** Select all (Production, Preview, Development)
5. **Click "Save"**

### 2. Redeploy

Vercel should automatically redeploy when you push to GitHub.

**Or manually trigger:**
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Check **"Use existing build cache"** (optional, faster)
4. Click **"Redeploy"**

### 3. Wait for Deployment (1-2 minutes)

Watch the deployment logs for:
```
Building...
✓ Build completed
Deploying...
✓ Deployment ready
```

### 4. Test the Chatbot

1. **Visit:** `https://childrenandfamilieslr.com`
2. **Click chat button** (💬)
3. **Ask:** "Tell me about Elizabeth Eckford"
4. **Should get AI response!**

---

## How It Works on Vercel

```
Browser (childrenandfamilieslr.com)
  ↓
React App (static files)
  ↓ fetch('/api/chat')
  ↓
Vercel Serverless Function (/api/chat.js)
  ↓ fetch('https://api.anthropic.com/v1/messages')
  ↓
Claude API
  ↓
Response back to browser
```

---

## Local Development

### Option 1: Use Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally with serverless functions
vercel dev
```

This runs on `http://localhost:3000` with API routes working.

### Option 2: React Dev Server Only

```bash
npm start
```

**Note:** API calls won't work locally without Vercel CLI. You'll get CORS errors.

---

## Troubleshooting

### Chatbot says "I'm having trouble connecting"

**Check 1: Environment Variable**
- Go to Vercel Dashboard → Settings → Environment Variables
- Verify `REACT_APP_ANTHROPIC_API_KEY` exists
- Make sure it's enabled for Production

**Check 2: Deployment Logs**
- Go to Vercel Dashboard → Deployments → Latest Deployment
- Click "View Function Logs"
- Look for errors in `/api/chat` function

**Check 3: API Endpoint**
- Visit: `https://childrenandfamilieslr.com/api/chat`
- Should return: `{"error":"Method not allowed"}` (this is correct - it only accepts POST)
- If you get 404, the serverless function didn't deploy

**Check 4: Browser Console**
- Open DevTools (F12) → Console tab
- Look for errors when sending chat message
- Check Network tab for `/api/chat` request

### API Key Not Working

**Verify the key:**
1. Go to https://console.anthropic.com/
2. Check if your API key is valid
3. Generate a new one if needed
4. Update in Vercel environment variables
5. Redeploy

---

## Files Structure

```
/api
  └── chat.js          # Vercel serverless function for Claude API
/src
  └── utils
      └── claudeAPI.js  # Frontend API calls
vercel.json            # Vercel configuration
package.json           # Dependencies
.env                   # Local environment (gitignored)
```

---

## Security Notes

✅ **API Key is Secure:**
- Stored in Vercel environment variables (not in code)
- `.env` file is gitignored
- API calls go through serverless function (not exposed to browser)
- Only serverless function has access to API key

✅ **CORS Handled:**
- Serverless function includes CORS headers
- No browser security issues

---

## Cost

**Vercel Free Tier Includes:**
- 100 GB bandwidth/month
- Unlimited serverless function invocations
- 100 hours serverless function execution time

**Anthropic API Costs:**
- Claude Sonnet 4: ~$3 per million input tokens, ~$15 per million output tokens
- Estimated: ~$0.01-0.02 per chatbot conversation

---

## Updating the Chatbot

1. Make code changes locally
2. Test with `vercel dev`
3. Commit and push to GitHub
4. Vercel auto-deploys
5. Check deployment logs

---

## Questions?

If chatbot doesn't work:
1. Check Vercel deployment logs
2. Verify environment variable is set
3. Test API endpoint manually
4. Check browser console for errors
5. Try redeploying with cache cleared
