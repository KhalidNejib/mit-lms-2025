import Course from '../models/course.model';
import Enrollment from '../models/enrollment.model';
import Progress from '../models/progress.model';
import Review from '../models/review.model';
import Module from '../models/module.model';
import mongoose from 'mongoose';

interface ReviewInput {
  rating: number;
  comment: string;
}

export default {
  // 1. Create a new course
  async createCourse(courseData: Partial<typeof Course.prototype>) {
    const course = new Course(courseData);
    await course.save();
    return course;
  },

  // 2. Get all published courses (with optional filters)
  async getAllCourses(filters: Record<string, any>) {
    const query: any = { status: 'published', ...filters };
    return await Course.find(query).populate('instructor', 'firstName lastName');
  },

  // 3. Get a specific course by ID
  async getCourseById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid course ID');
    }

    const course = await Course.findById(id)
      .populate('instructor', 'firstName lastName')
      .populate('modules', 'title order')
      .lean();

    if (!course) throw new Error('Course not found');
    return course;
  },

  // 4. Update course details
  async updateCourse(id: string, updateData: Partial<typeof Course.prototype>) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid course ID');
    }
    const course = await Course.findByIdAndUpdate(id, updateData, { new: true });
    if (!course) throw new Error('Course not found');
    return course;
  },

  // 5. Delete a course
  async deleteCourse(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid course ID');
    }
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) throw new Error('Course not found');
    return deleted;
  },

  // 6. Enroll user in course
  async enrollInCourse(userId: string, courseId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid user or course ID');
    }
    const exists = await Enrollment.findOne({ user: userId, course: courseId });
    if (exists) throw new Error('User already enrolled');
    const enrollment = new Enrollment({ user: userId, course: courseId, enrolledAt: new Date() });
    await enrollment.save();
    return enrollment;
  },

  // 7. Get modules of a course
  async getCourseModules(courseId: string) {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID');
    }
    const course = await Course.findById(courseId).populate('modules');
    if (!course) throw new Error('Course not found');
    return course.modules;
  },

  // 8. Add a module to course
  async addModuleToCourse(courseId: string, moduleData: any) {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID');
    }

    const module = new Module({ ...moduleData, course: courseId });
    await module.save();

    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    if (!course.modules) {
      course.modules = [];
    }
    course.modules.push(module._id as mongoose.Types.ObjectId);
    await course.save();

    return module;
  },

  // 9. Get user progress in a course
  async getUserProgress(userId: string, courseId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid user or course ID');
    }
    const progress = await Progress.findOne({ user: userId, course: courseId });
    return progress || { progress: 0, message: 'No progress yet' };
  },

  // 10. Add a review to a course
  async addCourseReview(
    userId: string,
    courseId: string,
    { rating, comment }: ReviewInput
  ) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid user or course ID');
    }
    const existing = await Review.findOne({ user: userId, course: courseId });
    if (existing) throw new Error('User has already reviewed this course');

    const review = new Review({
      user: userId,
      course: courseId,
      rating,
      comment,
      createdAt: new Date(),
    });

    await review.save();
    return review;
  },
};
