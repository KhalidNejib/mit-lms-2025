import mongoose from 'mongoose';

export interface IMedia extends mongoose.Document {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  author: mongoose.Types.ObjectId;
  uploadedAt?: Date;
}

const mediaSchema = new mongoose.Schema<IMedia>({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMedia>('Media', mediaSchema);