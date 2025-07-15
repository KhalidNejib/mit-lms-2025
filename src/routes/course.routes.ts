import { Router } from 'express';
import * as courseController from '../controllers/course.controller';

const router = Router();

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/:id/enroll', courseController.enrollInCourse);
router.get('/:id/progress', courseController.getUserProgress);
router.post('/:id/review', courseController.addCourseReview);
