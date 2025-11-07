import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import './VideoLibrary.css';

const VideoLibrary = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    sensitivityStatus: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const socket = useSocket();

  useEffect(() => {
    fetchVideos();
  }, [filters, page]);

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
                processingProgress: 100
              }
            : video
        ));
      });

      return () => {
        socket.off('video:progress');
        socket.off('video:complete');
      };
    }
  }, [socket]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (filters.status) params.append('status', filters.status);
      if (filters.sensitivityStatus) params.append('sensitivityStatus', filters.sensitivityStatus);

      const response = await axios.get(`/api/videos?${params}`);
      setVideos(response.data.videos);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await axios.delete(`/api/videos/${videoId}`);
      fetchVideos();
    } catch (error) {
      console.error('Failed to delete video:', error);
      alert('Failed to delete video');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container">
      <h1>Video Library</h1>

      <div className="card">
        <h2>Filters</h2>
        <div className="filters">
          <div className="form-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="uploading">Uploading</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Sensitivity Status</label>
            <select
              value={filters.sensitivityStatus}
              onChange={(e) => {
                setFilters({ ...filters, sensitivityStatus: e.target.value });
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="safe">Safe</option>
              <option value="flagged">Flagged</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card">Loading...</div>
      ) : videos.length === 0 ? (
        <div className="card">
          <p>No videos found.</p>
        </div>
      ) : (
        <>
          <div className="video-grid">
            {videos.map(video => (
              <div key={video._id} className="video-card">
                <div className="video-card-header">
                  <h3>{video.title}</h3>
                  <div className="video-status">
                    <span className={`status-badge status-${video.status}`}>
                      {video.status}
                    </span>
                    <span className={`status-badge status-${video.sensitivityStatus}`}>
                      {video.sensitivityStatus}
                    </span>
                  </div>
                </div>
                <div className="video-card-body">
                  <p className="video-meta">
                    <strong>Uploaded:</strong> {new Date(video.createdAt).toLocaleString()}
                  </p>
                  <p className="video-meta">
                    <strong>Size:</strong> {formatFileSize(video.fileSize)}
                  </p>
                  {video.duration && (
                    <p className="video-meta">
                      <strong>Duration:</strong> {formatDuration(video.duration)}
                    </p>
                  )}
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
                <div className="video-card-actions">
                  {video.status === 'completed' && (
                    <Link to={`/video/${video._id}`} className="btn btn-primary">
                      Watch
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoLibrary;

