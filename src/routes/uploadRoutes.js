import express from "express";
import {
  uploadPhoto,
  uploadPhotos,
  deletePhoto,
} from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadLimiter } from "../middleware/rateLimitMiddleware.js";
import {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Single file upload
router.post(
  "/photo",
  protect,
  uploadLimiter,
  uploadSingle,
  handleUploadError,
  uploadPhoto
);

// Multiple files upload (up to 5)
router.post(
  "/photos",
  protect,
  uploadLimiter,
  uploadMultiple,
  handleUploadError,
  uploadPhotos
);

// Delete photo
router.delete("/photo/:publicId", protect, deletePhoto);

export default router;
