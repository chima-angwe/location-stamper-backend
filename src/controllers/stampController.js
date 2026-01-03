import Stamp from "../models/Stamp.js";

// @desc    Get all stamps for logged in user with pagination & filtering
// @route   GET /api/stamps?page=1&limit=10&category=work&sortBy=createdAt&order=desc
// @access  Private
export const getStamps = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build filter object
    const filter = { userId: req.user.id };
    if (category && category !== "") {
      filter.category = category;
    }

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = order === "desc" ? -1 : 1;

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Stamp.countDocuments(filter);

    // Get stamps with pagination
    const stamps = await Stamp.find(filter)
      .sort(sortObject)
      .limit(limitNum)
      .skip(skip);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      count: stamps.length,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
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
        error: "Stamp not found",
      });
    }

    // Make sure user owns stamp
    if (stamp.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this stamp",
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

    // Set visitedDate to now if not provided
    if (!req.body.visitedDate) {
      req.body.visitedDate = new Date();
    }

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
        error: "Stamp not found",
      });
    }

    // Make sure user owns stamp
    if (stamp.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this stamp",
      });
    }

    // Don't allow changing userId
    delete req.body.userId;

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
        error: "Stamp not found",
      });
    }

    // Make sure user owns stamp
    if (stamp.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this stamp",
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
