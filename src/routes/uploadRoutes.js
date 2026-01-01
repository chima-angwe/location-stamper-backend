import express from 'express';
import {
  uploadPhoto,
  uploadPhotos,
  deletePhoto,
} from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
} from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/photo', protect, uploadSingle, handleUploadError, uploadPhoto);
router.post('/photos', protect, uploadMultiple, handleUploadError, uploadPhotos);
router.delete('/photo/:publicId', protect, deletePhoto);

export default router;