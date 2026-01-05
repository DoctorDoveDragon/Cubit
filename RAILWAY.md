# Railway Deployment Guide for Cubit

This guide provides step-by-step instructions for deploying Cubit (backend + frontend) to Railway.

## Prerequisites

- GitHub account with the Cubit repository
- Railway account (sign up at https://railway.app)
- Railway CLI installed (optional, for local testing): `npm i -g @railway/cli`

## Architecture

Cubit uses a **monorepo deployment** where both frontend and backend run in a single service:
- **Backend**: Python/FastAPI application serving the Cubit execution API (port 8080)
- **Frontend**: Next.js application providing the interactive playground GUI (exposed on main PORT)
- **Proxy**: Next.js rewrites proxy API requests from the frontend to the backend

Both servers run simultaneously, with the frontend serving as the public-facing application.

## Deployment Steps

### Step 1: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select the `DoctorDoveDragon/Cubit` repository

### Step 2: Deploy Full-Stack Service

Railway will automatically create a single service that runs both frontend and backend.

**Service Configuration:**
- **Name**: `cubit` (or your preferred name)
- **Root Directory**: `/` (repository root)
- **Builder**: NIXPACKS (automatically detected)
- **Start Command**: Automatic (uses `nixpacks.toml`)

**Configuration Files:**
- `nixpacks.toml` - Defines Node.js + Python setup, builds frontend, and starts both servers
- `Dockerfile` - Alternative deployment method using Docker
- `railway.json` - Restart policy configuration
- `Procfile` - Fallback start command

**Automatic Setup:**
Railway will:
1. Detect Node.js and Python from `nixpacks.toml`
2. Install frontend dependencies and build Next.js app
3. Install backend Python dependencies from `requirements.txt`
4. Start both servers:
   - FastAPI backend on port 8080 (internal)
   - Next.js frontend on $PORT (public-facing)
5. Assign a public URL like: `https://cubit-production.up.railway.app`

**Environment Variables:**

The following environment variables are automatically set by Railway:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `PORT` | Auto-set by Railway | Port for the frontend server (automatic) ✅ |
| `BACKEND_URL` | `http://localhost:8080` | URL for Next.js to proxy to backend (automatic) ✅ |

**Optional Environment Variables:**

For the Next.js API route (`/api/generate-cubit`):
| Variable Name | Description |
|--------------|-------------|
| `DEEPSEEK_API_KEY` | API key for DeepSeek AI code generation feature (optional) |

**Verify Deployment:**
1. Wait for deployment to complete
2. Click on the service to see the public URL
3. Open `https://your-app-url.railway.app` - should load the Cubit GUI
4. Test backend health via proxy: `https://your-app-url.railway.app/health` - should return `{"status":"healthy"}`
5. Try running Cubit code in the playground

### Step 3: Using the Deployed Application

The deployed application combines both frontend and backend in a single service:

- **Frontend URL**: `https://your-app-url.railway.app` (main entry point)
- **API Endpoints** (proxied through frontend):
  - `/health` - Health check
  - `/execute` - Code execution
  - `/docs` - FastAPI documentation
  - `/concepts` - Programming concepts
  - `/progress` - Learning progress

**Testing the Deployment:**
1. Visit the main URL to see the Cubit playground
2. Try running example code (Hello World, Fibonacci, etc.)
3. Check the API health indicator (should show connected)
4. Test the natural language code generation (if DEEPSEEK_API_KEY is set)

## Deployment Verification Checklist

- [ ] Service is running (green status in Railway)
- [ ] Frontend loads in browser at the public URL
- [ ] Backend health endpoint returns `{"status":"healthy"}` when accessed via `/health`
- [ ] Code execution works (try running "Hello World" example)
- [ ] No errors in browser console (F12)
- [ ] No errors in Railway deployment logs

## Troubleshooting

### Build Failures

**Frontend build fails during deployment:**

1. **Node.js or Python not found**:
   ```
   Solution: Ensure nixpacks.toml includes both Node.js 20 and Python 3.11
   ```

2. **Frontend build timeout**:
   ```
   Error: Build exceeded time limit
   Solution: This is rare but can happen. Redeploy or contact Railway support.
   ```

3. **Puppeteer installation fails**:
   ```
   Error: Failed to download Chrome binary
   Solution: This is automatically handled by nixpacks.toml (PUPPETEER_SKIP_DOWNLOAD=true).
   If you still see this error, verify that the install command includes PUPPETEER_SKIP_DOWNLOAD=true.
   ```

4. **TypeScript errors**:
   ```
   Solution: Check build logs for specific errors
   Run locally: cd frontend && npm ci && npm run build
   ```

### Runtime Issues

**Backend not starting:**
1. Check Railway logs for Python errors
2. Verify all dependencies are in requirements.txt
3. Ensure the start script successfully starts both backend and frontend

**Frontend shows "API Disconnected" or execution fails:**

1. **Backend process not running**:
   ```
   Solution: Check Railway logs - backend should start on port 8080 before frontend
   Look for: "Starting FastAPI backend on port 8080..."
   ```

2. **Port conflict or binding issues**:
   ```
   Solution: Ensure PORT environment variable is being used correctly
   Backend uses fixed port 8080 (internal)
   Frontend uses $PORT (Railway-assigned, public-facing)
   ```

3. **Proxy configuration issues**:
   ```
   Solution: After changing NEXT_PUBLIC_API_URL, REDEPLOY the frontend
   Go to: Deployments → ⋯ → Redeploy
   ```

4. **CORS issues**:
   ```
   Check browser console (F12) for CORS errors
   Solution 1: Backend CORS defaults to allow all origins (*)
   Solution 2: For production, set CORS_ORIGINS environment variable in backend:
               CORS_ORIGINS=https://your-frontend-url.railway.app
   Solution 3: If using multiple frontends, use comma-separated:
               CORS_ORIGINS=https://frontend1.app,https://frontend2.app
   Redeploy backend after changing CORS_ORIGINS
   ```

**Changes not reflecting:**
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Verify deployment completed successfully
- Check Railway logs for deployment status
- Try incognito/private browsing mode

### Environment Variable Issues

**NEXT_PUBLIC_API_URL not taking effect:**

⚠️ Variables starting with `NEXT_PUBLIC_` are embedded at **build time**.

**Solution:**
1. Go to frontend service → Variables
2. Ensure `NEXT_PUBLIC_API_URL` is set correctly
3. Go to Deployments tab
4. Click ⋯ on latest deployment → "Redeploy"
5. Wait for build to complete
6. Hard refresh browser (Ctrl+F5)

**How to verify environment variable is set:**
1. Open browser console (F12)
2. Run: `console.log(process.env.NEXT_PUBLIC_API_URL)`
3. Should show your backend URL (not `undefined` or `localhost`)

### Common Mistakes

❌ **Setting frontend root directory to `/` instead of `frontend`**
- Frontend won't find package.json and build will fail

❌ **Forgetting to redeploy after changing NEXT_PUBLIC_API_URL**
- Changes won't take effect until rebuild

❌ **Using `http://` instead of `https://` for Railway URLs**
- Railway uses HTTPS by default

❌ **Including trailing slash in NEXT_PUBLIC_API_URL**
- Should be: `https://api.example.com` not `https://api.example.com/`

❌ **Not setting NEXT_PUBLIC_API_URL at all**
- Frontend will try to connect to `http://localhost:8080` (won't work in production)

## Updating Your Deployment

### Updating Code

Railway automatically deploys when you push to your main branch:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Railway will automatically detect the push and redeploy both services
4. Monitor deployment in Railway dashboard

### Updating Environment Variables

1. Go to service → Variables
2. Update the variable value
3. Click "Redeploy" to apply changes (required for `NEXT_PUBLIC_*` variables)

### Rolling Back

If a deployment breaks:
1. Go to service → Deployments
2. Find a working previous deployment
3. Click ⋯ → "Redeploy"

## Monitoring and Logs

### Viewing Logs

**Backend Logs:**
1. Click on backend service
2. Go to "Deployments" tab
3. Click on active deployment
4. Logs show API requests, errors, and startup info

**Frontend Logs:**
1. Click on frontend service
2. Go to "Deployments" tab
3. Click on active deployment
4. Logs show build output and Next.js server logs

### Build Logs

Click on any deployment to see:
- Install phase (dependencies)
- Build phase (npm run build)
- Start phase (service startup)
- Runtime logs (ongoing)

### Monitoring Service Health

- Railway shows CPU, Memory, and Network usage in the dashboard
- Set up alerts in Settings → Alerts
- Use the backend `/health` endpoint for external monitoring

## Cost Optimization

Railway offers:
- Free tier with $5 credit/month
- Usage-based pricing after free tier

**Tips to minimize costs:**
1. Stop unused services when not needed
2. Use the "Sleep" feature for dev environments
3. Monitor usage in Railway dashboard
4. Consider using Railway's free tier for backend only, deploy frontend to Vercel (free)

## Best Practices

1. **Use environment-specific variables**
   - Development: `http://localhost:8080`
   - Production: `https://your-backend.railway.app`

2. **Always test locally before deploying**
   ```bash
   # Backend
   python3 api.py
   
   # Frontend
   cd frontend
   echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local
   npm run build
   npm run start
   ```

3. **Monitor logs after deployment**
   - Check for errors immediately after deploy
   - Verify health endpoints

4. **Use Railway CLI for debugging**
   ```bash
   railway login
   railway link
   railway logs  # View service logs
   railway run npm run build  # Test build locally
   ```

5. **Keep dependencies up to date**
   ```bash
   # Backend
   pip list --outdated
   
   # Frontend
   cd frontend && npm outdated
   ```

## Support and Resources

- **Railway Documentation**: https://docs.railway.app
- **Railway Community**: https://discord.gg/railway
- **Cubit Repository**: https://github.com/DoctorDoveDragon/Cubit
- **Frontend README**: See `frontend/README.md` for detailed frontend docs
- **Backend API Docs**: Visit `/docs` on your backend URL

## Quick Reference

### Environment Variables Cheat Sheet

| Service | Variable | Example Value | Required |
|---------|----------|---------------|----------|
| Backend | `PORT` | Auto-set by Railway | ✅ (automatic) |
| Backend | `CORS_ORIGINS` | `https://cubit-frontend-production.up.railway.app` | ⚠️ (optional, defaults to `*`) |
| Frontend | `NEXT_PUBLIC_API_URL` | `https://cubit-backend-production.up.railway.app` | ✅ (manual) |
| Frontend | `PUPPETEER_SKIP_DOWNLOAD` | `true` | ✅ (automatic via nixpacks.toml) |

### Service URLs Template

```
Backend API: https://cubit-backend-production.up.railway.app
Backend Health: https://cubit-backend-production.up.railway.app/health
Backend Docs: https://cubit-backend-production.up.railway.app/docs

Frontend App: https://cubit-frontend-production.up.railway.app
```

### Common Railway Commands

```bash
railway login                    # Authenticate with Railway
railway link                     # Link to your project
railway logs                     # View service logs
railway status                   # Check service status
railway run <command>            # Run command in Railway environment
railway open                     # Open service in browser
railway variables                # List environment variables
railway variables set KEY=value  # Set environment variable
```

---

**Last Updated**: January 2026  
**Railway CLI Version**: 3.x  
**Next.js Version**: 16.1.1  
**Node.js Version**: 20.x
