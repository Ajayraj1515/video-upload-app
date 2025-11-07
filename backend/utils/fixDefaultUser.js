import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const fixDefaultUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/video_upload');
    console.log('Connected to MongoDB');

    // Delete existing user if exists
    const deleted = await User.deleteOne({ 
      $or: [
        { email: 'ajayraj123@gmail.com' },
        { username: 'Ajayraj' }
      ]
    });
    
    if (deleted.deletedCount > 0) {
      console.log('Deleted existing user');
    }

    // Create new user with correct password (will be hashed by User model)
    const defaultUser = new User({
      username: 'Ajayraj',
      email: 'ajayraj123@gmail.com',
      password: 'Ajayraj123', // Will be hashed by User model's pre('save') hook
      role: 'admin',
      organization: 'default'
    });

    await defaultUser.save();
    console.log('✅ Default admin user (Ajayraj) created successfully');
    console.log('   Email: ajayraj123@gmail.com');
    console.log('   Password: Ajayraj123');
    console.log('   Role: admin');
    
    // Verify password works
    const testUser = await User.findOne({ email: 'ajayraj123@gmail.com' });
    const isMatch = await testUser.comparePassword('Ajayraj123');
    console.log('✅ Password verification test:', isMatch ? 'PASSED' : 'FAILED');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixDefaultUser();

