import express from 'express';
import {
  getCelebrities,
  getCelebrity,
  createCelebrity,
  updateCelebrity,
  deleteCelebrity,
  getCelebritiesByProvince,
  getNearby,
} from '../controllers/celebrityController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (for game)
router.get('/', getCelebrities);
router.get('/province/:province', getCelebritiesByProvince);
router.get('/nearby', getNearby);
router.get('/:id', getCelebrity);

// Protected routes - Admin only for CRUD operations
router.post('/', protect, authorize('admin'), createCelebrity);
router.put('/:id', protect, authorize('admin'), updateCelebrity);
router.delete('/:id', protect, authorize('admin'), deleteCelebrity);

export default router;
