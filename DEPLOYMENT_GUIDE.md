# Cubit Production Deployment Guide

## ✅ DeepSeek API Integration - READY FOR PRODUCTION

### Local Setup Complete
- ✅ DeepSeek API key configured in `frontend/.env.local`
- ✅ OpenAI package installed (v6.15.0)
- ✅ API endpoint at `/api/generate-cubit` ready
- ✅ Production build successful

### Production Deployment Steps

#### Option 1: Railway Deployment (Recommended)

1. **Login to Railway**
   ```bash
   cd frontend
   railway login
   ```

2. **Link to Your Railway Project** (if not already linked)
   ```bash
   railway link
   ```

3. **Set Environment Variable**
   ```bash
   railway variables set DEEPSEEK_API_KEY=sk-af1aa3ae66a34ada9a4d5b217602650c
   ```

4. **Deploy**
   ```bash
   railway up
   ```

   Or push to GitHub and Railway will auto-deploy if connected.

#### Option 2: Manual Environment Setup

For any deployment platform (Vercel, Netlify, etc.), set these environment variables:

```
DEEPSEEK_API_KEY=sk-af1aa3ae66a34ada9a4d5b217602650c
NEXT_PUBLIC_API_URL=<your-backend-api-url>
```

### Testing the DeepSeek Integration

1. **Local Testing** (currently running on http://localhost:3000)
   - Navigate to the app
   - Look for the Natural Language input feature
   - Try generating Cubit code from a prompt like: "create a function that adds two numbers"

2. **Production Testing**
   - After deployment, test the same feature
   - Check browser console for any API errors
   - Verify the `/api/generate-cubit` endpoint is accessible

### Current Configuration

**API Endpoint:** `frontend/src/pages/api/generate-cubit.ts`
```typescript
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});
```

**Model:** `deepseek-chat`

### Files Modified
- ✅ `frontend/.env.local` - Created with DeepSeek API key
- ✅ `frontend/package.json` - OpenAI dependency already present

### Security Notes
- ⚠️ Never commit `.env.local` to Git (it's in .gitignore)
- ✅ API key is server-side only (not exposed to client)
- ✅ API endpoint runs on server, not in browser

### Next Steps
1. Choose deployment method (Railway recommended)
2. Set environment variables in production
3. Deploy and test
4. Monitor API usage at DeepSeek dashboard

### Troubleshooting

If the natural language feature doesn't work in production:
1. Check environment variables are set correctly
2. Verify the API key is valid
3. Check server logs for API errors
4. Ensure the `/api/generate-cubit` route is accessible

---

**Status:** ✅ READY FOR PRODUCTION DEPLOYMENT
**Last Updated:** January 3, 2026
