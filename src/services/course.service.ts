import Course from '../models/course.model';

export default {
  async getAllCourses(filters: any) {
    try {
      const query: any = { status: 'published', ...filters };
      const courses = await Course.find(query)
        .populate('instructor', 'firstName lastName');
      return courses;
    } catch (error) {
      throw error;
    }
  },

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

  async deleteCourse(id:string) {
    try {
      return Course.findByIdAndDelete(id);
    } catch (error) {
      
    }
  }
};
