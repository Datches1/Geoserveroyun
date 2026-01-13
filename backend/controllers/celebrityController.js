import Celebrity from '../models/Celebrity.js';

// @desc    Get all celebrities (with filtering)
// @route   GET /api/celebrities
// @access  Public
export const getCelebrities = async (req, res, next) => {
  try {
    const { category, limit, search } = req.query;

    let query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by name or province
    if (search) {
      query.$text = { $search: search };
    }

    const celebrities = await Celebrity.find(query)
      .limit(parseInt(limit) || 100)
      .select('-__v');

    res.json({
      success: true,
      count: celebrities.length,
      data: celebrities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single celebrity
// @route   GET /api/celebrities/:id
// @access  Public
export const getCelebrity = async (req, res, next) => {
  try {
    const celebrity = await Celebrity.findById(req.params.id);

    if (!celebrity) {
      return res.status(404).json({
        success: false,
        message: 'Celebrity not found',
      });
    }

    res.json({
      success: true,
      data: celebrity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new celebrity (CRUD - CREATE)
// @route   POST /api/celebrities
// @access  Private/Admin
export const createCelebrity = async (req, res, next) => {
  try {
    const { name, birthProvince, category, photo, coordinates, bio, birthYear } = req.body;

    // Validation
    if (!name || !birthProvince || !category || !coordinates) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, birthProvince, category, and coordinates',
      });
    }

    // Create celebrity with GeoJSON location
    const celebrity = await Celebrity.create({
      name,
      birthProvince,
      category,
      photo,
      location: {
        type: 'Point',
        coordinates: coordinates, // [longitude, latitude]
      },
      bio,
      birthYear,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: celebrity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update celebrity (CRUD - UPDATE)
// @route   PUT /api/celebrities/:id
// @access  Private/Admin
export const updateCelebrity = async (req, res, next) => {
  try {
    let celebrity = await Celebrity.findById(req.params.id);

    if (!celebrity) {
      return res.status(404).json({
        success: false,
        message: 'Celebrity not found',
      });
    }

    const { name, birthProvince, category, photo, coordinates, bio, birthYear, isActive } = req.body;

    if (name) celebrity.name = name;
    if (birthProvince) celebrity.birthProvince = birthProvince;
    if (category) celebrity.category = category;
    if (photo) celebrity.photo = photo;
    if (bio) celebrity.bio = bio;
    if (birthYear) celebrity.birthYear = birthYear;
    if (typeof isActive !== 'undefined') celebrity.isActive = isActive;
    
    if (coordinates) {
      celebrity.location = {
        type: 'Point',
        coordinates: coordinates,
      };
    }

    await celebrity.save();

    res.json({
      success: true,
      data: celebrity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete celebrity (CRUD - DELETE)
// @route   DELETE /api/celebrities/:id
// @access  Private/Admin
export const deleteCelebrity = async (req, res, next) => {
  try {
    const celebrity = await Celebrity.findById(req.params.id);

    if (!celebrity) {
      return res.status(404).json({
        success: false,
        message: 'Celebrity not found',
      });
    }

    // Soft delete - just mark as inactive
    celebrity.isActive = false;
    await celebrity.save();

    res.json({
      success: true,
      message: 'Celebrity deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get celebrities by province (Spatial filter)
// @route   GET /api/celebrities/province/:province
// @access  Public
export const getCelebritiesByProvince = async (req, res, next) => {
  try {
    const celebrities = await Celebrity.findByProvince(req.params.province);

    res.json({
      success: true,
      count: celebrities.length,
      data: celebrities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby celebrities (Spatial query with R-Tree index)
// @route   GET /api/celebrities/nearby?lng=29.0086&lat=41.0225&distance=50000
// @access  Public
export const getNearby = async (req, res, next) => {
  try {
    const { lng, lat, distance } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        message: 'Please provide longitude (lng) and latitude (lat)',
      });
    }

    const celebrities = await Celebrity.findNearby(
      parseFloat(lng),
      parseFloat(lat),
      parseInt(distance) || 50000
    );

    res.json({
      success: true,
      count: celebrities.length,
      data: celebrities,
    });
  } catch (error) {
    next(error);
  }
};
