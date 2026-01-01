import Stamp from '../models/Stamp.js';

// @desc    Get all stamps for logged in user
// @route   GET /api/stamps
// @access  Private
export const getStamps = async (req, res, next) => {
  try {
    const stamps = await Stamp.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: stamps.length,
      data: stamps,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single stamp
// @route   GET /api/stamps/:id
// @access  Private
export const getStamp = async (req, res, next) => {
  try {
    const stamp = await Stamp.findById(req.params.id);

    if (!stamp) {
      return res.status(404).json({
        success: false,
        error: 'Stamp not found',
      });
    }

    // Make sure user owns stamp
    if (stamp.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this stamp',
      });
    }

    res.status(200).json({
      success: true,
      data: stamp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new stamp
// @route   POST /api/stamps
// @access  Private
export const createStamp = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.userId = req.user.id;

    const stamp = await Stamp.create(req.body);

    res.status(201).json({
      success: true,
      data: stamp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update stamp
// @route   PUT /api/stamps/:id
// @access  Private
export const updateStamp = async (req, res, next) => {
  try {
    let stamp = await Stamp.findById(req.params.id);

    if (!stamp) {
      return res.status(404).json({
        success: false,
        error: 'Stamp not found',
      });
    }

    // Make sure user owns stamp
    if (stamp.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this stamp',
      });
    }

    stamp = await Stamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: stamp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete stamp
// @route   DELETE /api/stamps/:id
// @access  Private
export const deleteStamp = async (req, res, next) => {
  try {
    const stamp = await Stamp.findById(req.params.id);

    if (!stamp) {
      return res.status(404).json({
        success: false,
        error: 'Stamp not found',
      });
    }

    // Make sure user owns stamp
    if (stamp.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this stamp',
      });
    }

    await stamp.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};