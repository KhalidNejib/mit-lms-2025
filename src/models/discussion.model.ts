import mongoose from 'mongoose';

export interface IDiscussion extends mongoose.Document {
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  replies?: mongoose.Types.ObjectId[];
}

const discussionSchema = new mongoose.Schema<IDiscussion>({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }]
});

export default mongoose.model<IDiscussion>('Discussion', discussionSchema);