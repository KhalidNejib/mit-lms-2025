import mongoose from 'mongoose';

export interface IContent extends mongoose.Document {
  type: string;
  title: string;
  content: string;
  slug?: string;
  status?: string;
  author: mongoose.Types.ObjectId;
}

const contentSchema = new mongoose.Schema<IContent>({
  type: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String },
  status: { type: String, default: 'published' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<IContent>('Content', contentSchema);