import express from 'express';
import {
  createContent,
  deleteContent,
 
  getAllContent,
  getContentById,
  updateContent,
  getContentBySlug,
  getMediaContent
 
} from '../controllers/content.controller';
import {authenticateToken} from '../middleware/auth.middleware'
import {upload} from '../middleware/upload.middleware'


const router = express.Router();


router.post('/',authenticateToken, createContent);


router.get('/', getAllContent);

router.get('/:id', getContentById);

router.get('/media', getMediaContent);

router.get('/slug/:slug', getContentById);




router.delete('/:id', authenticateToken,deleteContent);
router.put('/:id', authenticateToken, upload.single('file'), updateContent);

export default router;
