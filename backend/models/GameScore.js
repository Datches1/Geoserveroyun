import mongoose from 'mongoose';

const gameScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['normal', 'hard', 'duo'],
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  questionsAnswered: {
    type: Number,
    required: true,
    min: 0,
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0,
  },
  timeSpent: {
    type: Number, // seconds
    required: true,
  },
  accuracy: {
    type: Number, // percentage
    min: 0,
    max: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for performance
gameScoreSchema.index({ user: 1, createdAt: -1 });
gameScoreSchema.index({ score: -1 }); // For leaderboard
gameScoreSchema.index({ difficulty: 1, score: -1 }); // For difficulty-based leaderboard

// Calculate accuracy before saving
gameScoreSchema.pre('save', function(next) {
  if (this.questionsAnswered > 0) {
    this.accuracy = (this.correctAnswers / this.questionsAnswered) * 100;
  } else {
    this.accuracy = 0;
  }
  next();
});

const GameScore = mongoose.model('GameScore', gameScoreSchema);

export default GameScore;
