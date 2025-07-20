// models/content.model.ts

import mongoose, { Schema } from "mongoose";
import { IContent } from "../types/content.interface";

const contentSchema = new Schema<IContent>(
  {
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
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    content: {
      type: Schema.Types.Mixed,
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    accessLevel: {
      type: String,
      enum: ['public', 'enrolled', 'premium'],
      default: 'enrolled'
    },
    tags: [String],

    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module' },
    prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Content' }],

    metadata: {
      duration: Number,
      wordCount: Number,
      thumbnail: String
    },

    file: {
      filename: String,
      originalName: String,
      fileType: String,
      fileSize: Number,
      fileUrl: String
    },

    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],

    version: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
contentSchema.index({ title: "text", slug: 1 });

// Virtuals
contentSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

export const Content = mongoose.model<IContent>("Content", contentSchema);
