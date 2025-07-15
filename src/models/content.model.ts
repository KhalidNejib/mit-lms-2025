import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['article', 'video', 'document', 'quiz', 'assignment'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    duration: Number, // For videos/audio
    wordCount: Number, // For articles
    fileUrl: String, // For documents
    thumbnail: String // For visual content
  },
  accessLevel: {
    type: String,
    enum: ['public', 'enrolled', 'premium'],
    default: 'enrolled'
  },
  tags: [String],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  version: { type: Number, default: 1 },
  isDeleted: { type: Boolean, default: false },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('Content', contentSchema); 