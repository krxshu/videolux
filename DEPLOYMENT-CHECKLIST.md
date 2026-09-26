# DEPLOYMENT CHECKLIST

## Pre-Deployment ✅
- [x] Frontend built to `/frontend/dist`
- [x] Backend configured to serve frontend
- [x] Code committed to `krxshu-legendary-tribble` branch
- [x] Code pushed to GitHub
- [x] Railway configuration files ready (nixpacks.toml, railway.json)

## Deployment Steps

### 1. Go to Railway.app
```
https://railway.app
```

### 2. Create New Project from GitHub
- Click "Create New Project"
- Select "Deploy from GitHub repo"
- Choose `krxshu/videolux`
- Select `krxshu-legendary-tribble` branch

### 3. Railway will auto-detect:
- Node.js (backend)
- ffmpeg dependency

### 4. Configure Variables in Railway Dashboard
Copy-paste this into Railway Variables section:

```
NODE_ENV=production
PORT=8080
FRONTEND_ORIGIN=https://YOUR_DEPLOYED_URL.railway.app
UPLOAD_DIR=temp/uploads
PROCESSED_DIR=temp/processed
MAX_FILE_SIZE_MB=500
FILE_TTL_MINUTES=60
FFMPEG_PATH=
FFPROBE_PATH=
AI_PROVIDER_ENABLED=false
AI_PROVIDER_API_URL=
AI_PROVIDER_API_KEY=
```

**IMPORTANT**: Replace `YOUR_DEPLOYED_URL` with your actual Railway domain 
(you'll see it after first deployment attempt)

### 5. Deploy
- Click "Deploy"
- Wait 3-5 minutes for build to complete

### 6. Get Your URL
- Check Railway dashboard
- Your public URL will be something like: `https://videolux-ai-xyz123.railway.app`
- **UPDATE FRONTEND_ORIGIN** with this exact URL
- Redeploy

### 7. Test
- Open URL in browser: `https://videolux-ai-xyz123.railway.app`
- Upload a test video
- Verify it works

## Your Final URLs

After deployment, you'll have:

**🌐 Public Website**
```
https://videolux-ai-xyz123.railway.app
```

**📡 API Endpoint**
```
https://videolux-ai-xyz123.railway.app/api/
```

**💚 Health Check**
```
GET https://videolux-ai-xyz123.railway.app/api/health
```

## If Something Goes Wrong

1. Check Railway Logs (in project dashboard)
2. Common issues:
   - `FRONTEND_ORIGIN` doesn't match deployment URL → update variable
   - FFmpeg not found → should be installed automatically via nixpacks
   - Frontend not loading → check if build succeeded in logs

## Need Help?

- Railway Docs: https://docs.railway.app
- VIDEOLUX README: See README.md in this repo
- Check DEPLOYMENT.md for detailed guide
