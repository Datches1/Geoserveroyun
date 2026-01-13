import GameScore from '../models/GameScore.js';
import User from '../models/User.js';

// @desc    Save game score
// @route   POST /api/games/score
// @access  Private
export const saveGameScore = async (req, res, next) => {
  try {
    console.log('📥 Received score save request:', {
      body: req.body,
      user: req.user?.id,
      headers: req.headers.authorization?.substring(0, 20) + '...'
    });

    const { difficulty, score, questionsAnswered, correctAnswers, timeSpent } = req.body;

    // Validation - allow 0 values
    if (!difficulty || typeof score === 'undefined' || typeof questionsAnswered === 'undefined') {
      console.log('❌ Validation failed:', { difficulty, score, questionsAnswered });
      return res.status(400).json({
        success: false,
        message: 'Please provide difficulty, score, and questionsAnswered',
      });
    }

    // Check for duplicate score submissions (within last 30 seconds)
    const lastScore = await GameScore.findOne({
      user: req.user.id,
      createdAt: { $gte: new Date(Date.now() - 30000) } // Last 30 seconds
    });

    if (lastScore) {
      console.log('⚠️ Duplicate score submission detected:', lastScore._id);
      return res.status(200).json({
        success: true,
        data: lastScore,
        message: 'Score already saved'
      });
    }

    // Create game score
    const gameScore = await GameScore.create({
      user: req.user.id,
      difficulty,
      score,
      questionsAnswered,
      correctAnswers: correctAnswers || 0,
      timeSpent: timeSpent || 0,
    });

    // Update user stats
    const user = await User.findById(req.user.id);
    const wrongAnswers = questionsAnswered - (correctAnswers || 0);
    user.updateStats(score, correctAnswers || 0, wrongAnswers);
    await user.save();

    res.status(201).json({
      success: true,
      data: gameScore,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's game scores
// @route   GET /api/games/my-scores
// @access  Private
export const getMyScores = async (req, res, next) => {
  try {
    const { limit, difficulty } = req.query;

    let query = { user: req.user.id };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const scores = await GameScore.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 10);

    // Prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    res.json({
      success: true,
      count: scores.length,
      data: scores,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/games/leaderboard
// @access  Public
export const getLeaderboard = async (req, res, next) => {
  try {
    const { difficulty, limit } = req.query;

    let query = {};

    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Get top scores with user info
    const topScores = await GameScore.find(query)
      .sort({ score: -1 })
      .limit(parseInt(limit) || 10)
      .populate('user', 'username stats');

    // Prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    res.json({
      success: true,
      count: topScores.length,
      data: topScores,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get game statistics
// @route   GET /api/games/stats
// @access  Private
export const getGameStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Aggregate statistics
    const stats = await GameScore.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$difficulty',
          totalGames: { $sum: 1 },
          averageScore: { $avg: '$score' },
          highScore: { $max: '$score' },
          totalQuestionsAnswered: { $sum: '$questionsAnswered' },
          totalCorrectAnswers: { $sum: '$correctAnswers' },
          averageAccuracy: { $avg: '$accuracy' },
        },
      },
    ]);

    // Prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
