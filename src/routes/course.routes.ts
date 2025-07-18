import express from 'express';
import * as courseController from '../controllers/course.controller';
import {
  authenticateToken,
  optionalAuth,
  requireInstructorOrAdmin,
} from '../middleware/auth.middleware';

const router = express.Router();

// ✅ Public: get all courses (users don't need to be logged in)
router.get('/', optionalAuth, courseController.getAllCourses);

// ✅ Public: get a specific course
router.get('/:id', optionalAuth, courseController.getCourseById);

// // 🔐 Protected: only instructors or admins can create a course
// router.post('/', authenticateToken, requireInstructorOrAdmin, courseController.createCourse);

// // 🔐 Protected: only instructors (own course) or admin can update
// router.put('/:id', authenticateToken, courseController.updateCourse);

// 🔐 Protected: only instructors (own course) or admin can delete
router.delete('/:id', authenticateToken, courseController.deleteCourse);

export default router;
