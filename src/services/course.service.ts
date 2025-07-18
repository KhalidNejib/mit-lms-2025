import Course from '../models/course.model';
import Enrollment from '../models/enrollment.model';
import Progress from '../models/progress.model';
import Review from '../models/review.model';

export default {
  // 1. Enroll a user in a course
  async enrollInCourse(userId: string, courseId: string) {
    const existing = await Enrollment.findOne({ user: userId, course: courseId });
    if (existing) {
      throw new Error('User already enrolled in this course');
    }
    const enrollment = new Enrollment({ user: userId, course: courseId, enrolledAt: new Date() });
    await enrollment.save();
    return enrollment;
  },

  // 2. Get user progress in a course
  async getUserProgress(userId: string, courseId: string) {
    const progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      return { progress: 0, message: 'No progress yet' };
    }
    return progress;
  },

  // 3. Add a review to a course
  async addCourseReview(
    userId: string,
    courseId: string,
    { rating, comment }: { rating: number; comment: string }
  ) {
    const existing = await Review.findOne({ user: userId, course: courseId });
    if (existing) {
      throw new Error('User has already reviewed this course');
    }
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

  // 4. Get all courses
  async getAllCourses(filters: any) {
    try {
      const query: any = { status: 'published', ...filters };
      const courses = await Course.find(query).populate('instructor', 'firstName lastName');
      return courses;
    } catch (error) {
      throw error;
    }
  },

  // 5. Get course by ID
  async getCourseById(id: string) {
    try {
      return await Course.findById(id)
        .populate('instructor', 'firstName lastName')
        .populate('modules', 'title order')
        .lean();
    } catch (error) {
      throw error;
    }
  },

  // 6. Delete course
  async deleteCourse(id: string) {
    try {
      return Course.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  },
};