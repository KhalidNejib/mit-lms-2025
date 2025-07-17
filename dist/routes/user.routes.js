"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticateToken);
// Admin only routes
router.get('/', auth_middleware_1.requireAdmin, user_controller_1.getAllUsers);
router.get('/role/:role', auth_middleware_1.requireAdmin, user_controller_1.getUsersByRole);
router.delete('/:id', auth_middleware_1.requireAdmin, user_controller_1.deleteUser);
//Admin, Instructor, or Self can access the following:
router.get('/:id', auth_middleware_1.checkSelfOrInstructorOrAdmin, user_controller_1.getUserById);
router.patch('/:id', auth_middleware_1.checkSelfOrInstructorOrAdmin, user_controller_1.updateUser);
exports.default = router;
