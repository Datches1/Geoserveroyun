import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import GameScore from './models/GameScore.js';

dotenv.config();

const fixUserStats = async () => {
  try {
    console.log('🔧 Starting stats fix...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    
    for (const user of users) {
      console.log(`\n👤 Fixing stats for user: ${user.username}`);
      
      // Get all game scores for this user
      const scores = await GameScore.find({ user: user._id });
      
      console.log(`   Found ${scores.length} games`);
      
      if (scores.length === 0) {
        // Reset stats if no games
        user.stats.totalGames = 0;
        user.stats.gamesPlayed = 0;
        user.stats.totalScore = 0;
        user.stats.highScore = 0;
        user.stats.averageScore = 0;
        user.stats.correctAnswers = 0;
        user.stats.wrongAnswers = 0;
      } else {
        // Recalculate stats from scratch
        let totalScore = 0;
        let highScore = 0;
        let totalCorrect = 0;
        let totalWrong = 0;
        
        scores.forEach(score => {
          totalScore += score.score;
          highScore = Math.max(highScore, score.score);
          totalCorrect += score.correctAnswers || 0;
          totalWrong += (score.questionsAnswered - (score.correctAnswers || 0));
        });
        
        user.stats.totalGames = scores.length;
        user.stats.gamesPlayed = scores.length;
        user.stats.totalScore = totalScore;
        user.stats.highScore = highScore;
        user.stats.averageScore = totalScore / scores.length;
        user.stats.correctAnswers = totalCorrect;
        user.stats.wrongAnswers = totalWrong;
      }
      
      await user.save();
      
      console.log(`   ✅ Fixed stats:`, {
        totalGames: user.stats.totalGames,
        highScore: user.stats.highScore,
        totalScore: user.stats.totalScore,
        averageScore: user.stats.averageScore.toFixed(1)
      });
    }
    
    console.log('\n✅ All user stats fixed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fixing stats:', error);
    process.exit(1);
  }
};

fixUserStats();
