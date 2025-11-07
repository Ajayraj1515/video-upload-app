# Detailed Deployment Guide - Step by Step

This guide is specifically tailored for your **Video_upload** folder structure.

## 📁 Your Folder Structure

```
Video_upload/                    ← Root folder (GitHub repository root)
├── backend/                     ← Backend code folder
│   ├── server.js               ← Backend entry point
│   ├── package.json            ← Backend dependencies
│   ├── routes/                 ← API routes
│   ├── models/                 ← Database models
│   ├── middleware/             ← Auth middleware
│   └── uploads/                ← Video storage folder
│
└── frontend/                    ← Frontend code folder
    ├── src/                    ← React source code
    ├── package.json            ← Frontend dependencies
    ├── vite.config.js          ← Vite configuration
    └── index.html              ← HTML entry point
```

---

## 🎯 Deployment Order

**CRITICAL: Deploy Backend FIRST, then Frontend**

1. ✅ **Step 1**: Deploy Backend (from `backend/` folder)
2. ✅ **Step 2**: Get Backend URL from Render
3. ✅ **Step 3**: Deploy Frontend (from `frontend/` folder) with Backend URL
4. ✅ **Step 4**: Update Backend with Frontend URL

---

## 📦 Part 1: Backend Deployment (Render)

### Step 1: Push Your Code to GitHub

**From your root folder (`Video_upload/`):**

1. Open terminal/command prompt in `Video_upload/` folder
2. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Create a new repository on GitHub (e.g., `video-upload-app`)
4. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/video-upload-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Prepare Backend for Render

**Important**: Render needs to know where your backend code is located.

**From your root folder (`Video_upload/`):**

1. Create a `render.yaml` file in the **root folder** (`Video_upload/render.yaml`):
   ```yaml
   services:
     - type: web
       name: video-upload-backend
       env: node
       rootDir: backend
       buildCommand: cd backend && npm install
       startCommand: cd backend && npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 10000
   ```

   **OR** you can configure it directly in Render dashboard (see Step 3).

### Step 3: Deploy Backend to Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub account** (if not already connected)
4. **Select your repository**: `video-upload-app` (or your repo name)
5. **Select branch**: `main` (or your default branch)

6. **Configure the service**:
   - **Name**: `video-upload-backend` (or any name you prefer)
   - **Root Directory**: `backend` ← **IMPORTANT: This tells Render where your backend code is**
   - **Environment**: `Node`
   - **Build Command**: `npm install` ← **This runs inside the `backend/` folder**
   - **Start Command**: `npm start` ← **This runs inside the `backend/` folder**
   - **Plan**: Free (or paid if you prefer)

7. **Click "Create Web Service"**

### Step 4: Set Backend Environment Variables in Render

**In the Render dashboard, go to your backend service → "Environment" tab:**

Click "Add Environment Variable" for each:

1. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

2. **PORT**
   - Key: `PORT`
   - Value: `10000` (Render uses port 10000)

3. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: `your_super_secret_jwt_key_here_make_it_long_and_random`
   - **Generate a random string** (at least 32 characters)
   - You can use: `openssl rand -base64 32` in terminal

4. **MONGODB_URI**
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/video_upload?retryWrites=true&w=majority`
   - **Get this from MongoDB Atlas**:
     - Go to MongoDB Atlas → Clusters → Connect
     - Choose "Connect your application"
     - Copy the connection string
     - Replace `<password>` with your database password
     - Replace `video_upload` with your database name

5. **FRONTEND_URL** (You'll update this later)
   - Key: `FRONTEND_URL`
   - Value: `https://your-frontend-url.netlify.app` (placeholder for now)

### Step 5: Wait for Backend Deployment

1. Render will automatically:
   - Clone your repository
   - Navigate to `backend/` folder
   - Run `npm install`
   - Run `npm start`
   - Deploy your service

2. **Wait for deployment to complete** (usually 2-5 minutes)

3. **Get your Backend URL**:
   - Once deployed, Render will show you a URL like:
   - `https://video-upload-backend.onrender.com`
   - **SAVE THIS URL** - You'll need it for frontend!

4. **Test your backend**:
   - Open: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

---

## 🎨 Part 2: Frontend Deployment (Netlify)

### Step 1: Prepare Frontend Environment Variables

