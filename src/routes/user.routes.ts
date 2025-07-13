import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUsersByRole
} from '../controllers/user.controller';
import { 
    authenticateToken, 
    requireAdmin, 
    requireInstructorOrAdmin ,
    checkSelfOrInstructorOrAdmin
} from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Admin only routes
router.get('/', requireAdmin, getAllUsers);
router.get('/role/:role', requireAdmin, getUsersByRole);
router.delete('/:id', requireAdmin, deleteUser);

//Admin, Instructor, or Self can access the following:
router.get('/:id', checkSelfOrInstructorOrAdmin, getUserById);
router.put('/:id', checkSelfOrInstructorOrAdmin, updateUser);

export default router; 