import { Router } from 'express';
import * as courseController from '../controllers/course.controller';

const router = Router();

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
