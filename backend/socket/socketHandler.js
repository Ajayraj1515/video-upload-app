import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const initializeSocket = (io) => {
  // Authentication middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.user.organization})`);

    // Join organization room for multi-tenant isolation
    socket.join(socket.user.organization);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });

    // Handle video progress subscription
    socket.on('video:subscribe', (videoId) => {
      socket.join(`video:${videoId}`);
      console.log(`User ${socket.user.username} subscribed to video ${videoId}`);
    });

    socket.on('video:unsubscribe', (videoId) => {
      socket.leave(`video:${videoId}`);
      console.log(`User ${socket.user.username} unsubscribed from video ${videoId}`);
    });
  });
};

