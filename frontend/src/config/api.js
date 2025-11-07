// API Configuration
// In production, these will be set via environment variables
// Vite uses VITE_ prefix for environment variables

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const config = {
  API_BASE_URL,
  SOCKET_URL,
  // Helper function to get full API URL
  getApiUrl: (path) => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  },
  // Helper function to get stream URL
  getStreamUrl: (videoId) => {
    return `${API_BASE_URL}/api/videos/${videoId}/stream`;
  }
};

export default config;

