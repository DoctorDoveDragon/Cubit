# Railway Deployment Guide for Cubit

This guide provides step-by-step instructions for deploying Cubit (backend + frontend) to Railway.

## Prerequisites

- GitHub account with the Cubit repository
- Railway account (sign up at https://railway.app)
- Railway CLI installed (optional, for local testing): `npm i -g @railway/cli`

## Architecture

Cubit on Railway consists of two services:
- **Backend Service**: Python/FastAPI application serving the Cubit execution API
- **Frontend Service**: Next.js application providing the interactive playground GUI

Both services are deployed from the same GitHub repository using different root directories.

## Deployment Steps

### Step 1: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select the `DoctorDoveDragon/Cubit` repository

### Step 2: Deploy Backend Service

Railway will automatically create the first service for the backend.

**Backend Configuration:**
- **Name**: `cubit-backend` (or your preferred name)
- **Root Directory**: `/` (leave default/empty)
- **Builder**: NIXPACKS (automatically detected)
- **Start Command**: Automatic (uses `nixpacks.toml`)

**Configuration Files:**
- `nixpacks.toml` - Defines Python setup and start command
- `railway.json` - Restart policy configuration
- `Procfile` - Fallback start command

**Automatic Setup:**
Railway will:
1. Detect Python from `nixpacks.toml`
2. Install dependencies from `requirements.txt`
3. Start the API with: `uvicorn api:app --host 0.0.0.0 --port $PORT`
4. Assign a public URL like: `https://cubit-backend-production.up.railway.app`

**Environment Variables:**
- `PORT` - Automatically set by Railway (no action needed)

**Verify Backend:**
1. Wait for deployment to complete
2. Click on the service to see the public URL
3. Open `https://your-backend-url.railway.app/health` - should return `{"status":"healthy"}`
4. Test API docs: `https://your-backend-url.railway.app/docs`

### Step 3: Deploy Frontend Service

Now add the frontend as a second service in the same project.

**Add Frontend Service:**
1. In your Railway project dashboard, click "+ New"
2. Select "GitHub Repo" and choose the same `Cubit` repository
3. Railway will create a new service

**Frontend Configuration:**
- **Name**: `cubit-frontend` (or your preferred name)
- **Root Directory**: Set to `frontend` (IMPORTANT!)
  - Click on the service
  - Go to Settings → Service
  - Scroll to "Root Directory"
  - Enter: `frontend`
  - Save changes
- **Builder**: NIXPACKS (automatically detected from `frontend/nixpacks.toml`)
- **Start Command**: Automatic (uses `frontend/nixpacks.toml`)

**Configuration Files:**
- `frontend/nixpacks.toml` - Defines Node.js 20, build, and start commands
- `frontend/railway.json` - Restart policy configuration

**Required Environment Variables:**

⚠️ **CRITICAL**: Set the following environment variables in the frontend service:

1. In the frontend service settings, go to "Variables" tab
2. Click "New Variable"
3. Add the following variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.railway.app` | Backend API URL from Step 2 |
| `PUPPETEER_SKIP_DOWNLOAD` | `true` | Skip Puppeteer Chrome download (optional but recommended) |

**Example:**
```
NEXT_PUBLIC_API_URL=https://cubit-backend-production.up.railway.app
PUPPETEER_SKIP_DOWNLOAD=true
```

**Important Notes:**
- Replace `your-backend-url.railway.app` with your actual backend URL from Step 2
- The URL must include `https://` protocol
- Do NOT include a trailing slash
- After adding/changing environment variables, **redeploy** the service (Railway → Deployments → ⋯ → Redeploy)

**Automatic Setup:**
Railway will:
1. Detect Node.js 20 from `frontend/nixpacks.toml`
2. Run `npm ci` to install exact dependencies
3. Run `npm run build` with your environment variables
4. Start the app with: `npm run start -- -p $PORT`
5. Assign a public URL like: `https://cubit-frontend-production.up.railway.app`

**Verify Frontend:**
1. Wait for deployment to complete (check build logs)
2. Open the public URL: `https://your-frontend-url.railway.app`
3. You should see the Cubit playground interface
4. Check the API health indicator - it should show "Connected" (green)
5. Try running sample code to verify backend connectivity

### Step 4: Configure Custom Domains (Optional)

If you want custom domains:

**Backend:**
1. Go to backend service → Settings → Domains
2. Click "Custom Domain"
3. Enter your domain (e.g., `api.cubit.example.com`)
4. Add the CNAME record to your DNS provider
5. Update `NEXT_PUBLIC_API_URL` in frontend to use the custom domain
6. Redeploy frontend

**Frontend:**
1. Go to frontend service → Settings → Domains
2. Click "Custom Domain"
3. Enter your domain (e.g., `cubit.example.com`)
4. Add the CNAME record to your DNS provider

## Deployment Verification Checklist

- [ ] Backend service is running (green status in Railway)
- [ ] Backend health endpoint returns `{"status":"healthy"}`
- [ ] Frontend service is running (green status in Railway)
- [ ] Frontend loads in browser
- [ ] API health indicator shows "Connected" (green dot)
- [ ] Code execution works (try running "Hello World" example)
- [ ] No CORS errors in browser console (F12)

## Troubleshooting

### Backend Issues

**Backend service fails to start:**
```bash
# Check Railway logs for errors
# Common issues:
# 1. Missing dependencies in requirements.txt
# 2. Python version mismatch
# 3. Port binding issues

# Solution: Check logs and ensure requirements.txt includes:
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
pydantic>=2.5.0
```

**Backend returns 404 or 502:**
- Verify the service is running (check Railway dashboard)
- Check logs for startup errors
- Ensure `nixpacks.toml` is in the root directory
- Verify the start command uses `$PORT` variable

### Frontend Issues

**Frontend build fails:**

1. **Missing Root Directory**:
   ```
   Solution: Set Root Directory to "frontend" in service settings
   ```

2. **Environment variable issues**:
   ```
   Error: NEXT_PUBLIC_API_URL is not set
   Solution: Add the variable in Railway dashboard and redeploy
   ```

3. **Puppeteer installation fails**:
   ```
   Error: Failed to download Chrome binary
   Solution: Add PUPPETEER_SKIP_DOWNLOAD=true environment variable
   ```

4. **TypeScript errors**:
   ```
   Solution: Check build logs for specific errors
   Run locally: cd frontend && npm ci && npm run build
   ```

**Frontend shows "API Disconnected":**

1. **Wrong API URL**:
   ```
   Solution: Verify NEXT_PUBLIC_API_URL in frontend service variables
   Should be: https://your-backend-url.railway.app (no trailing slash)
   ```

2. **Backend not accessible**:
   ```
   Test: curl https://your-backend-url.railway.app/health
   Solution: Ensure backend service is running
   ```

3. **Environment variable not applied**:
   ```
   Solution: After changing NEXT_PUBLIC_API_URL, REDEPLOY the frontend
   Go to: Deployments → ⋯ → Redeploy
   ```

4. **CORS issues**:
   ```
   Check browser console (F12) for CORS errors
   Backend CORS is configured to allow all origins in api.py
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
| Frontend | `NEXT_PUBLIC_API_URL` | `https://cubit-backend-production.up.railway.app` | ✅ (manual) |
| Frontend | `PUPPETEER_SKIP_DOWNLOAD` | `true` | ⚠️ (recommended) |

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
