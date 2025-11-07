# Setup Guide

This guide will walk you through setting up the Video Upload, Sensitivity Processing, and Streaming Application from scratch.

## Step 1: Prerequisites Installation

### Install Node.js

1. Visit [nodejs.org](https://nodejs.org/)
2. Download and install the LTS version (v18 or higher)
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Install MongoDB

**Option A: Local MongoDB**

1. Visit [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download and install MongoDB Community Server
3. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string

### Install FFmpeg

**Windows:**
1. Download from [ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Extract to a folder (e.g., `C:\ffmpeg`)
3. Add to PATH:
   - Open System Properties → Environment Variables
   - Add `C:\ffmpeg\bin` to Path variable
4. Verify:
   ```bash
   ffmpeg -version
   ```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

## Step 2: Project Setup

### Clone or Navigate to Project Directory

```bash
cd Video_upload
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Step 3: Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env  # On Windows: type nul > .env
```

Add the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/video_upload
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important:** 
- Replace `JWT_SECRET` with a strong random string (at least 32 characters)
- If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string

### Frontend Configuration

The frontend is pre-configured to proxy API requests to `http://localhost:5000`. No additional configuration needed for development.

## Step 4: Create Required Directories

The `uploads` directory will be created automatically when you first upload a video. However, you can create it manually:

```bash
# From project root
mkdir backend/uploads
```

## Step 5: Start the Application

### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
MongoDB connected successfully
Server running on port 5000
```

### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Step 6: Verify Installation

1. Open your browser and navigate to `http://localhost:5173`
2. You should see the login page
3. Register a new user account
4. Try uploading a video

## Step 7: Create Test Users

### Option 1: Through UI
1. Navigate to Register page
2. Create users with different roles:
   - Viewer
   - Editor
   - Admin

### Option 2: Using MongoDB Shell

```bash
mongosh video_upload
```

```javascript
use video_upload

// Create admin user (password will be hashed by the app)
// Note: This is just for reference - use the registration endpoint
```

## Troubleshooting

### Issue: MongoDB Connection Failed

**Symptoms:**
```
MongoDB connection error: connect ECONNREFUSED
```

**Solutions:**
1. Ensure MongoDB is running:
   ```bash
   # Check MongoDB status
   # Windows: Check Services
   # macOS/Linux: sudo systemctl status mongod
   ```
2. Verify connection string in `.env`
3. Check MongoDB port (default: 27017)

### Issue: FFmpeg Not Found

**Symptoms:**
```
Error: ffmpeg not found
```

**Solutions:**
1. Verify FFmpeg installation:
   ```bash
   ffmpeg -version
   ```
2. Ensure FFmpeg is in PATH
3. Restart terminal/IDE after installation

### Issue: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Find and kill process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill
   ```
2. Or change PORT in `.env` file

### Issue: CORS Errors

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
2. Check CORS configuration in `backend/server.js`
3. Clear browser cache

### Issue: Video Upload Fails

**Solutions:**
1. Check file size (max 500MB)
2. Verify file type is supported
3. Check `backend/uploads` directory permissions
4. Ensure sufficient disk space

### Issue: Socket.io Connection Failed

**Symptoms:**
```
WebSocket connection failed
```

**Solutions:**
1. Ensure backend server is running
2. Check Socket.io CORS configuration
3. Verify token is being sent correctly
4. Check browser console for detailed errors

## Development Tips

### Hot Reload

Both backend (with nodemon) and frontend (with Vite) support hot reload. Changes will automatically restart the server or refresh the browser.

### Database Reset

To reset the database:

```bash
mongosh video_upload
db.dropDatabase()
```

### View Uploaded Videos

Uploaded videos are stored in `backend/uploads/` directory. You can access them directly via:
```
http://localhost:5000/uploads/<filename>
```

### Debugging

**Backend:**
- Check console logs in terminal
- Use `console.log()` for debugging
- Check MongoDB logs

**Frontend:**
- Use browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API requests
- Use React DevTools extension

## Production Deployment Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or secure database
- [ ] Configure cloud storage (AWS S3, etc.) instead of local storage
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up environment variables on hosting platform
- [ ] Configure file upload limits
- [ ] Set up monitoring and logging
- [ ] Implement rate limiting
- [ ] Add comprehensive error handling
- [ ] Set up backup strategy
- [ ] Configure CDN for video delivery

## Next Steps

1. Read [README.md](./README.md) for feature overview
2. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
3. Explore the codebase structure
4. Customize for your needs

## Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review error messages carefully
3. Check GitHub issues (if applicable)
4. Review logs for detailed error information

---

**Happy Coding! 🚀**

