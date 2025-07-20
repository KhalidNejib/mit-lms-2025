import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  instructor: mongoose.Types.ObjectId;
  category: string;
  subcategory?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  pricing: {
    type: 'free' | 'paid' | 'subscription';
    amount?: number;
    currency?: string;
    discount?: {
      percentage?: number;
      validUntil?: Date;
    };
  };
  duration?: number; // in minutes
  modules?: mongoose.Types.ObjectId[]; // refs to Module documents
  tags?: string[];
  prerequisites?: string[];
  learningOutcomes?: string[];
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  rating?: {
    average?: number;
    count?: number;
  };
  enrollmentCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  thumbnail: { type: String },
  instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  language: { type: String, default: 'en' },
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid', 'subscription'],
      required: true,
    },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    discount: {
      percentage: Number,
      validUntil: Date,
    },
  },
  duration: { type: Number }, // in minutes
  modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
  tags: [{ type: String }],
  prerequisites: [{ type: String }],
  learningOutcomes: [{ type: String }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  featured: { type: Boolean, default: false },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  enrollmentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to update updatedAt
courseSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ICourse>('Course', courseSchema);
