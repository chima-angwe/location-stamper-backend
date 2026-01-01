import { upload } from "../config/cloudinary.js";

// Single file upload
export const uploadSingle = upload.single("photo");

// Multiple files upload (up to 5)
export const uploadMultiple = upload.array("photos", 5);

// Multer error handler
export const handleUploadError = (err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      error: "File too large. Maximum size is 5MB",
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      error: "Unexpected file field or too many files (max 5)",
    });
  }

  return res.status(400).json({
    success: false,
    error: err.message,
  });
};
