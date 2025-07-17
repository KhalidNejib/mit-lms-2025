"use strict";
// src/controllers/course.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.getCourseById = exports.getAllCourses = void 0;
const course_service_1 = __importDefault(require("../services/course.service"));
// GET /api/courses
const getAllCourses = async (req, res, next) => {
    try {
        const courses = await course_service_1.default.getAllCourses(req.query);
        res.json(courses);
    }
    catch (error) {
        next(error); // Pass error to global error middleware
    }
};
exports.getAllCourses = getAllCourses;
// GET /api/courses/:id
const getCourseById = async (req, res, next) => {
    try {
        const course = await course_service_1.default.getCourseById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    }
    catch (error) {
        next(error);
    }
};
exports.getCourseById = getCourseById;
const deleteCourse = async (req, res, next) => {
    try {
        const course = await course_service_1.default.deleteCourse(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({ message: "Course deleted" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCourse = deleteCourse;
