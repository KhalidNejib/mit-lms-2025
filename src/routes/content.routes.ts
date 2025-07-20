import { Router } from 'express';
import * as contentController from '../controllers/content.controller';
import { authenticateToken, requireInstructorOrAdmin } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/', contentController.getAllContent);
router.get('/media', contentController.getMediaLibrary);
router.get('/:slug', contentController.getContentBySlug);

// Protected routes (Instructor/Admin required)
router.post('/', authenticateToken, requireInstructorOrAdmin, contentController.createContent);
router.put('/:id', authenticateToken, requireInstructorOrAdmin, contentController.updateContent);
router.delete('/:id', authenticateToken, requireInstructorOrAdmin, contentController.deleteContent);

// Upload media file
router.post('/upload', authenticateToken, requireInstructorOrAdmin, upload.single('file'), contentController.uploadMedia);

export default router;
