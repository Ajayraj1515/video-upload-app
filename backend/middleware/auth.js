import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Try to get token from Authorization header first, then from query parameter
    let token = req.headers.authorization?.split(' ')[1];
    
    // Fallback to query parameter (for video streaming with ReactPlayer)
    if (!token && req.query.token) {
      token = req.query.token;
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
};

export const checkOwnership = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const Video = (await import('../models/Video.js')).default;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Admin can access any video
    if (req.user.role === 'admin') {
      return next();
    }

    // Users can only access videos from their organization
    if (video.organization !== req.user.organization) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Editor can access any video in their organization
    if (req.user.role === 'editor') {
      return next();
    }

    // Viewer can only access videos they uploaded
    if (req.user.role === 'viewer' && video.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking ownership', error: error.message });
  }
};