**From your root folder (`Video_upload/`):**

1. Navigate to `frontend/` folder:
   ```bash
   cd frontend
   ```

2. Create `.env.production` file in `frontend/` folder:
   ```bash
   # In frontend/.env.production
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```
   
   **Replace `your-backend-url.onrender.com` with your actual Render backend URL!**

   **Example:**
   ```
   VITE_API_BASE_URL=https://video-upload-backend.onrender.com
   VITE_SOCKET_URL=https://video-upload-backend.onrender.com
   ```

3. **Test build locally** (optional but recommended):
   ```bash
   # Still in frontend/ folder
   npm run build
   ```
   
   This creates a `dist/` folder with production files. If this works, deployment will work too!

### Step 2: Deploy Frontend to Netlify

#### Option A: Using Netlify Dashboard (Recommended for beginners)

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Click "Add new site"** → **"Import an existing project"**
3. **Connect to Git provider** → Select **GitHub**
4. **Authorize Netlify** to access your GitHub repositories
5. **Select your repository**: `video-upload-app` (or your repo name)
6. **Select branch**: `main`

7. **Configure build settings**:
   - **Base directory**: `frontend` ← **IMPORTANT: This tells Netlify where your frontend code is**
   - **Build command**: `npm run build` ← **This runs inside the `frontend/` folder**
   - **Publish directory**: `frontend/dist` ← **This is where Vite outputs the build files**

8. **Click "Show advanced"** → **"New variable"** to add environment variables:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.onrender.com` (your actual backend URL)
   
   - **Key**: `VITE_SOCKET_URL`
   - **Value**: `https://your-backend-url.onrender.com` (your actual backend URL)

9. **Click "Deploy site"**

10. **Wait for deployment** (usually 2-5 minutes)

11. **Get your Frontend URL**:
    - Netlify will show you a URL like:
    - `https://video-upload-app.netlify.app` or `https://random-name-123.netlify.app`
    - **SAVE THIS URL** - You'll need it for backend!

#### Option B: Using Netlify CLI

**From your root folder (`Video_upload/`):**

