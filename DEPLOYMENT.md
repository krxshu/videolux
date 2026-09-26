# VIDEOLUX AI - Deployment Guide

## Quick Start Deployment to Railway

Your code is ready to deploy! Follow these steps to get your public website live:

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (recommended for easy deployment)
3. Create a new project

### Step 2: Deploy from GitHub
1. Click "New Project" → "Deploy from GitHub repo"
2. Select `krxshu/videolux` repository
3. Select the `krxshu-legendary-tribble` branch
4. Railway will automatically detect the Node.js backend and ffmpeg dependencies

### Step 3: Configure Environment Variables
In Railway's project dashboard, go to **Variables** and set:

```
NODE_ENV=production
PORT=8080
FRONTEND_ORIGIN=https://YOUR_RAILWAY_DOMAIN.railway.app
UPLOAD_DIR=temp/uploads
PROCESSED_DIR=temp/processed
MAX_FILE_SIZE_MB=500
FILE_TTL_MINUTES=60
FFMPEG_PATH=
FFPROBE_PATH=
AI_PROVIDER_ENABLED=false
```

Replace `YOUR_RAILWAY_DOMAIN` with your actual Railway domain (it will look like `videolux-ai-production.railway.app`)

### Step 4: Deploy
1. Click "Deploy" button
2. Wait for the build to complete (3-5 minutes)
3. Railway will give you a public URL like: `https://videolux-ai-production.railway.app`

### Step 5: Verify Deployment
- Open `https://YOUR_RAILWAY_DOMAIN.railway.app` in your browser
- You should see the VIDEOLUX AI interface
- Try uploading a test video to verify everything works

## Architecture

### Backend (Node.js/Express)
- Port: 8080 (on Railway)
- Handles video upload, processing, and download
- Uses FFmpeg for video enhancement
- Serves both API and frontend static files

### Frontend (React + Vite)
- Built to static HTML/CSS/JS
- Served by backend from `/frontend/dist`
- No separate domain needed - same URL as backend

### Environment Variables Explained

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | Set to `production` for Railway |
| `PORT` | Railway assigns port 8080 by default |
| `FRONTEND_ORIGIN` | CORS origin - use your Railway domain |
| `MAX_FILE_SIZE_MB` | Maximum upload size (500MB recommended) |
| `FILE_TTL_MINUTES` | Auto-delete files after this time |
| `AI_PROVIDER_ENABLED` | Set to `true` if using external AI API |

## After Deployment

### Your Public URLs:
- **Website**: `https://YOUR_RAILWAY_DOMAIN.railway.app`
- **API Health Check**: `https://YOUR_RAILWAY_DOMAIN.railway.app/api/health`
- **API Upload**: `POST https://YOUR_RAILWAY_DOMAIN.railway.app/api/upload`

### To Update Your Website:
1. Make code changes locally
2. Commit to git: `git commit -am "Your message"`
3. Push to GitHub: `git push origin krxshu-legendary-tribble`
4. Railway automatically deploys (2-3 minutes)

## Troubleshooting

### Frontend not loading
- Check that `npm run build` completed in Railway logs
- Verify `FRONTEND_ORIGIN` environment variable is correct

### Video upload fails
- Check Railway logs for FFmpeg errors
- Verify `MAX_FILE_SIZE_MB` is large enough
- Ensure you're uploading a valid video format

### CORS errors
- Update `FRONTEND_ORIGIN` to match your Railway domain
- Ensure it includes `https://` prefix

## Next Steps (Optional)

### Connect Custom Domain
1. Go to Railway project → Settings → Domains
2. Add your custom domain (e.g., `videolux.yoursite.com`)
3. Follow Railway's DNS configuration instructions

### Enable AI Enhancement (Advanced)
1. Sign up for an AI upscaling API (e.g., Upscayl, Topaz)
2. Get API key and endpoint
3. Update in Railway variables:
   ```
   AI_PROVIDER_ENABLED=true
   AI_PROVIDER_API_URL=https://...
   AI_PROVIDER_API_KEY=your_key_here
   ```

## Support

For Railway deployment issues: https://railway.app/support
For VIDEOLUX code issues: Check backend/services/ directory

---

**Your deployment is complete! Open your Railway domain in your phone browser and start enhancing videos! 🎬✨**
