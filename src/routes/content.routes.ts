import express from 'express';
import {
  createContent,
  deleteContent,
 
  getAllContent,
  getContentById,
  updateContent,
} from '../controllers/content.controller';
import {authenticateToken} from '../middleware/auth.middleware'


const router = express.Router();


router.post('/',authenticateToken, createContent);


router.get('/', getAllContent);

router.get('/:id', getContentById);

// Update content
//router.put('/:id', isAuthenticated, updateContent);


router.delete('/:id', authenticateToken,deleteContent);

export default router;
