"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.loginSchema = exports.registerSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
});
exports.resetPasswordSchema = joi_1.default.object({
    token: joi_1.default.string()
        .required()
        .messages({
        'any.required': 'Reset token is required',
    }),
    newPassword: joi_1.default.string()
        .min(8)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        'any.required': 'New password is required',
    }),
    confirmPassword: joi_1.default.string()
        .valid(joi_1.default.ref('newPassword'))
        .required()
        .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required',
    }),
});
exports.registerSchema = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/)
        .required()
        .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter and one special character',
        'any.required': 'Password is required',
    }),
    role: joi_1.default.string().valid('student', 'instructor', 'admin', 'content_manager').optional()
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/)
        .required()
        .messages({
        'string.min': 'New password must be at least 8 characters long',
        'string.pattern.base': 'New password must contain at least one uppercase letter and one special character',
        'any.required': 'New password is required',
    }),
});
