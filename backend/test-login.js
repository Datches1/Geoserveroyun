import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const testLogin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    const user = await User.findOne({ email: 'admin@geogame.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('✅ User found:', user.email);
    console.log('Password hash exists:', !!user.password);
    console.log('Hash length:', user.password?.length);
    
    const match = await bcrypt.compare('admin123', user.password);
    console.log('Password match test:', match);
    
    const match2 = await user.matchPassword('admin123');
    console.log('Using model method:', match2);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();
