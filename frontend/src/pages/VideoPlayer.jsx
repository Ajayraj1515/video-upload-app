import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { config } from '../config/api';
import { useAuth } from '../context/AuthContext';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [streamError, setStreamError] = useState('');

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`/api/videos/${id}`);
      setVideo(response.data);
      console.log('Video data loaded:', response.data);
    } catch (error) {
      setError('Failed to load video');
      console.error('Failed to fetch video:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStreamUrl = () => {
    // Include token in URL for ReactPlayer authentication
    const streamUrl = config.getStreamUrl(id);
    if (token) {
      const urlWithToken = `${streamUrl}?token=${token}`;
      console.log('Stream URL:', urlWithToken);
      return urlWithToken;
    }
    console.warn('No token available for video streaming');
    return streamUrl;
  };

  const handlePlayerError = (error) => {
    console.error('ReactPlayer error:', error);
    setStreamError('Failed to load video. Please check your connection and try again.');
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

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error || !video) {
    return (
      <div className="container">
        <div className="card">
          <p className="error-message">{error || 'Video not found'}</p>
          <button onClick={() => navigate('/library')} className="btn btn-secondary">
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  if (video.status !== 'completed') {
    return (
      <div className="container">
        <div className="card">
          <h2>{video.title}</h2>
          <p>Video is still processing. Please wait for processing to complete.</p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${video.processingProgress || 0}%` }}
            >
              {video.processingProgress || 0}%
            </div>
          </div>
          <button onClick={() => navigate('/library')} className="btn btn-secondary">
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="video-player-container">
        <div className="card">
          <h1>{video.title}</h1>
          
          <div className="video-wrapper">
            {streamError ? (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: '#dc3545',
                background: '#f8d7da',
                borderRadius: '8px'
              }}>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>⚠️ Video Playback Error</p>
                <p>{streamError}</p>
                <button 
                  onClick={() => {
                    setStreamError('');
                    window.location.reload();
                  }} 
                  className="btn btn-primary"
                  style={{ marginTop: '20px' }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <ReactPlayer
                url={getStreamUrl()}
                controls
                width="100%"
                height="auto"
                playing={false}
                onError={handlePlayerError}
                onReady={() => {
                  console.log('ReactPlayer ready');
                  setStreamError('');
                }}
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                      crossOrigin: 'anonymous'
                    },
                    forceVideo: true,
                    forceHLS: false,
                    forceDASH: false
                  }
                }}
              />
            )}
          </div>

          <div className="video-details">
            <div className="detail-section">
              <h3>Video Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Status:</strong>
                  <span className={`status-badge status-${video.status}`}>
                    {video.status}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Sensitivity:</strong>
                  <span className={`status-badge status-${video.sensitivityStatus}`}>
                    {video.sensitivityStatus}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>File Size:</strong>
                  <span>{formatFileSize(video.fileSize)}</span>
                </div>
                <div className="detail-item">
                  <strong>Duration:</strong>
                  <span>{formatDuration(video.duration)}</span>
                </div>
                {video.metadata && (
                  <>
                    <div className="detail-item">
                      <strong>Resolution:</strong>
                      <span>{video.metadata.width}x{video.metadata.height}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Codec:</strong>
                      <span>{video.metadata.codec}</span>
                    </div>
                  </>
                )}
                <div className="detail-item">
                  <strong>Uploaded By:</strong>
                  <span>{video.uploadedBy?.username || 'Unknown'}</span>
                </div>
                <div className="detail-item">
                  <strong>Upload Date:</strong>
                  <span>{new Date(video.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="video-actions">
            <button onClick={() => navigate('/library')} className="btn btn-secondary">
              Back to Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

