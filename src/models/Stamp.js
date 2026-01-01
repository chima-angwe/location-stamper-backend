import mongoose from 'mongoose';

const stampSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    latitude: {
      type: Number,
      required: [true, 'Please add latitude'],
    },
    longitude: {
      type: Number,
      required: [true, 'Please add longitude'],
    },
    address: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['work', 'home', 'travel', 'dining', 'hiking', 'other'],
      default: 'other',
    },
    photos: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
    visitedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries (optional but useful)
stampSchema.index({ latitude: 1, longitude: 1 });

export default mongoose.model('Stamp', stampSchema);