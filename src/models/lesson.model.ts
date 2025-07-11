import mongoose from 'mongoose';

export interface ILesson extends mongoose.Document {
  moduleId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  type?: string;
  duration?: number;
}

const lessonSchema = new mongoose.Schema<ILesson>({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, default: 'video' },
  duration: { type: Number }
});

export default mongoose.model<ILesson>('Lesson', lessonSchema);