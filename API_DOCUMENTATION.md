# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "viewer" | "editor" | "admin" (optional, default: "viewer"),
  "organization": "string" (optional, default: "default")
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "string",
    "organization": "string"
  }
}
```

#### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "string",
    "organization": "string"
  }
}
```

#### Get Current User

```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "string",
    "organization": "string"
  }
}
```

### Videos

#### Upload Video

```http
POST /api/videos/upload
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `video`: File (required)
- `title`: string (optional)

**Response:**
```json
{
  "message": "Video uploaded successfully",
  "video": {
    "id": "video_id",
    "title": "string",
    "status": "uploading",
    "processingProgress": 0
  }
}
```

**Required Role:** Editor or Admin

#### Get All Videos

```http
GET /api/videos
```

**Query Parameters:**
- `status`: string (optional) - Filter by status (uploading, processing, completed, failed)
- `sensitivityStatus`: string (optional) - Filter by sensitivity (safe, flagged, pending)
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)

**Response:**
```json
{
  "videos": [
    {
      "_id": "video_id",
      "title": "string",
      "filename": "string",
      "fileSize": 123456,
      "status": "string",
      "sensitivityStatus": "string",
      "processingProgress": 0,
      "uploadedBy": {
        "_id": "user_id",
        "username": "string",
        "email": "string"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 10
}
```

#### Get Single Video

```http
GET /api/videos/:id
```

**Response:**
```json
{
  "_id": "video_id",
  "title": "string",
  "filename": "string",
  "fileSize": 123456,
  "mimeType": "video/mp4",
  "duration": 120.5,
  "status": "completed",
  "sensitivityStatus": "safe",
  "processingProgress": 100,
  "metadata": {
    "width": 1920,
    "height": 1080,
    "bitrate": 5000000,
    "codec": "h264"
  },
  "uploadedBy": {
    "_id": "user_id",
    "username": "string",
    "email": "string"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Stream Video

```http
GET /api/videos/:id/stream
```

**Headers:**
```
Authorization: Bearer <token>
Range: bytes=0-1023 (optional)
```

**Response:**
- Video stream with HTTP 206 (Partial Content) for range requests
- Video stream with HTTP 200 for full video

**Note:** Supports HTTP range requests for efficient video streaming.

#### Delete Video

```http
DELETE /api/videos/:id
```

**Response:**
```json
{
  "message": "Video deleted successfully"
}
```

**Required Role:** Editor or Admin

### Users

#### Get All Users (Admin Only)

```http
GET /api/users
```

**Response:**
```json
[
  {
    "_id": "user_id",
    "username": "string",
    "email": "string",
    "role": "string",
    "organization": "string",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Required Role:** Admin

#### Update User Role (Admin Only)

```http
PATCH /api/users/:id/role
```

**Request Body:**
```json
{
  "role": "viewer" | "editor" | "admin"
}
```

**Response:**
```json
{
  "message": "User role updated",
  "user": {
    "_id": "user_id",
    "username": "string",
    "email": "string",
    "role": "string",
    "organization": "string"
  }
}
```

**Required Role:** Admin

## WebSocket Events

### Client → Server

#### Subscribe to Video Progress

```javascript
socket.emit('video:subscribe', videoId);
```

#### Unsubscribe from Video Progress

```javascript
socket.emit('video:unsubscribe', videoId);
```

### Server → Client

#### Video Progress Update

```javascript
socket.on('video:progress', (data) => {
  // data: {
  //   videoId: "string",
  //   progress: 0-100,
  //   status: "processing",
  //   sensitivityStatus?: "safe" | "flagged"
  // }
});
```

#### Video Processing Complete

```javascript
socket.on('video:complete', (data) => {
  // data: {
  //   videoId: "string",
  //   status: "completed",
  //   sensitivityStatus: "safe" | "flagged",
  //   metadata: { ... }
  // }
});
```

#### Video Processing Error

```javascript
socket.on('video:error', (data) => {
  // data: {
  //   videoId: "string",
  //   status: "failed",
  //   error: "error message"
  // }
});
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Error Response Format

```json
{
  "message": "Error message",
  "errors": [
    {
      "field": "field_name",
      "message": "Error message"
    }
  ]
}
```

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production use.

## File Upload Limits

- Maximum file size: 500MB
- Allowed MIME types:
  - video/mp4
  - video/webm
  - video/ogg
  - video/quicktime
  - video/x-msvideo

## Multi-Tenant Isolation

All video operations are automatically filtered by the user's organization. Users can only access videos from their own organization unless they are admins.

## Role-Based Access Control

### Viewer
- Can view videos they uploaded
- Cannot upload videos
- Cannot delete videos

### Editor
- Can upload videos
- Can view all videos in their organization
- Can delete videos in their organization
- Cannot manage users

### Admin
- Full access to all features
- Can manage users
- Can access all videos in their organization
- Can update user roles

