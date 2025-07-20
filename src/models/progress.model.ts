import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;      // Reference to User
  courseId: mongoose.Types.ObjectId;    // Reference to Course
  completedLessons: mongoose.Types.ObjectId[]; // Array of completed lesson IDs
  progress: number;                     // Percentage (0-100)
  updatedAt: Date;                      // Last update timestamp
}

const ProgressSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  progress: { type: Number, default: 0, min: 0, max: 100 },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure one progress record per user per course
ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<IProgress>('Progress', ProgressSchema);