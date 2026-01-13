import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Celebrity from './models/Celebrity.js';
import User from './models/User.js';
import { celebrityData } from '../src/data/celebrityData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Celebrity.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@geogame.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin user created');

    // Create test player
    await User.create({
      username: 'player',
      email: 'player@example.com',
      password: 'password123',
      role: 'player',
    });
    console.log('✅ Test player created');

    // Seed celebrities from existing data
    console.log('🌟 Seeding celebrities...');
    
    const celebritiesWithLocation = celebrityData.map(celeb => ({
      name: celeb.name,
      birthProvince: celeb.birthProvince,
      category: celeb.category,
      photo: celeb.photo,
      location: {
        type: 'Point',
        coordinates: celeb.coordinates || [29.0, 41.0], // [longitude, latitude]
      },
      birthYear: celeb.birthYear,
      bio: celeb.bio || '',
      isActive: true,
      createdBy: adminUser._id,
    }));

    const createdCelebrities = await Celebrity.insertMany(celebritiesWithLocation);
    console.log(`✅ ${createdCelebrities.length} celebrities seeded`);

    // Verify indexes
    console.log('📊 Verifying database indexes...');
    const celebrityIndexes = await Celebrity.collection.getIndexes();
    console.log('Celebrity indexes:', Object.keys(celebrityIndexes));

    const userIndexes = await User.collection.getIndexes();
    console.log('User indexes:', Object.keys(userIndexes));

    console.log('✅ Database seeding completed successfully!');
    console.log('\n🔑 Login credentials:');
    console.log('   Admin: admin@geogame.com / admin123');
    console.log('   Player: player@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
