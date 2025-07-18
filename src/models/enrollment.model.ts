import mongoose from 'mongoose';

export interface IEnrollment extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  progress?: number;
  status?: string;
  enrolledAt?: Date;
}

const enrollmentSchema = new mongoose.Schema<IEnrollment>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  enrolledAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);