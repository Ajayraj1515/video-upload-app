import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import './Upload.css';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.on('video:progress', (data) => {
        if (data.videoId === uploadedVideo?.id) {
          setProcessingProgress(data.progress);
          setStatus(data.status);
        }
      });

      socket.on('video:complete', (data) => {
        if (data.videoId === uploadedVideo?.id) {
          setProcessingProgress(100);
          setStatus('completed');
        }
      });

      socket.on('video:error', (data) => {
        if (data.videoId === uploadedVideo?.id) {
          setStatus('failed');
          setError(data.error || 'Processing failed');
        }
      });

      return () => {
        socket.off('video:progress');
        socket.off('video:complete');
        socket.off('video:error');
      };
    }
  }, [socket, uploadedVideo]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 500 * 1024 * 1024) {
        setError('File size must be less than 500MB');
        return;
      }
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setError('');
    setUploadProgress(0);
    setProcessingProgress(0);
    setStatus('uploading');

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);

    try {
      const response = await axios.post('/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      setUploadedVideo(response.data.video);
      setStatus('processing');
      setUploadProgress(100);
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
      setStatus('failed');
    }
  };

  const handleReset = () => {
    setFile(null);
    setTitle('');
    setUploadProgress(0);
    setProcessingProgress(0);
    setStatus('');
    setError('');
    setUploadedVideo(null);
  };

  return (
    <div className="container">
      <h1>Upload Video</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Video Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter video title"
            />
          </div>

          <div className="form-group">
            <label>Select Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              required
              disabled={status === 'uploading' || status === 'processing'}
            />
            {file && (
              <p className="file-info">
                Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          {status && (
            <div className="upload-status">
              <h3>Status: {status}</h3>
              {status === 'uploading' && (
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
              )}
              {status === 'processing' && (
                <div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${processingProgress}%` }}
                    >
                      {processingProgress}%
                    </div>
                  </div>
                  <p>Processing video and analyzing content...</p>
                </div>
              )}
              {status === 'completed' && (
                <div className="success-message">
                  <p>Video uploaded and processed successfully!</p>
                  <div className="upload-actions">
                    <button
                      type="button"
                      onClick={() => navigate(`/video/${uploadedVideo.id}`)}
                      className="btn btn-primary"
                    >
                      Watch Video
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/library')}
                      className="btn btn-secondary"
                    >
                      View Library
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn btn-secondary"
                    >
                      Upload Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!status && (
            <button type="submit" className="btn btn-primary" disabled={!file}>
              Upload Video
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Upload;

