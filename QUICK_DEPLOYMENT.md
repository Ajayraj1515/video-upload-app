# Quick Deployment Reference

## TL;DR - Fast Deployment Steps

### 1. Deploy Backend First (Render)

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your_random_secret_here
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=https://your-frontend-url.netlify.app
   ```
6. Deploy and **save your backend URL** (e.g., `https://video-upload-backend.onrender.com`)

### 2. Deploy Frontend (Netlify)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repo
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```
6. Deploy

### 3. Update Backend with Frontend URL

1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable with your Netlify URL
3. Backend will auto-redeploy

### 4. Test

- Backend health: `https://your-backend.onrender.com/api/health`
- Frontend: `https://your-site.netlify.app`
- Try login, upload, and video playback

---

## Code Changes Already Done ✅

All code changes are complete! You just need to:

1. **Set environment variables** in Render/Netlify dashboards
2. **No code changes needed** - everything is configured!

---

## Files to Know

- **Backend config**: `backend/server.js` - Already uses `FRONTEND_URL` env var
- **Frontend config**: `frontend/src/config/api.js` - Already uses `VITE_API_BASE_URL` and `VITE_SOCKET_URL`
- **Video player**: `frontend/src/pages/VideoPlayer.jsx` - Already uses config for stream URL

---

## Common Issues

**Can't connect to backend?**
- Check `VITE_API_BASE_URL` is set correctly
- Ensure backend URL is accessible
- Check browser console for errors

**Videos won't play?**
- Verify stream URL uses correct backend URL
- Check backend logs for errors
- Ensure video files are accessible

**Socket.IO not working?**
- Check `VITE_SOCKET_URL` is set correctly
- Verify backend `FRONTEND_URL` matches frontend URL
- Check browser console for connection errors

---

For detailed instructions, see `DEPLOYMENT_GUIDE.md`

