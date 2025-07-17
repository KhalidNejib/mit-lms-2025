"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = require("../controllers/course.controller");
const router = (0, express_1.Router)();
router.get('/', course_controller_1.getAllCourses);
router.get('/:id', course_controller_1.getCourseById);
router.delete('/:id', course_controller_1.deleteCourse);
exports.default = router;