1. **Install Netlify CLI** (if not installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Navigate to frontend folder**:
   ```bash
   cd frontend
   ```

4. **Initialize Netlify**:
   ```bash
   netlify init
   ```
   
   Follow the prompts:
   - Create & configure a new site
   - Team: Select your team
   - Site name: `your-site-name` (or leave blank for auto-generated)
   - Build command: `npm run build`
   - Directory to deploy: `dist`

5. **Set environment variables**:
   ```bash
   netlify env:set VITE_API_BASE_URL https://your-backend-url.onrender.com
   netlify env:set VITE_SOCKET_URL https://your-backend-url.onrender.com
   ```

6. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

---

## 🔄 Part 3: Update Backend with Frontend URL

**Now that you have both URLs, update the backend:**

1. **Go back to Render Dashboard** → Your backend service
2. **Go to "Environment" tab**
3. **Find `FRONTEND_URL`** environment variable
4. **Click "Edit"** and update the value:
   - Old: `https://your-frontend-url.netlify.app` (placeholder)
   - New: `https://your-actual-frontend-url.netlify.app` (your actual Netlify URL)

5. **Save** - Render will automatically redeploy with the new environment variable

---

## ✅ Part 4: Testing Your Deployment

### Test Backend

1. **Health Check**:
   - Open: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Check Backend Logs**:
   - In Render dashboard → Your backend service → "Logs" tab
   - Should see: "Server running on port 10000"
   - Should see: "MongoDB connected successfully"

### Test Frontend

1. **Open your frontend URL**: `https://your-frontend-url.netlify.app`

2. **Test Login/Register**:
   - Try to register a new account
   - Try to login

3. **Test Video Upload**:
   - Upload a test video
   - Wait for processing to complete

4. **Test Video Playback**:
   - Click "Watch" on a completed video
   - Video should play!

5. **Check Browser Console** (F12):
   - Should see: "Video data loaded: {...}"
   - Should see: "Stream URL: https://your-backend-url.onrender.com/api/videos/...?token=..."
   - Should see: "ReactPlayer ready"
   - **No errors should appear**

---

## 📝 Summary: Exact Folder Structure Reference

### For Backend Deployment (Render):

```
Video_upload/                    ← GitHub repository root
└── backend/                     ← Root Directory in Render
    ├── server.js                ← Entry point (npm start runs this)
    ├── package.json             ← Dependencies (npm install reads this)
    └── ...                      ← All backend code
```

**Render Configuration:**
- **Root Directory**: `backend`
- **Build Command**: `npm install` (runs in `backend/` folder)
- **Start Command**: `npm start` (runs in `backend/` folder)

### For Frontend Deployment (Netlify):

```
Video_upload/                    ← GitHub repository root
└── frontend/                     ← Base Directory in Netlify
    ├── src/                     ← Source code
    ├── package.json             ← Dependencies
    ├── vite.config.js           ← Vite config
    └── dist/                     ← Build output (created by npm run build)
        └── index.html           ← Published file
```

**Netlify Configuration:**
- **Base directory**: `frontend`
- **Build command**: `npm run build` (runs in `frontend/` folder)
- **Publish directory**: `frontend/dist` (where build files are)

---

## 🔧 Environment Variables Summary

### Backend (Render) - Set in Render Dashboard:

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `NODE_ENV` | `production` | Fixed value |
| `PORT` | `10000` | Fixed value (Render uses 10000) |
| `JWT_SECRET` | `your_random_secret` | Generate with `openssl rand -base64 32` |
| `MONGODB_URI` | `mongodb+srv://...` | From MongoDB Atlas |
| `FRONTEND_URL` | `https://your-frontend.netlify.app` | Your Netlify URL |

### Frontend (Netlify) - Set in Netlify Dashboard:

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com` | Your Render backend URL |
| `VITE_SOCKET_URL` | `https://your-backend.onrender.com` | Your Render backend URL |

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Build fails
- **Check**: Root Directory is set to `backend` in Render
- **Check**: `package.json` exists in `backend/` folder
- **Check**: Build logs in Render dashboard

**Problem**: Server won't start
- **Check**: `server.js` exists in `backend/` folder
- **Check**: Start command is `npm start`
- **Check**: All environment variables are set
- **Check**: MongoDB connection string is correct

**Problem**: CORS errors
- **Check**: `FRONTEND_URL` is set correctly in backend
- **Check**: Frontend URL matches your Netlify URL exactly (no trailing slash)

### Frontend Issues

**Problem**: Build fails
- **Check**: Base directory is set to `frontend` in Netlify
- **Check**: `package.json` exists in `frontend/` folder
- **Check**: Build command is `npm run build`
- **Check**: Publish directory is `frontend/dist`

**Problem**: Can't connect to backend
- **Check**: `VITE_API_BASE_URL` is set correctly
- **Check**: Backend URL is accessible (test in browser)
- **Check**: No trailing slash in backend URL
- **Check**: Backend CORS allows your frontend URL

**Problem**: Videos won't play
- **Check**: `VITE_SOCKET_URL` is set correctly
- **Check**: Browser console for errors
- **Check**: Network tab for stream request (should be 200/206, not 401)
- **Check**: Token is being included in stream URL

**Problem**: Environment variables not working
- **Check**: Variables start with `VITE_` prefix
- **Check**: Redeploy after adding variables
- **Check**: Clear browser cache

---

## 📋 Quick Checklist

### Before Starting:
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created and connection string ready
- [ ] Render account created
- [ ] Netlify account created

### Backend Deployment:
- [ ] Repository connected to Render
- [ ] Root Directory set to `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] All environment variables set
- [ ] Backend deployed successfully
- [ ] Backend URL saved
- [ ] Health check works

### Frontend Deployment:
- [ ] Repository connected to Netlify
- [ ] Base directory set to `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/dist`
- [ ] Environment variables set with backend URL
- [ ] Frontend deployed successfully
- [ ] Frontend URL saved

### After Deployment:
- [ ] Backend `FRONTEND_URL` updated with Netlify URL
- [ ] Backend redeployed
- [ ] Frontend can connect to backend
- [ ] Login/Register works
- [ ] Video upload works
- [ ] Video playback works

---

## 🎉 You're Done!

Your application should now be fully deployed and working!

**Backend URL**: `https://your-backend.onrender.com`  
**Frontend URL**: `https://your-frontend.netlify.app`

If you encounter any issues, check the troubleshooting section or the logs in Render/Netlify dashboards.

