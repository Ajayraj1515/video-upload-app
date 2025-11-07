import Video from '../models/Video.js';
import { getIO } from '../socket/ioInstance.js';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

// Simulated sensitivity analysis
// In production, this would use ML models or external APIs
const analyzeSensitivity = async (videoPath) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simple heuristic: check file size and name for demo purposes
  // In production, use actual content analysis
  const stats = fs.statSync(videoPath);
  const fileName = path.basename(videoPath).toLowerCase();
  
  // Simple rule-based detection (for demo)
  const flaggedKeywords = ['test', 'sample', 'demo'];
  const isFlagged = flaggedKeywords.some(keyword => fileName.includes(keyword));
  
  return {
    status: isFlagged ? 'flagged' : 'safe',
    confidence: isFlagged ? 0.85 : 0.95
  };
};

const getVideoMetadata = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      
      resolve({
        duration: metadata.format.duration || 0,
        width: videoStream?.width || 0,
        height: videoStream?.height || 0,
        bitrate: metadata.format.bit_rate || 0,
        codec: videoStream?.codec_name || 'unknown'
      });
    });
  });
};

export const processVideo = async (videoId, organization) => {
  try {
    const io = getIO();
    const video = await Video.findById(videoId);
    
    if (!video) {
      console.error(`Video ${videoId} not found`);
      return;
    }

    // Update status to processing
    video.status = 'processing';
    video.processingProgress = 10;
    await video.save();

    // Emit progress update
    io.to(organization).emit('video:progress', {
      videoId: video._id.toString(),
      progress: 10,
      status: 'processing'
    });

    // Get video metadata
    try {
      const metadata = await getVideoMetadata(video.filePath);
      video.duration = metadata.duration;
      video.metadata = {
        width: metadata.width,
        height: metadata.height,
        bitrate: metadata.bitrate,
        codec: metadata.codec
      };
      video.processingProgress = 50;
      await video.save();

      io.to(organization).emit('video:progress', {
        videoId: video._id.toString(),
        progress: 50,
        status: 'processing'
      });
    } catch (error) {
      console.error('Error getting metadata:', error);
      // Continue without metadata if ffprobe fails
    }

    // Analyze sensitivity
    video.processingProgress = 70;
    await video.save();

    io.to(organization).emit('video:progress', {
      videoId: video._id.toString(),
      progress: 70,
      status: 'processing'
    });

    const sensitivityResult = await analyzeSensitivity(video.filePath);
    video.sensitivityStatus = sensitivityResult.status;
    video.processingProgress = 90;
    await video.save();

    io.to(organization).emit('video:progress', {
      videoId: video._id.toString(),
      progress: 90,
      status: 'processing',
      sensitivityStatus: sensitivityResult.status
    });

    // Complete processing
    video.status = 'completed';
    video.processingProgress = 100;
    await video.save();

    io.to(organization).emit('video:complete', {
      videoId: video._id.toString(),
      status: 'completed',
      sensitivityStatus: video.sensitivityStatus,
      metadata: video.metadata
    });

    console.log(`Video ${videoId} processed successfully`);
  } catch (error) {
    console.error(`Error processing video ${videoId}:`, error);
    
    try {
      const video = await Video.findById(videoId);
      if (video) {
        video.status = 'failed';
        await video.save();
        
        io.to(organization).emit('video:error', {
          videoId: video._id.toString(),
          status: 'failed',
          error: error.message
        });
      }
    } catch (updateError) {
      console.error('Error updating video status:', updateError);
    }
  }
};

