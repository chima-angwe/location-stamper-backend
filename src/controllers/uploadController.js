import cloudinary  from "../config/cloudinary.js";

// @desc    Upload single photo
// @route   POST /api/upload/photo
// @access  Private
export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a file",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        url: req.file.path,
        publicId: req.file.filename,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple photos
// @route   POST /api/upload/photos
// @access  Private
export const uploadPhotos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please upload at least one file",
      });
    }

    const uploadedFiles = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    res.status(200).json({
      success: true,
      count: uploadedFiles.length,
      data: uploadedFiles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete photo from Cloudinary
// @route   DELETE /api/upload/photo/:publicId
// @access  Private
export const deletePhoto = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
