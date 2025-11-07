# Environment Variables Setup Guide

This is a quick reference for setting up environment variables for deployment.

## Backend Environment Variables (Render)

Set these in your Render dashboard → Environment tab:

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video_upload?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend-url.netlify.app
```

### How to Get Values:

1. **JWT_SECRET**: Generate a random string (at least 32 characters)
   - You can use: `openssl rand -base64 32`
   - Or any random string generator

2. **MONGODB_URI**: Get from MongoDB Atlas
   - Go to MongoDB Atlas → Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `video_upload` with your database name

3. **FRONTEND_URL**: Your deployed frontend URL
   - Netlify: `https://your-site-name.netlify.app`
   - Render: `https://your-site-name.onrender.com`

---

## Frontend Environment Variables (Netlify/Render)

Set these in your Netlify/Render dashboard → Environment variables:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

### Important Notes:

- **Vite requires `VITE_` prefix** for environment variables
- Replace `your-backend-url.onrender.com` with your actual Render backend URL
- These variables are exposed to the client (browser), so don't put secrets here

---

## Local Development Setup

### Backend `.env` file (in `backend/` folder):

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_local_secret_key_here
MONGODB_URI=mongodb://localhost:27017/video_upload
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` file (in `frontend/` folder):

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

**Note**: For local development, you don't need these files if you're using the Vite proxy. The code defaults to `http://localhost:5000` if environment variables are not set.

---

## Quick Checklist

### Before Deploying Backend:
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string ready
- [ ] JWT_SECRET generated
- [ ] All environment variables ready

### Before Deploying Frontend:
- [ ] Backend deployed and URL obtained
- [ ] Environment variables set with backend URL
- [ ] Build tested locally (`npm run build`)

### After Deployment:
- [ ] Backend health check works: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads without errors
- [ ] Frontend can connect to backend
- [ ] Login/Register works
- [ ] Video upload works
- [ ] Video playback works

---

## Where to Set Environment Variables

### Render (Backend):
1. Go to your service dashboard
2. Click on **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Enter key and value
5. Save (auto-redeploys)

### Netlify (Frontend):
1. Go to your site dashboard
2. Click **"Site settings"**
3. Click **"Environment variables"**
4. Click **"Add variable"**
5. Enter key and value
6. Redeploy site

### Render (Frontend - Static Site):
1. Go to your static site dashboard
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Enter key and value
5. Save (auto-redeploys)

---

## Troubleshooting

**Problem**: Environment variables not working
- **Solution**: Ensure variable names are correct (case-sensitive)
- **Solution**: For Vite, ensure variables start with `VITE_`
- **Solution**: Redeploy after adding environment variables
- **Solution**: Clear browser cache

**Problem**: Can't connect to backend
- **Solution**: Verify `VITE_API_BASE_URL` matches your backend URL exactly
- **Solution**: Check backend CORS settings allow your frontend URL
- **Solution**: Ensure backend is running and accessible

**Problem**: Socket.IO not connecting
- **Solution**: Verify `VITE_SOCKET_URL` matches your backend URL
- **Solution**: Check backend Socket.IO CORS configuration
- **Solution**: Ensure WebSocket connections are allowed

