import express from 'express';
import {
  createPremiumRequest,
  getMyRequests,
  getAllRequests,
  processRequest,
  deleteRequest,
} from '../controllers/premiumController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/request', protect, createPremiumRequest);
router.get('/my-requests', protect, getMyRequests);

// Admin routes
router.get('/requests', protect, adminOnly, getAllRequests);
router.put('/requests/:id', protect, adminOnly, processRequest);
router.delete('/requests/:id', protect, adminOnly, deleteRequest);

export default router;
