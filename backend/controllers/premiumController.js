import PremiumRequest from '../models/PremiumRequest.js';
import User from '../models/User.js';

// @desc    Create premium request
// @route   POST /api/premium/request
// @access  Private (player only)
export const createPremiumRequest = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    // Check if user is already premium or admin
    const user = await User.findById(userId);
    if (user.role === 'premium-player' || user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You already have premium access',
      });
    }

    // Check if user has a pending request
    const existingRequest = await PremiumRequest.findOne({
      user: userId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending premium request',
      });
    }

    // Create new request
    const premiumRequest = await PremiumRequest.create({
      user: userId,
      message: message || '',
    });

    const populatedRequest = await PremiumRequest.findById(premiumRequest._id)
      .populate('user', 'username email');

    res.status(201).json({
      success: true,
      data: populatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's premium requests
// @route   GET /api/premium/my-requests
// @access  Private
export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await PremiumRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('processedBy', 'username');

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all premium requests (admin)
// @route   GET /api/premium/requests
// @access  Private (admin only)
export const getAllRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const requests = await PremiumRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'username email role')
      .populate('processedBy', 'username');

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject premium request
// @route   PUT /api/premium/requests/:id
// @access  Private (admin only)
export const processRequest = async (req, res, next) => {
  try {
    const { status, adminResponse } = req.body;
    const requestId = req.params.id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected',
      });
    }

    const premiumRequest = await PremiumRequest.findById(requestId);

    if (!premiumRequest) {
      return res.status(404).json({
        success: false,
        message: 'Premium request not found',
      });
    }

    if (premiumRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been processed',
      });
    }

    // Update request
    premiumRequest.status = status;
    premiumRequest.adminResponse = adminResponse || '';
    premiumRequest.processedBy = req.user._id;
    premiumRequest.processedAt = Date.now();
    await premiumRequest.save();

    // If approved, update user role
    if (status === 'approved') {
      await User.findByIdAndUpdate(premiumRequest.user, {
        role: 'premium-player',
      });
    }

    const updatedRequest = await PremiumRequest.findById(requestId)
      .populate('user', 'username email role')
      .populate('processedBy', 'username');

    res.json({
      success: true,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete premium request
// @route   DELETE /api/premium/requests/:id
// @access  Private (admin only)
export const deleteRequest = async (req, res, next) => {
  try {
    const request = await PremiumRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Premium request not found',
      });
    }

    await request.deleteOne();

    res.json({
      success: true,
      message: 'Premium request deleted',
    });
  } catch (error) {
    next(error);
  }
};
