import { Router } from 'express';
import {
  getAllContent,
  getContentById,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
  uploadMedia,
  getMediaLibrary
} from '../controllers/content.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public Routes
router.get('/', getAllContent);
router.get('/:id', getContentById);
router.get('/slug/:slug', getContentBySlug);
router.get('/media', getMediaLibrary);

// Protected Routes
router.post('/', authenticateToken, createContent);
router.put('/:id', authenticateToken, upload.single('file'), updateContent);
router.delete('/:id', authenticateToken, deleteContent);

// Media Upload (Protected)
router.post('/upload', authenticateToken, upload.array('media', 10), uploadMedia);

export default router;
