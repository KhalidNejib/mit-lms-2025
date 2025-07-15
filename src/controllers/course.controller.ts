 // src/controllers/course.controller.ts

import { Request, Response, NextFunction } from 'express';
import courseService from '../services/course.service';

// GET /api/courses
export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await courseService.getAllCourses(req.query);
    res.json(courses);
  } catch (error) {
    next(error); // Pass error to global error middleware
  }
};

// GET /api/courses/:id
export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async(req:Request, res:Response, next:NextFunction) => {
  try {
    const course = await courseService.deleteCourse(req.params.id);
    if(!course) {
      return res.status(404).json({ message:"Course not found" });
     }
     res.json( {message:"Course deleted"} )
  } catch (error) {
    next(error)
  }
}
