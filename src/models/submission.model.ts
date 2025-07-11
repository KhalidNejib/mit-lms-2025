import mongoose from 'mongoose';

export interface ISubmission extends mongoose.Document {
  assignmentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  grade?: number;
  submittedAt?: Date;
}

const submissionSchema = new mongoose.Schema<ISubmission>({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  grade: { type: Number },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISubmission>('Submission', submissionSchema);