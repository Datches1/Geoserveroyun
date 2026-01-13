import mongoose from 'mongoose';

const celebritySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide celebrity name'],
    trim: true,
  },
  birthProvince: {
    type: String,
    required: [true, 'Please provide birth province'],
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
  },
  photo: {
    type: String,
    default: '/images/celebrities/default.jpg',
  },
  // GeoJSON Point for spatial queries
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Please provide coordinates'],
    },
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
  },
  birthYear: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear(),
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// 2dsphere index for spatial queries (R-Tree equivalent in MongoDB)
celebritySchema.index({ location: '2dsphere' });

// Text index for search functionality
celebritySchema.index({ name: 'text', birthProvince: 'text' });

// Index for filtering
celebritySchema.index({ category: 1, isActive: 1 });

// Static method to find celebrities near a location
celebritySchema.statics.findNearby = function(longitude, latitude, maxDistance = 50000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance, // meters
      },
    },
    isActive: true,
  });
};

// Static method to search celebrities by province
celebritySchema.statics.findByProvince = function(province) {
  return this.find({
    birthProvince: province,
    isActive: true,
  });
};

const Celebrity = mongoose.model('Celebrity', celebritySchema);

export default Celebrity;
