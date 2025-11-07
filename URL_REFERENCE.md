# URL Reference Guide

## 🌐 Frontend URLs (React App)

**Base URL:** `http://localhost:5173`

### Public Routes
- `/` - Redirects to `/dashboard` (if authenticated) or `/login`
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Require Authentication)
- `/dashboard` - Main dashboard with video statistics
- `/upload` - Video upload page (Editor/Admin only)
- `/library` - Video library with filtering
- `/video/:id` - Video player page

---

## 🔧 Backend API URLs

**Base URL:** `http://localhost:5000/api`

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
```
**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "viewer" | "editor" | "admin" (optional)
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
```
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
```
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`

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

---

### Video Endpoints

#### Upload Video
```
POST /api/videos/upload
```
**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `video`: File (required)
- `title`: string (optional)

**Required Role:** Editor or Admin

#### Get All Videos
```
GET /api/videos
```
**Query Parameters:**
- `status`: string (optional) - uploading, processing, completed, failed
- `sensitivityStatus`: string (optional) - safe, flagged, pending
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)

**Headers:** `Authorization: Bearer <token>`

#### Get Single Video
```
GET /api/videos/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Stream Video
```
GET /api/videos/:id/stream
```
**Headers:** `Authorization: Bearer <token>`
**Supports:** HTTP Range Requests for video streaming

#### Delete Video
```
DELETE /api/videos/:id
```
**Headers:** `Authorization: Bearer <token>`
**Required Role:** Editor or Admin

---

### User Management Endpoints (Admin Only)

#### Get All Users
```
GET /api/users
```
**Headers:** `Authorization: Bearer <token>`
**Required Role:** Admin

#### Update User Role
```
PATCH /api/users/:id/role
```
**Headers:** `Authorization: Bearer <token>`
**Request Body:**
```json
{
  "role": "viewer" | "editor" | "admin"
}
```
**Required Role:** Admin

---

### Health Check

#### Server Health
```
GET /api/health
```
**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 🧪 Testing URLs

### Test Login (Default Admin)
- **URL:** `http://localhost:5173/login`
- **Email:** `ajayraj123@gmail.com`
- **Password:** `Ajayraj123`

### Test Registration
- **URL:** `http://localhost:5173/register`
- Fill in the form and submit

### Test Backend Health
- **URL:** `http://localhost:5000/api/health`
- Should return: `{"status":"OK","message":"Server is running"}`

### Test Authentication
- **URL:** `http://localhost:5000/api/auth/me`
- **Method:** GET
- **Headers:** `Authorization: Bearer <your_token>`

---

## 🔍 Debugging Tips

### Check if Backend is Running
```bash
curl http://localhost:5000/api/health
```

### Check if Frontend is Running
Open browser: `http://localhost:5173`

### Check Browser Console
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for API requests

### Check Backend Logs
Look at the terminal where backend is running for:
- Login attempts
- Registration attempts
- Error messages

---

## 📝 Common Issues

### Blank Dashboard Page
1. Check if user is authenticated (check browser console)
2. Check if token is stored in localStorage
3. Check backend logs for API errors
4. Verify `/api/videos` endpoint is accessible

### Login Not Working
1. Check backend console for login attempt logs
2. Verify user exists in database
3. Check password is correct
4. Verify JWT_SECRET is set in `.env`

### Registration Redirects but Blank Page
1. Check if token was received from registration
2. Check browser console for errors
3. Verify user was created in database
4. Check if `/api/videos` endpoint requires authentication

---

## 🔐 Default Admin Credentials

- **Email:** `ajayraj123@gmail.com`
- **Password:** `Ajayraj123`
- **Role:** `admin`
- **Username:** `Ajayraj`

This user is automatically created when the backend starts.

