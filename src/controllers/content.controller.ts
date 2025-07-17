import { Request, Response } from 'express';
import { Content } from '../models/content.model';
import { UploadService } from '../services/upload.service';

// Create new content
export const createContent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const contentData = {
      ...req.body,
      author: userId
    };

    const newContent = new Content(contentData);
    await newContent.save();

    res.status(201).json({
      message: 'New content created successfully',
      content: newContent
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: error.errors
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate field value',
        details: error.keyValue
      });
    }
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Upload media files
export const uploadMedia = async (req: Request, res: Response) => {
  if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const files = req.files as Express.Multer.File[];
  const filePaths = files.map(file => UploadService.getFilePath(file.filename));
  res.json({ success: true, files: filePaths });
};

// Get all content (with filtering, population, and sorting)
export const getAllContent = async (req: Request, res: Response) => {
  try {
    const { status, type, author, courseId, accessLevel } = req.query as {
      status?: string;
      type?: string;
      author?: string;
      courseId?: string;
      accessLevel?: string;
    };

    const filter: any = {
      isDeleted: false
    };

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (author) filter.author = author;
    if (courseId) filter.courseId = courseId;
    if (accessLevel) filter.accessLevel = accessLevel;

    const contents = await Content.find(filter)
      .populate('author', 'firstName lastName email role')
      .sort({ createdAt: -1 });

    res.json({ total: contents.length, contents });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
