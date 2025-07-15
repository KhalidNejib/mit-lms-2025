import { Router } from 'express';
import { getAllCourses, getCourseById, deleteCourse } from '../controllers/course.controller';

const router = Router();

router.get('/', getAllCourses); 
router.get('/:id', getCourseById);
router.delete('/:id', deleteCourse)

export default router;
