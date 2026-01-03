import express from "express";
import {
  getStamps,
  getStamp,
  createStamp,
  updateStamp,
  deleteStamp,
} from "../controllers/stampController.js";
import { protect } from "../middleware/authMiddleware.js";
import { stampLimiter } from "../middleware/rateLimitMiddleware.js";
import {
  validateCreateStamp,
  validateUpdateStamp,
  validateStampId,
  validatePagination,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// GET all stamps with pagination
router.get("/", protect, validatePagination, getStamps);

// POST new stamp
router.post("/", protect, stampLimiter, validateCreateStamp, createStamp);

// GET single stamp
router.get("/:id", protect, validateStampId, getStamp);

// PUT update stamp
router.put("/:id", protect, validateStampId, validateUpdateStamp, updateStamp);

// DELETE stamp
router.delete("/:id", protect, validateStampId, deleteStamp);

export default router;
