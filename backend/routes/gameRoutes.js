import express from 'express';
import {
  saveGameScore,
  getMyScores,
  getLeaderboard,
  getGameStats,
} from '../controllers/gameController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/score', protect, saveGameScore);
router.get('/my-scores', protect, getMyScores);
router.get('/stats', protect, getGameStats);

// Public route
router.get('/leaderboard', getLeaderboard);

export default router;
