import { Router } from 'express';
import * as contentController from '../controllers/content.controller';
import { uploadFile } from '../controllers/upload.controllers';
import { authenticateToken, requireInstructorOrAdmin } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Content routes
router.get('/', contentController.getAllContent);
router.get('/:slug', contentController.getContentBySlug);
router.post('/', authenticateToken, requireInstructorOrAdmin, contentController.createContent);
router.put('/:id', authenticateToken, requireInstructorOrAdmin, contentController.updateContent);
router.delete('/:id', authenticateToken, requireInstructorOrAdmin, contentController.deleteContent);

// Upload route (separate)
router.post(
  '/upload',
  authenticateToken,
  requireInstructorOrAdmin,
  upload.single('file'),
  uploadFile
);

export default router;
