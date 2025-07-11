import mongoose from 'mongoose';

export interface IAssignment extends mongoose.Document {
  courseId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
}

const assignmentSchema = new mongoose.Schema<IAssignment>({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date }
});

export default mongoose.model<IAssignment>('Assignment', assignmentSchema);