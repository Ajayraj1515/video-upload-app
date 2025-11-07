# Video Upload, Processing, and Streaming Application

A comprehensive full-stack application that enables users to upload videos, processes them for content sensitivity analysis, and provides seamless video streaming capabilities with real-time progress tracking.

## 🌐 Live Deployment

### Production URLs

- **Frontend (Netlify)**: https://video-upload-app.netlify.app
- **Backend (Render)**: https://video-upload-app-backend.onrender.com

### Quick Access

- **Login Page**: https://video-upload-app.netlify.app/login
- **Register Page**: https://video-upload-app.netlify.app/register
- **Dashboard**: https://video-upload-app.netlify.app/dashboard
- **Video Library**: https://video-upload-app.netlify.app/library
- **Upload Video**: https://video-upload-app.netlify.app/upload

### API Health Check

- **Backend Health**: https://video-upload-app-backend.onrender.com/api/health

## 🚀 Features

### Core Functionality
- **Video Upload**: Secure video upload with file validation and progress tracking
- **Content Analysis**: Automated sensitivity detection (safe/flagged classification)
- **Real-Time Updates**: Live processing progress via Socket.io
- **Video Streaming**: HTTP range request support for efficient video playback
- **Multi-Tenant Architecture**: User isolation with organization-based data segregation
- **Role-Based Access Control**: Viewer, Editor, and Admin roles with appropriate permissions
- **Modern UI**: Beautiful gradient design with smooth animations

### User Roles
- **Viewer**: Read-only access to assigned videos
- **Editor**: Upload, edit, and manage video content
- **Admin**: Full system access including user management

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher) - Local installation or MongoDB Atlas
- FFmpeg (for video metadata extraction)
- npm or yarn

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Video_upload
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/video_upload
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Install FFmpeg

**Windows:**
- Download from [FFmpeg website](https://ffmpeg.org/download.html)
- Add to PATH environment variable

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

## 🚀 Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod
```

Or use MongoDB Atlas connection string in `.env` file.

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
Video_upload/
├── backend/
│   ├── models/          # MongoDB models (User, Video)
│   ├── routes/          # API routes (auth, videos, users)
│   ├── middleware/      # Authentication and authorization
│   ├── services/        # Business logic (video processing)
│   ├── socket/          # Socket.io handlers
│   ├── uploads/         # Uploaded video files (created automatically)
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── context/     # React context providers
│   │   ├── pages/       # Page components
│   │   ├── config/      # API configuration
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and sent with each API request.

### Default Test Users

You can register users through the registration page. Roles available:
- `viewer`: Can view assigned videos
- `editor`: Can upload and manage videos
- `admin`: Full system access

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Videos
- `POST /api/videos/upload` - Upload video (Editor/Admin only)
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get single video
- `GET /api/videos/:id/stream` - Stream video
- `DELETE /api/videos/:id` - Delete video (Editor/Admin only)

### Health Check
- `GET /api/health` - Server health check

## 🎥 Video Processing Pipeline

1. **Upload**: Video file is uploaded and validated
2. **Storage**: File is stored securely with unique naming
3. **Metadata Extraction**: FFmpeg extracts video metadata (duration, resolution, codec)
4. **Sensitivity Analysis**: Content is analyzed for sensitive material
5. **Status Updates**: Real-time progress updates via Socket.io
6. **Streaming Ready**: Video is ready for streaming once processing completes

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Multi-tenant data isolation
- File type and size validation
- Secure file storage
- CORS protection
- Token-based video streaming

## 🚢 Deployment

### Deployment Status

✅ **Backend**: Deployed on Render  
✅ **Frontend**: Deployed on Netlify  
✅ **Database**: MongoDB Atlas  
✅ **Video Streaming**: Working with authentication

### Deployment Details

**Backend (Render):**
- URL: https://video-upload-app-backend.onrender.com
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Port: 10000 (Render default)

**Frontend (Netlify):**
- URL: https://video-upload-app.netlify.app
- Base Directory: `frontend`
- Build Command: `npm run build`
- Publish Directory: `frontend/dist`

### Environment Variables

**Backend (Render):**
- `NODE_ENV=production`
- `PORT=10000`
- `JWT_SECRET=<your-secret>`
- `MONGODB_URI=<your-mongodb-uri>`
- `FRONTEND_URL=https://video-upload-app.netlify.app`

**Frontend (Netlify):**
- `VITE_API_BASE_URL=https://video-upload-app-backend.onrender.com`
- `VITE_SOCKET_URL=https://video-upload-app-backend.onrender.com`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in `.env` file

2. **FFmpeg Not Found**
   - Install FFmpeg and add to PATH
   - Restart terminal/IDE after installation

3. **Port Already in Use**
   - Change PORT in backend `.env` file
   - Update frontend proxy in `vite.config.js`

4. **CORS Errors**
   - Ensure FRONTEND_URL in backend `.env` matches frontend URL
   - Check CORS configuration in `server.js`

5. **Login Fails / Connection Error**
   - Check environment variables in Netlify are set correctly
   - Verify `VITE_API_BASE_URL` points to backend URL
   - Check backend `FRONTEND_URL` matches frontend URL
   - Clear browser cache and try again

6. **Video Won't Play**
   - Check video status is "completed"
   - Verify token is included in stream URL
   - Check browser console for errors
   - Verify backend CORS allows frontend URL

## 📝 Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/video_upload |
| JWT_SECRET | Secret key for JWT tokens | (required) |
| JWT_EXPIRE | Token expiration time | 7d |
| NODE_ENV | Environment mode | development |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

### Frontend (Netlify Environment Variables)

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_BASE_URL | Backend API URL | Yes |
| VITE_SOCKET_URL | Socket.IO URL | Yes |

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Video upload with progress tracking
- [ ] Real-time processing updates
- [ ] Video streaming playback
- [ ] Role-based access control
- [ ] Multi-tenant isolation
- [ ] Video filtering and search
- [ ] Video deletion

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.

---

## 🎯 Recent Updates

### Video Playback Fix
- Fixed video streaming authentication issue
- Added token support in stream URL for ReactPlayer
- Enhanced error handling and debugging

### UI Improvements
- Modern gradient design
- Smooth animations and transitions
- Enhanced user experience
- Responsive design

### Deployment
- Full-stack deployment on Render (backend) and Netlify (frontend)
- Environment variable configuration
- CORS setup for production
- Video streaming with authentication

---

**Note**: This is a demonstration application. For production use, consider:
- Implementing actual ML-based content analysis
- Using cloud storage (AWS S3, Google Cloud Storage)
- Adding comprehensive error handling
- Implementing rate limiting
- Adding comprehensive testing
- Setting up CI/CD pipeline
- Implementing video compression and optimization
