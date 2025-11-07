# Deployment Folder Structure - Visual Guide

## 📁 Your Exact Folder Structure

```
Video_upload/                           ← This is your GitHub repository root
│
├── backend/                            ← Backend folder (deploy this to Render)
│   ├── server.js                       ← Backend entry point
│   ├── package.json                    ← Backend dependencies
│   ├── routes/
│   │   ├── auth.js
│   │   ├── videos.js
│   │   └── users.js
│   ├── models/
│   │   ├── User.js
│   │   └── Video.js
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   └── videoProcessor.js
│   ├── socket/
│   │   ├── ioInstance.js
│   │   └── socketHandler.js
│   ├── utils/
│   │   ├── fixDefaultUser.js
│   │   └── initializeDefaultUser.js
│   └── uploads/                        ← Video files stored here
│
└── frontend/                            ← Frontend folder (deploy this to Netlify)
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── config/
    │   │   └── api.js                   ← API configuration
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── SocketContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Upload.jsx
    │   │   ├── VideoLibrary.jsx
    │   │   └── VideoPlayer.jsx
    │   └── components/
    │       └── Navbar.jsx
    ├── index.html                       ← HTML entry point
    ├── package.json                     ← Frontend dependencies
    ├── vite.config.js                   ← Vite configuration
    └── dist/                            ← Build output (created after npm run build)
        └── index.html                   ← Production HTML
```

---

## 🎯 Render Configuration (Backend)

### What Render Needs to Know:

**Root Directory**: `backend`  
**This tells Render**: "All my backend code is in the `backend/` folder"

**Build Command**: `npm install`  
**This runs**: Inside the `backend/` folder  
**What it does**: Installs dependencies from `backend/package.json`

**Start Command**: `npm start`  
**This runs**: Inside the `backend/` folder  
**What it does**: Runs `backend/server.js` (as defined in `backend/package.json`)

### Visual Representation:

```
Render Deployment Process:
1. Clone repository (Video_upload/)
   ↓
2. Navigate to backend/ folder
   ↓
3. Run: npm install (reads backend/package.json)
   ↓
4. Run: npm start (runs backend/server.js)
   ↓
5. Server starts on port 10000
```

---

## 🎨 Netlify Configuration (Frontend)

### What Netlify Needs to Know:

**Base Directory**: `frontend`  
**This tells Netlify**: "All my frontend code is in the `frontend/` folder"

**Build Command**: `npm run build`  
**This runs**: Inside the `frontend/` folder  
**What it does**: 
- Reads `frontend/package.json`
- Runs Vite build process
- Creates `frontend/dist/` folder with production files

**Publish Directory**: `frontend/dist`  
**This tells Netlify**: "Serve files from the `frontend/dist/` folder"

### Visual Representation:

```
Netlify Deployment Process:
1. Clone repository (Video_upload/)
   ↓
2. Navigate to frontend/ folder
   ↓
3. Run: npm install (reads frontend/package.json)
   ↓
4. Run: npm run build (creates frontend/dist/)
   ↓
5. Serve files from frontend/dist/
```

---

## 📝 Step-by-Step: Exact Commands

### Step 1: Push to GitHub (from Video_upload/ folder)

```bash
# You are here: Video_upload/
cd Video_upload

# Initialize git (if not done)
git init
git add .
git commit -m "Ready for deployment"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/video-upload-app.git
git push -u origin main
```

### Step 2: Deploy Backend to Render

**In Render Dashboard:**
1. New → Web Service
2. Connect GitHub → Select `video-upload-app`
3. Configure:
   - **Name**: `video-upload-backend`
   - **Root Directory**: `backend` ← **Type exactly: backend**
   - **Build Command**: `npm install` ← **This runs in backend/ folder**
   - **Start Command**: `npm start` ← **This runs in backend/ folder**
4. Add Environment Variables (see guide)
5. Deploy

### Step 3: Deploy Frontend to Netlify

**In Netlify Dashboard:**
1. Add new site → Import from Git → GitHub
2. Select `video-upload-app`
3. Configure:
   - **Base directory**: `frontend` ← **Type exactly: frontend**
   - **Build command**: `npm run build` ← **This runs in frontend/ folder**
   - **Publish directory**: `frontend/dist` ← **Type exactly: frontend/dist**
4. Add Environment Variables:
   - `VITE_API_BASE_URL` = `https://your-backend.onrender.com`
   - `VITE_SOCKET_URL` = `https://your-backend.onrender.com`
5. Deploy

---

## 🔍 How to Verify Folder Structure

### Check Backend Structure:

```bash
# From Video_upload/ folder
cd backend
ls -la

# Should see:
# - server.js
# - package.json
# - routes/
# - models/
# - middleware/
# etc.
```

### Check Frontend Structure:

```bash
# From Video_upload/ folder
cd frontend
ls -la

# Should see:
# - src/
# - package.json
# - vite.config.js
# - index.html
```

### Test Build Locally:

**Test Backend:**
```bash
# From Video_upload/ folder
cd backend
npm install
npm start
# Should start server on port 5000
```

**Test Frontend:**
```bash
# From Video_upload/ folder
cd frontend
npm install
npm run build
# Should create dist/ folder
ls dist/
# Should see: index.html, assets/, etc.
```

---

## ⚠️ Common Mistakes

### ❌ Wrong: Root Directory = "Video_upload"
**Why**: Render will look for `server.js` in root, but it's in `backend/`

### ✅ Correct: Root Directory = "backend"
**Why**: Render finds `backend/server.js` correctly

### ❌ Wrong: Build Command = "cd backend && npm install"
**Why**: Not needed if Root Directory is set correctly

### ✅ Correct: Build Command = "npm install"
**Why**: Render already navigates to `backend/` folder

### ❌ Wrong: Publish Directory = "dist"
**Why**: Netlify will look for `dist/` in root, but it's in `frontend/dist/`

### ✅ Correct: Publish Directory = "frontend/dist"
**Why**: Netlify finds the build output correctly

---

## 📋 Quick Reference

### Render (Backend):
- **Repository**: `video-upload-app` (your GitHub repo)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Netlify (Frontend):
- **Repository**: `video-upload-app` (your GitHub repo)
- **Base Directory**: `frontend`
- **Build Command**: `npm run build`
- **Publish Directory**: `frontend/dist`

---

## 🎯 Summary

**The key point**: Both Render and Netlify need to know which **subfolder** contains your code.

- **Render** needs: `backend/` folder
- **Netlify** needs: `frontend/` folder

That's why you set:
- **Root Directory** (Render) = `backend`
- **Base Directory** (Netlify) = `frontend`

This tells each platform: "My code is not in the root, it's in this subfolder!"

