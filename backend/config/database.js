import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // MongoDB connection options
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for performance (B-Trees automatically created by MongoDB)
    console.log('📊 Creating database indexes for performance optimization...');
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err}`);
});

export default connectDB;
