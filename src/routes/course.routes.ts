import express from 'express';
import * as courseController from '../controllers/course.controller';
import {
  authenticateToken,
  requireInstructor,
  requireAdmin,
  requireInstructorOrAdmin,
  optionalAuth
} from '../middleware/auth.middleware';

const router = express.Router();

// 📚 Public: Get all published courses (with optional filters)
router.get('/', optionalAuth, courseController.getAllCourses);

// 📚 Public/Optional auth: Get specific course details
router.get('/:id', optionalAuth, courseController.getCourseById);

// 🛠️ Instructor/Admin: Create new course
router.post('/', authenticateToken, requireInstructorOrAdmin, courseController.createCourse);

// 🛠️ Instructor/Admin: Update course
router.put('/:id', authenticateToken, requireInstructorOrAdmin, courseController.updateCourse);

// ❌ Instructor/Admin: Delete course
router.delete('/:id', authenticateToken, requireInstructorOrAdmin, courseController.deleteCourse);

// ✅ Authenticated User: Enroll in a course
router.post('/:id/enroll', authenticateToken, courseController.enrollInCourse);

// ✅ Authenticated User: Get user progress in a course
router.get('/:id/progress', authenticateToken, courseController.getUserProgress);

// ✅ Authenticated User: Add review to a course
router.post('/:id/review', authenticateToken, courseController.addCourseReview);

// 📦 Get modules of a course (optional auth: useful for previewing)
router.get('/:id/modules', optionalAuth, courseController.getCourseModules);

// ➕ Instructor/Admin: Add module to course
router.post('/:id/modules', authenticateToken, requireInstructorOrAdmin, courseController.addModuleToCourse);

export default router;
