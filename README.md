# Video Upload, Sensitivity Processing, and Streaming Application

A comprehensive full-stack application that enables users to upload videos, processes them for content sensitivity analysis, and provides seamless video streaming capabilities with real-time progress tracking.

## 🚀 Features

### Core Functionality
- **Video Upload**: Secure video upload with file validation and progress tracking
- **Content Analysis**: Automated sensitivity detection (safe/flagged classification)
- **Real-Time Updates**: Live processing progress via Socket.io
- **Video Streaming**: HTTP range request support for efficient video playback
- **Multi-Tenant Architecture**: User isolation with organization-based data segregation
- **Role-Based Access Control**: Viewer, Editor, and Admin roles with appropriate permissions

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

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

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

## 🚢 Deployment

### Backend Deployment

1. Set environment variables on hosting platform
2. Ensure MongoDB Atlas or cloud database is configured
3. Set up file storage (local or cloud storage like AWS S3)
4. Deploy to platform (Heroku, Railway, Render, etc.)

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy `dist` folder to hosting platform (Netlify, Vercel, etc.)
3. Update API URLs in production environment

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

**Note**: This is a demonstration application. For production use, consider:
- Implementing actual ML-based content analysis
- Using cloud storage (AWS S3, Google Cloud Storage)
- Adding comprehensive error handling
- Implementing rate limiting
- Adding comprehensive testing
- Setting up CI/CD pipeline
- Implementing video compression and optimization

