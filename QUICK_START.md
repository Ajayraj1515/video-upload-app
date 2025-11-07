# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Check

```bash
node --version    # Should be v18+
npm --version     # Should be v8+
mongod --version  # MongoDB should be installed
ffmpeg -version   # FFmpeg should be installed
```

## Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Configuration

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/video_upload
JWT_SECRET=change_this_to_a_random_secret_key_at_least_32_characters_long
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Access the Application

1. Open browser: `http://localhost:5173`
2. Register a new account
3. Upload a video!

## Default Test Accounts

Create accounts through the registration page:
- **Viewer**: Can view videos
- **Editor**: Can upload and manage videos
- **Admin**: Full access

## Troubleshooting

- **MongoDB not running?** Start it: `mongod` or use MongoDB Atlas
- **Port in use?** Change PORT in `.env`
- **FFmpeg error?** Install FFmpeg and add to PATH

For detailed setup, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

