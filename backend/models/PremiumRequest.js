import mongoose from 'mongoose';

const premiumRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  message: {
    type: String,
    maxlength: 500,
  },
  adminResponse: {
    type: String,
    maxlength: 500,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  processedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
premiumRequestSchema.index({ user: 1, status: 1 });

const PremiumRequest = mongoose.model('PremiumRequest', premiumRequestSchema);

export default PremiumRequest;
