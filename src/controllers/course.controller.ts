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

// Enroll a user in a course
export const enrollInCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id.toString(); // Authenticated user
    const courseId = req.params.id; // Course ID from URL
    const enrollment = await courseService.enrollInCourse(userId, courseId);
    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
};

// Get a user's progress in a course
export const getUserProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id.toString(); // Authenticated user
    const courseId = req.params.id;
    const progress = await courseService.getUserProgress(userId, courseId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

// Add a review to a course
export const addCourseReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id.toString(); // Authenticated user
    const courseId = req.params.id;
    const { rating, comment } = req.body;
    const review = await courseService.addCourseReview(userId, courseId, { rating, comment });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};
