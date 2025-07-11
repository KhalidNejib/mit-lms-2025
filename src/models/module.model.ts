import mongoose from 'mongoose';

export interface IModule extends mongoose.Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  lessons?: mongoose.Types.ObjectId[];
  order?: number;
  status?: string;
}

const moduleSchema = new mongoose.Schema<IModule>({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  order: { type: Number },
  status: { type: String, default: 'active' }
});

export default mongoose.model<IModule>('Module', moduleSchema);