import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['player', 'premium-player', 'admin'],
    default: 'player',
  },
  stats: {
    totalGames: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    highScore: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for performance (B-Tree index)
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'stats.highScore': -1 }); // For leaderboard queries

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to update stats
userSchema.methods.updateStats = function(newScore, correctAnswers = 0, wrongAnswers = 0) {
  this.stats.totalGames += 1;
  this.stats.gamesPlayed = this.stats.totalGames; // Keep in sync with totalGames
  this.stats.totalScore += newScore;
  this.stats.highScore = Math.max(this.stats.highScore, newScore);
  this.stats.averageScore = this.stats.totalScore / this.stats.totalGames;
  this.stats.correctAnswers += correctAnswers;
  this.stats.wrongAnswers += wrongAnswers;
};

const User = mongoose.model('User', userSchema);

export default User;
