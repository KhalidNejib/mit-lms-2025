import { Request, Response, NextFunction } from 'express';
import * as contentService from '../services/content.service';

// GET all content
export const getAllContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query;
    const contents = await contentService.getAllContent(filters);
    res.json({ total: contents.length, contents });
  } catch (error) {
    next(error);
  }
};

// GET content by slug
export const getContentBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug;
    const content = await contentService.getContentBySlug(slug);
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (error) {
    next(error);
  }
};

// POST create new content (expects file info inside req.body.file)
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

// PUT update content by ID
export const updateContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await contentService.updateContent(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Content not found' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE content by ID
export const deleteContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await contentService.deleteContent(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Content not found' });
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    next(error);
  }
};
