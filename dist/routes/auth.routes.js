"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validator_1 = require("../utils/validator");
const validator_middleware_1 = require("../middleware/validator.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', (0, validator_middleware_1.validateBody)(validator_1.registerSchema), auth_controllers_1.register); // → /api/auth/register
router.get('/verifyemail/:token', auth_controllers_1.verifyEmail);
router.post('/login', (0, validator_middleware_1.validateBody)(validator_1.loginSchema), auth_controllers_1.login); // → /api/auth/login
// Protected routes (require authentication)
router.get('/me', auth_middleware_1.authenticateToken, auth_controllers_1.getCurrentUser); // → /api/auth/me
router.patch('/me', auth_middleware_1.authenticateToken, auth_controllers_1.updateCurrentUser); // → /api/auth/me
router.patch('/change-password', auth_middleware_1.authenticateToken, (0, validator_middleware_1.validateBody)(validator_1.changePasswordSchema), auth_controllers_1.changePassword); // → /api/auth/change-password
router.post('/refresh-token', auth_controllers_1.refreshToken);
router.post('/logout', auth_middleware_1.authenticateToken, auth_controllers_1.logout); // → /api/auth/logout
router.post('/forgot-password', auth_controllers_1.forgotPassword);
router.post('/reset-password', auth_controllers_1.resetPassword);
exports.default = router;
