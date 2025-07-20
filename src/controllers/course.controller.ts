import { Request, Response, NextFunction } from 'express';
import courseService from '../services/course.service';

// GET /api/courses - Get all published courses (with filters)
export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await courseService.getAllCourses(req.query);
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:id - Get specific course
export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    next(error);
  }
};

// POST /api/courses - Create new course (Instructor or Admin)
export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const instructorId = req.user!._id.toString();
    const course = await courseService.createCourse({ ...req.body, instructor: instructorId });
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// PUT /api/courses/:id - Update course details
export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    res.json(course);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/courses/:id - Delete course
export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await courseService.deleteCourse(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
};

// POST /api/courses/:id/enroll - Enroll user in course
export const enrollInCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id.toString();
    const courseId = req.params.id;
    const enrollment = await courseService.enrollInCourse(userId, courseId);
    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:id/progress - Get user's progress in course
export const getUserProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id.toString();
    const courseId = req.params.id;
    const progress = await courseService.getUserProgress(userId, courseId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

// POST /api/courses/:id/review - Add course review/rating
export const addCourseReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id.toString();
    const courseId = req.params.id;
    const { rating, comment } = req.body;
    const review = await courseService.addCourseReview(userId, courseId, { rating, comment });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:id/modules - Get all modules in course
export const getCourseModules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.id;
    const modules = await courseService.getCourseModules(courseId);
    res.json(modules);
  } catch (error) {
    next(error);
  }
};

// POST /api/courses/:id/modules - Add module to course
export const addModuleToCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.id;
    const moduleData = req.body;
    const module = await courseService.addModuleToCourse(courseId, moduleData);
    res.status(201).json(module);
  } catch (error) {
    next(error);
  }
};
