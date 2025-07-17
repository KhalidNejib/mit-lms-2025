"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.checkSelfOrInstructorOrAdmin = exports.requireAdminOrContentManager = exports.requireInstructorOrAdmin = exports.requireContentManager = exports.requireAdmin = exports.requireInstructor = exports.requireStudent = exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = require("../models/User.model");
const enviroment_1 = require("../config/enviroment");
// JWT secret - should be in environment variables
const JWT_SECRET = enviroment_1.config.jwtSecret || 'your-secret-key';
// Authentication middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_model_1.User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};
exports.authenticateToken = authenticateToken;
// Role-based access control middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        return next();
    };
};
exports.requireRole = requireRole;
// Specific role middleware functions
exports.requireStudent = (0, exports.requireRole)(['student']);
exports.requireInstructor = (0, exports.requireRole)(['instructor']);
exports.requireAdmin = (0, exports.requireRole)(['admin']);
exports.requireContentManager = (0, exports.requireRole)(['content_manager']);
exports.requireInstructorOrAdmin = (0, exports.requireRole)(['instructor', 'admin']);
exports.requireAdminOrContentManager = (0, exports.requireRole)(['admin', 'content_manager']);
// admin can acess all roles by using their id
//instructor can access his data and students by their id
//students acess only their  info
const checkSelfOrInstructorOrAdmin = async (req, res, next) => {
    const user = req.user;
    const targetUserId = req.params.id;
    if (!user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    const isSelf = user._id.toString() === targetUserId;
    // Admin can access any user
    if (user.role === 'admin') {
        return next();
    }
    // Instructors can access themselves or students only
    if (user.role === 'instructor') {
        if (isSelf)
            return next();
        try {
            const targetUser = await User_model_1.User.findById(targetUserId);
            if (targetUser?.role === 'student') {
                return next();
            }
            else {
                res.status(403).json({
                    success: false,
                    message: 'Instructors can only access their own profile or students',
                });
            }
        }
        catch (error) {
            console.error('Error fetching target user:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
            });
        }
    }
    // Students can only access their own profile
    if (user.role === 'student' && isSelf) {
        return next();
    }
    // Everyone else denied
    res.status(403).json({ success: false, message: 'Access denied' });
};
exports.checkSelfOrInstructorOrAdmin = checkSelfOrInstructorOrAdmin;
// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const user = await User_model_1.User.findById(decoded.userId).select('-password');
            if (user && user.isActive) {
                req.user = user;
            }
        }
        next();
    }
    catch (error) {
        // Continue without authentication
        next();
    }
};
exports.optionalAuth = optionalAuth;
