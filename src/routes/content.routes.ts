import { Router } from 'express';
import {
  getAllContent,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
  uploadMedia,
  getMediaLibrary
} from '../controllers/content.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Get all content items
router.get('/', getAllContent);
// Get content by slug
router.get('/:slug', getContentBySlug);
// Create new content
router.post('/', createContent);
// Update content
router.put('/:id', updateContent);
// Delete content
router.delete('/:id', deleteContent);
// Upload media files
router.post('/upload', upload.array('media', 10), uploadMedia);
// Get media library
router.get('/media', getMediaLibrary);

export default router; 