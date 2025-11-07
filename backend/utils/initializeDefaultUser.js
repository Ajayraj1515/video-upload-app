import User from '../models/User.js';

export const initializeDefaultUser = async () => {
  try {
    // Check if default admin user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: 'ajayraj123@gmail.com' },
        { username: 'Ajayraj' }
      ]
    });

    if (existingUser) {
      console.log('✅ Default admin user (Ajayraj) already exists');
      console.log('   Email: ajayraj123@gmail.com');
      console.log('   Password: Ajayraj123');
      console.log('   Role: admin');
      return;
    }

    // Create default admin user
    // Note: Password will be automatically hashed by User model's pre('save') hook
    const defaultUser = new User({
      username: 'Ajayraj',
      email: 'ajayraj123@gmail.com',
      password: 'Ajayraj123', // Will be hashed by User model
      role: 'admin', // Admin has all permissions including editor
      organization: 'default'
    });

    await defaultUser.save();
    console.log('✅ Default admin user (Ajayraj) created successfully');
    console.log('   Email: ajayraj123@gmail.com');
    console.log('   Password: Ajayraj123');
    console.log('   Role: admin');
  } catch (error) {
    console.error('❌ Error creating default admin user:', error.message);
    console.error('   Full error:', error);
    // Don't throw - allow server to start even if user creation fails
  }
};


