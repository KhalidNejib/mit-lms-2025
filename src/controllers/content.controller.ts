import { Request, Response } from 'express';
import Content from '../models/content.model';
import mongoose from 'mongoose';
import { UploadService } from '../services/upload.service';

// Get all content items
export const getAllContent = async (req: Request, res: Response) => {
  try {
    const contents = await Content.find();
    res.json({ success: true, data: contents });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch content', error: err });
  }
};

// Get content by slug
export const getContentBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const content = await Content.findOne({ slug });
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    res.json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch content', error: err });
  }
};

// Create new content
export const createContent = async (req: Request, res: Response) => {
  try {
    const { title, slug, body, author, media, status } = req.body;
    const newContent = new Content({ title, slug, body, author, media, status });
    await newContent.save();
    res.status(201).json({ success: true, data: newContent });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create content', error: err });
  }
};

// Update content
export const updateContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Content.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update content', error: err });
  }
};

// Delete content
export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Content.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    res.json({ success: true, message: 'Content deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete content', error: err });
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

// Get media library (placeholder)
export const getMediaLibrary = async (req: Request, res: Response) => {
  // Placeholder logic
  res.json({ success: true, data: [] });
}; 