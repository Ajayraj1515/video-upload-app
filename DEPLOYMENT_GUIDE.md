# Complete Deployment Guide

This guide will walk you through deploying your Video Upload application to production using **Render** for the backend and **Netlify** (or Render) for the frontend.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deployment Order](#deployment-order)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
5. [Frontend Deployment (Render - Alternative)](#frontend-deployment-render-alternative)
6. [Environment Variables Setup](#environment-variables-setup)
7. [Code Changes Required](#code-changes-required)
8. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before starting, ensure you have:
- ✅ A GitHub account
- ✅ Your code pushed to a GitHub repository
- ✅ A Render account (free tier available)
- ✅ A Netlify account (free tier available) OR use Render for both
- ✅ MongoDB Atlas account (free tier available) OR use Render's MongoDB service

---

## Deployment Order

**IMPORTANT: Deploy Backend FIRST, then Frontend**

1. **Step 1**: Deploy Backend to Render
2. **Step 2**: Get your backend URL from Render
3. **Step 3**: Update frontend code with backend URL
4. **Step 4**: Deploy Frontend to Netlify (or Render)

---

## Backend Deployment (Render)

### Step 1: Prepare Your Backend

1. **Create a `render.yaml` file** in your `backend` folder (optional but recommended):

```yaml
services:
  - type: web
    name: video-upload-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: JWT_SECRET
        sync: false
      - key: MONGODB_URI
        sync: false
      - key: FRONTEND_URL
        sync: false
```

### Step 2: Deploy to Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Select your repository** and branch
5. **Configure the service**:
   - **Name**: `video-upload-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if you prefer)

### Step 3: Set Environment Variables in Render

In the Render dashboard, go to **Environment** tab and add:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video_upload?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend-url.netlify.app
```

**Important Notes:**
- Replace `your_super_secret_jwt_key_here_make_it_long_and_random` with a strong random string
- Replace MongoDB URI with your actual MongoDB Atlas connection string
- For `FRONTEND_URL`, you'll update this after deploying the frontend

### Step 4: Get Your Backend URL

After deployment, Render will provide you with a URL like:
```
https://video-upload-backend.onrender.com
```

**Save this URL** - you'll need it for the frontend!

---

## Frontend Deployment (Netlify)

### Step 1: Update Frontend Code

Before deploying, you need to update the frontend to use your backend URL.

#### Option A: Using Environment Variables (Recommended)

1. **Create `.env.production` file** in your `frontend` folder:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

**Replace `your-backend-url.onrender.com` with your actual Render backend URL!**

2. **The code is already configured** to use these environment variables (we set this up in `frontend/src/config/api.js`)

#### Option B: Update Config Directly (Not Recommended for Production)

If you need to hardcode (not recommended), edit `frontend/src/config/api.js`:

```javascript
const API_BASE_URL = 'https://your-backend-url.onrender.com';
const SOCKET_URL = 'https://your-backend-url.onrender.com';
```

### Step 2: Build Your Frontend Locally (Test First)

```bash
cd frontend
npm run build
```

This creates a `dist` folder with production-ready files.

### Step 3: Deploy to Netlify

#### Method 1: Netlify CLI (Recommended)

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**:
```bash
netlify login
```

3. **Initialize and deploy**:
```bash
cd frontend
netlify init
# Follow the prompts:
# - Create & configure a new site
# - Team: Select your team
# - Site name: your-site-name
# - Build command: npm run build
# - Directory to deploy: dist
```

4. **Set Environment Variables**:
```bash
netlify env:set VITE_API_BASE_URL https://your-backend-url.onrender.com
netlify env:set VITE_SOCKET_URL https://your-backend-url.onrender.com
```

5. **Deploy**:
```bash
netlify deploy --prod
```

#### Method 2: Netlify Dashboard (Git-based)

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Click "Add new site"** → **"Import an existing project"**
3. **Connect to Git provider** (GitHub)
4. **Select your repository**
5. **Configure build settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. **Add Environment Variables**:
   - Go to **Site settings** → **Environment variables**
   - Add:
     - `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com`
     - `VITE_SOCKET_URL` = `https://your-backend-url.onrender.com`
7. **Deploy site**

### Step 4: Update Backend CORS Settings

After getting your frontend URL, update the backend environment variable in Render:

1. Go to Render dashboard → Your backend service → **Environment**
2. Update `FRONTEND_URL` to your Netlify URL:
```
FRONTEND_URL=https://your-site-name.netlify.app
```
3. **Redeploy** the backend (Render will auto-redeploy when env vars change)

---

## Frontend Deployment (Render - Alternative)

If you prefer to use Render for both backend and frontend:

### Step 1: Update Frontend Code

Same as Netlify - create `.env.production` or update `frontend/src/config/api.js`

### Step 2: Deploy to Render

1. **Go to Render Dashboard** → **"New +"** → **"Static Site"**
2. **Connect your GitHub repository**
3. **Configure**:
   - **Name**: `video-upload-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **Add Environment Variables**:
   - `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com`
   - `VITE_SOCKET_URL` = `https://your-backend-url.onrender.com`
5. **Deploy**

---

## Environment Variables Setup

### Backend Environment Variables (Render)

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your_long_random_secret_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video_upload
FRONTEND_URL=https://your-frontend-url.netlify.app
```

### Frontend Environment Variables (Netlify/Render)

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

**Important**: 
- Vite requires the `VITE_` prefix for environment variables
- These are exposed to the client, so don't put secrets here
- Update these after you get your backend URL

---

## Code Changes Required

### Files Already Updated ✅

The following files have been updated to support environment variables:

1. **`frontend/src/config/api.js`** - Uses `VITE_API_BASE_URL` and `VITE_SOCKET_URL`
2. **`frontend/src/pages/VideoPlayer.jsx`** - Uses config for stream URL
3. **`frontend/src/context/AuthContext.jsx`** - Uses config for axios base URL
4. **`frontend/src/context/SocketContext.jsx`** - Uses config for Socket.IO URL

### What You Need to Do

1. **Create `.env.production` in `frontend` folder**:
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

2. **Update backend `.env` or Render environment variables**:
```
FRONTEND_URL=https://your-frontend-url.netlify.app
```

3. **No code changes needed** - everything is already configured! 🎉

---

## Post-Deployment Checklist

After deploying both backend and frontend:

- [ ] Backend is accessible at `https://your-backend.onrender.com/api/health`
- [ ] Frontend is accessible at `https://your-frontend.netlify.app`
- [ ] Frontend can connect to backend (check browser console for errors)
- [ ] Login/Register works
- [ ] Video upload works
- [ ] Video playback works
- [ ] Socket.IO connections work (check for real-time updates)

### Testing Your Deployment

1. **Test Backend Health**:
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Frontend**:
   - Open your frontend URL
   - Try logging in
   - Upload a test video
   - Watch the video

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Check Console for any errors
   - Check Network tab for API calls

---

## Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- **Solution**: Check Render logs, ensure all environment variables are set
- **Solution**: Verify MongoDB connection string is correct

**Problem**: CORS errors
- **Solution**: Update `FRONTEND_URL` in backend environment variables
- **Solution**: Check `backend/server.js` CORS configuration

### Frontend Issues

**Problem**: Can't connect to backend
- **Solution**: Verify `VITE_API_BASE_URL` is set correctly in Netlify/Render
- **Solution**: Check that backend URL is accessible
- **Solution**: Ensure backend CORS allows your frontend URL

**Problem**: Videos won't play
- **Solution**: Check that stream URL uses correct backend URL
- **Solution**: Verify video files are accessible
- **Solution**: Check browser console for errors

**Problem**: Socket.IO not connecting
- **Solution**: Verify `VITE_SOCKET_URL` is set correctly
- **Solution**: Check backend Socket.IO CORS settings

### Common Issues

**Problem**: Environment variables not working
- **Solution**: Restart/redeploy after adding environment variables
- **Solution**: For Vite, ensure variables start with `VITE_`
- **Solution**: Clear browser cache

**Problem**: Build fails
- **Solution**: Check build logs in Netlify/Render
- **Solution**: Ensure all dependencies are in `package.json`
- **Solution**: Test build locally first: `npm run build`

---

## Summary

### Quick Deployment Steps:

1. ✅ **Deploy Backend to Render**
   - Connect GitHub repo
   - Set environment variables
   - Get backend URL

2. ✅ **Update Frontend Environment Variables**
   - Create `.env.production` with backend URL
   - Or set in Netlify/Render dashboard

3. ✅ **Deploy Frontend to Netlify/Render**
   - Connect GitHub repo
   - Set build settings
   - Set environment variables
   - Deploy

4. ✅ **Update Backend with Frontend URL**
   - Update `FRONTEND_URL` in Render
   - Redeploy backend

5. ✅ **Test Everything**
   - Health check
   - Login/Register
   - Upload video
   - Play video

---

## Need Help?

If you encounter issues:
1. Check Render/Netlify logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Ensure URLs don't have trailing slashes
5. Check CORS settings match your frontend URL

Good luck with your deployment! 🚀

