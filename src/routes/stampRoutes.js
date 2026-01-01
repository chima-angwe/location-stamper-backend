import express from 'express';
import {
  getStamps,
  getStamp,
  createStamp,
  updateStamp,
  deleteStamp,
} from '../controllers/stampController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getStamps).post(protect, createStamp);

router
  .route('/:id')
  .get(protect, getStamp)
  .put(protect, updateStamp)
  .delete(protect, deleteStamp);

export default router;