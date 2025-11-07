import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    completed: 0,
    flagged: 0
  });
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('video:progress', (data) => {
        setVideos(prev => prev.map(video =>
          video._id === data.videoId
            ? { ...video, processingProgress: data.progress, status: data.status }
            : video
        ));
      });

      socket.on('video:complete', (data) => {
        setVideos(prev => prev.map(video =>
          video._id === data.videoId
            ? {
                ...video,
                status: data.status,
                sensitivityStatus: data.sensitivityStatus,
                processingProgress: 100,
                metadata: data.metadata
              }
            : video
        ));
        updateStats();
      });

      socket.on('video:error', (data) => {
        setVideos(prev => prev.map(video =>
          video._id === data.videoId
            ? { ...video, status: 'failed' }
            : video
        ));
      });

      return () => {
        socket.off('video:progress');
        socket.off('video:complete');
        socket.off('video:error');
      };
    }
  }, [socket]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/videos?limit=5');
      setVideos(response.data.videos);
      calculateStats(response.data.videos);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      // If unauthorized, user might not be logged in properly
      if (error.response?.status === 401) {
        console.error('Authentication error - redirecting to login');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (videoList) => {
    const stats = {
      total: videoList.length,
      processing: 0,
      completed: 0,
      flagged: 0
    };

    videoList.forEach(video => {
      if (video.status === 'processing' || video.status === 'uploading') {
        stats.processing++;
      }
      if (video.status === 'completed') {
        stats.completed++;
      }
      if (video.sensitivityStatus === 'flagged') {
        stats.flagged++;
      }
    });

    setStats(stats);
  };

  const updateStats = () => {
    fetchVideos();
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Dashboard</h1>
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show user info for debugging
  if (!user) {
    return (
      <div className="container">
        <h1>Dashboard</h1>
        <div className="card">
          <p className="error-message">Not authenticated. Please log in.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      {user && (
        <div style={{ marginBottom: '20px', padding: '10px', background: '#e3f2fd', borderRadius: '6px' }}>
          <p><strong>Welcome, {user.username}!</strong> (Role: {user.role})</p>
        </div>
      )}
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Videos</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Processing</h3>
          <p className="stat-number">{stats.processing}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{stats.completed}</p>
        </div>
        <div className="stat-card">
          <h3>Flagged</h3>
          <p className="stat-number">{stats.flagged}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent Videos</h2>
          <Link to="/library" className="btn btn-secondary">
            View All
          </Link>
        </div>
        
        {videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          <div className="video-list">
            {videos.map(video => (
              <div key={video._id} className="video-item">
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p className="video-meta">
                    Uploaded by {video.uploadedBy?.username || 'Unknown'} • {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                  <div className="video-status">
                    <span className={`status-badge status-${video.status}`}>
                      {video.status}
                    </span>
                    <span className={`status-badge status-${video.sensitivityStatus}`}>
                      {video.sensitivityStatus}
                    </span>
                  </div>
                  {video.status === 'processing' && (
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${video.processingProgress || 0}%` }}
                      >
                        {video.processingProgress || 0}%
                      </div>
                    </div>
                  )}
                </div>
                <div className="video-actions">
                  {video.status === 'completed' && (
                    <Link to={`/video/${video._id}`} className="btn btn-primary">
                      Watch
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(user?.role === 'editor' || user?.role === 'admin') && (
        <div className="card">
          <h2>Quick Actions</h2>
          <Link to="/upload" className="btn btn-primary">
            Upload New Video
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

