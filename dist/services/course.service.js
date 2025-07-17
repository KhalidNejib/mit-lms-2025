"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_model_1 = __importDefault(require("../models/course.model"));
exports.default = {
    async getAllCourses(filters) {
        try {
            const query = { status: 'published', ...filters };
            const courses = await course_model_1.default.find(query)
                .populate('instructor', 'firstName lastName');
            return courses;
        }
        catch (error) {
            throw error;
        }
    },
    async getCourseById(id) {
        try {
            return await course_model_1.default.findById(id)
                .populate('instructor', 'firstName lastName')
                .populate('modules', 'title order')
                .lean();
        }
        catch (error) {
            throw error;
        }
    },
    async deleteCourse(id) {
        try {
            return course_model_1.default.findByIdAndDelete(id);
        }
        catch (error) {
        }
    }
};
