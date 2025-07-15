// types/content.interface.ts

import { Document, Types } from "mongoose";

export interface IContent extends Document {
  _id: Types.ObjectId;
  type: 'article' | 'video' | 'document' | 'quiz' | 'assignment';
  title: string;
  slug: string;
  content: any;
  status: 'draft' | 'published' | 'archived';
  accessLevel: 'public' | 'enrolled' | 'premium';

  tags: string[];
  author: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;

  courseId?: Types.ObjectId;
  moduleId?: Types.ObjectId;
  prerequisites?: Types.ObjectId[];

  metadata?: {
    duration?: number;
    wordCount?: number;
    thumbnail?: string;
  };

  file?: {
    filename?: string;
    originalName?: string;
    fileType?: string;
    fileSize?: number;
    fileUrl?: string;
  };

  comments: {
    user: Types.ObjectId;
    comment: string;
    createdAt?: Date;
  }[];

  version: number;
  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  commentCount?: number;
}
