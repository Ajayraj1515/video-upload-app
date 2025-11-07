# Architecture Overview

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend.

```
┌─────────────────┐
│   React Frontend │
│   (Vite + React) │
└────────┬─────────┘
         │ HTTP/REST API
         │ WebSocket (Socket.io)
         │
┌────────▼─────────┐
│  Express Backend │
│  (Node.js)       │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│MongoDB│ │File   │
│       │ │System │
└───────┘ └───────┘
```

## Backend Architecture

### Directory Structure

```
backend/
├── models/           # Data models (Mongoose schemas)
│   ├── User.js      # User model with authentication
│   └── Video.js     # Video model with metadata
├── routes/          # API route handlers
│   ├── auth.js      # Authentication endpoints
│   ├── videos.js    # Video CRUD operations
│   └── users.js     # User management (admin)
├── middleware/      # Express middleware
│   └── auth.js      # JWT authentication & authorization
├── services/        # Business logic
│   └── videoProcessor.js  # Video processing pipeline
├── socket/          # WebSocket handlers
│   ├── socketHandler.js   # Socket.io connection management
│   └── ioInstance.js      # Socket.io singleton
└── server.js        # Application entry point
```

### Key Components

#### 1. Authentication & Authorization

- **JWT-based Authentication**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: Three roles (Viewer, Editor, Admin)
- **Multi-Tenant Isolation**: Organization-based data segregation

**Flow:**
```
User Login → JWT Token → Middleware Validation → Role Check → Access Control
```

#### 2. Video Processing Pipeline

```
Upload → Validation → Storage → Metadata Extraction → Sensitivity Analysis → Status Update
```

**Components:**
- **Multer**: File upload handling
- **FFmpeg**: Video metadata extraction
- **Custom Analyzer**: Sensitivity detection (simulated)
- **Socket.io**: Real-time progress updates

#### 3. Real-Time Communication

**Socket.io Events:**
- `video:progress` - Processing progress updates
- `video:complete` - Processing completion
- `video:error` - Processing errors

**Room Management:**
- Organization-based rooms for multi-tenant isolation
- Video-specific rooms for targeted updates

#### 4. Video Streaming

**HTTP Range Requests:**
- Supports partial content requests
- Efficient video streaming
- Browser-compatible playback

## Frontend Architecture

### Directory Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/         # React Context providers
│   │   ├── AuthContext.jsx    # Authentication state
│   │   └── SocketContext.jsx  # WebSocket connection
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Upload.jsx
│   │   ├── VideoLibrary.jsx
│   │   └── VideoPlayer.jsx
│   ├── App.jsx          # Main app component
│   └── main.jsx          # Entry point
└── index.html
```

### State Management

**React Context API:**
- `AuthContext`: User authentication state
- `SocketContext`: WebSocket connection management

**Local State:**
- Component-level state for UI interactions
- Form state management

### Routing

**React Router:**
- Protected routes with `PrivateRoute` component
- Dynamic routes for video playback
- Navigation guards based on authentication

## Data Flow

### Video Upload Flow

```
1. User selects video file
2. Frontend validates file (size, type)
3. POST /api/videos/upload (multipart/form-data)
4. Backend validates and stores file
5. Video record created in MongoDB
6. Background processing starts
7. Socket.io emits progress updates
8. Frontend receives real-time updates
9. Processing completes
10. Video ready for streaming
```

### Video Streaming Flow

```
1. User requests video playback
2. GET /api/videos/:id/stream
3. Backend checks authentication & authorization
4. Backend reads file with range request support
5. Streams video chunks to client
6. React Player handles playback
```

### Authentication Flow

```
1. User submits credentials
2. POST /api/auth/login
3. Backend validates credentials
4. JWT token generated
5. Token stored in localStorage
6. Token included in subsequent requests
7. Middleware validates token on protected routes
```

## Security Architecture

### Authentication

- **JWT Tokens**: Stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Token Expiration**: Configurable expiration time

### Authorization

- **Role-Based**: Viewer, Editor, Admin roles
- **Resource-Based**: Ownership and organization checks
- **Middleware Chain**: Authentication → Authorization → Ownership

### Data Isolation

- **Organization-Based**: Multi-tenant data segregation
- **User-Based**: Viewer role sees only own videos
- **Role-Based**: Editor sees organization videos

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['viewer', 'editor', 'admin']),
  organization: String,
  createdAt: Date
}
```

