import mongoose, { Document, Schema } from 'mongoose';

export interface IModule extends Document {
  title: string;
  description?: string;
  order?: number;  // order of the module in the course
  course: mongoose.Types.ObjectId; // reference to parent course
  contentItems?: mongoose.Types.ObjectId[]; // references to content or lessons if any
  createdAt?: Date;
  updatedAt?: Date;
}

const moduleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, default: 0 },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  contentItems: [{ type: Schema.Types.ObjectId, ref: 'Content' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update updatedAt on save
moduleSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IModule>('Module', moduleSchema);
