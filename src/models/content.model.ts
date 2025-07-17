import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  title: string;
  slug: string;
  body: string;
  author: mongoose.Types.ObjectId;
  media?: string[];
  status?: 'draft' | 'published' | 'archived';
  createdAt?: Date;
  updatedAt?: Date;
}

const contentSchema = new Schema<IContent>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  body: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  media: [{ type: String }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IContent>('Content', contentSchema); 