### Video Collection

```javascript
{
  _id: ObjectId,
  title: String,
  filename: String,
  originalFilename: String,
  filePath: String,
  fileSize: Number,
  mimeType: String,
  duration: Number,
  status: String (enum: ['uploading', 'processing', 'completed', 'failed']),
  sensitivityStatus: String (enum: ['safe', 'flagged', 'pending']),
  processingProgress: Number (0-100),
  uploadedBy: ObjectId (ref: User),
  organization: String,
  metadata: {
    width: Number,
    height: Number,
    bitrate: Number,
    codec: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `uploadedBy + organization` (compound)
- `status + sensitivityStatus` (compound)
- `createdAt` (descending)

## API Design

### RESTful Principles

- **Resource-Based URLs**: `/api/videos/:id`
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: Appropriate HTTP status codes
- **Error Handling**: Consistent error response format

### WebSocket Design

- **Event-Based**: Named events for different actions
- **Room-Based**: Organization and video-specific rooms
- **Authentication**: Token-based Socket.io authentication

## Scalability Considerations

### Current Limitations

- **File Storage**: Local filesystem (not scalable)
- **Processing**: Single-threaded processing
- **Database**: Single MongoDB instance

### Production Recommendations

1. **File Storage**: 
   - Use cloud storage (AWS S3, Google Cloud Storage)
   - Implement CDN for video delivery

2. **Processing**:
   - Use message queue (RabbitMQ, Redis)
   - Separate processing workers
   - Implement job queue system

3. **Database**:
   - MongoDB replica set
   - Read replicas for scaling reads
   - Sharding for large datasets

4. **Caching**:
   - Redis for session management
   - Cache frequently accessed videos
   - CDN for static assets

5. **Load Balancing**:
   - Multiple backend instances
   - Load balancer (nginx, AWS ELB)
   - Sticky sessions for Socket.io

## Error Handling

### Backend Error Handling

- **Try-Catch Blocks**: Comprehensive error catching
- **Error Middleware**: Centralized error handling
- **Validation**: Input validation with express-validator
- **Database Errors**: Mongoose error handling

### Frontend Error Handling

- **API Errors**: Axios interceptors
- **User Feedback**: Error messages in UI
- **Fallback UI**: Graceful degradation

## Testing Strategy

### Recommended Testing

1. **Unit Tests**: 
   - Service functions
   - Utility functions
   - Middleware functions

2. **Integration Tests**:
   - API endpoints
   - Database operations
   - Authentication flow

3. **E2E Tests**:
   - Complete user workflows
   - Video upload and processing
   - Streaming functionality

## Deployment Architecture

### Recommended Stack

- **Backend**: Node.js on cloud platform (Heroku, Railway, Render)
- **Frontend**: Static hosting (Netlify, Vercel, AWS S3 + CloudFront)
- **Database**: MongoDB Atlas
- **Storage**: AWS S3 or Google Cloud Storage
- **CDN**: CloudFront or Cloudflare

### Environment Configuration

- **Development**: Local MongoDB, local file storage
- **Staging**: Cloud database, cloud storage
- **Production**: Full cloud infrastructure with monitoring

## Future Enhancements

1. **Advanced Processing**:
   - ML-based content analysis
   - Video transcoding
   - Thumbnail generation

2. **Performance**:
   - Video compression
   - Adaptive bitrate streaming
   - Progressive loading

3. **Features**:
   - Video comments
   - Playlists
   - Sharing capabilities
   - Analytics dashboard

---

This architecture provides a solid foundation for a scalable video upload and streaming application while maintaining code organization and separation of concerns.

