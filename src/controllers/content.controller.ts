import { Request, Response, NextFunction } from 'express';
import * as contentService from '../services/content.service';

// GET /api/content
export const getAllContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query;
    const contents = await contentService.getAllContent(filters);
    res.json({ total: contents.length, contents });
  } catch (error) {
    next(error);
  }
};

// GET /api/content/:slug
export const getContentBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug;
    const content = await contentService.getContentBySlug(slug);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    next(error);
  }
};

// POST /api/content
export const createContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const data = { ...req.body, author: userId };
    const newContent = await contentService.createContent(data);
    res.status(201).json(newContent);
  } catch (error) {
    next(error);
  }
};

// PUT /api/content/:id
export const updateContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await contentService.updateContent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/content/:id
export const deleteContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await contentService.deleteContent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// POST /api/content/upload (media upload)
import { RequestHandler } from 'express';
import { upload } from '../middlewares/upload.middleware';

export const uploadMedia: RequestHandler = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Return the uploaded file info (or save reference if you want)
  res.status(201).json({
    message: 'File uploaded successfully',
    file: {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
};

// GET /api/content/media (media library)
export const getMediaLibrary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mediaItems = await contentService.getMediaLibrary();
    res.json({ total: mediaItems.length, media: mediaItems });
  } catch (error) {
    next(error);
  }
};
