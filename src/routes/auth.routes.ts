// src/routes/auth.routes.ts
import { Router } from 'express';
import {
  register,
  verifyEmail,
  login,
  getCurrentUser,
  updateCurrentUser,
  changePassword,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  resendVerificationEmail
} from '../controllers/auth.controllers';
import { authenticateToken } from '../middleware/auth.middleware';
import {registerSchema,
  loginSchema,
  changePasswordSchema} from "../utils/validator"

  import { validateBody } from '../middleware/validator.middleware';
const router = Router();

// Public routes
router.post('/register', validateBody(registerSchema), register);  // → /api/auth/register
router.get('/verifyemail/:token', verifyEmail)
router.post('/login', validateBody(loginSchema), login);  
router.post('/resend-verification', resendVerificationEmail);      // → /api/auth/login

// Protected routes (require authentication)
router.get('/me', authenticateToken, getCurrentUser);        // → /api/auth/me
router.patch('/me', authenticateToken, updateCurrentUser);     // → /api/auth/me
router.patch('/change-password', authenticateToken,validateBody(changePasswordSchema), changePassword); // → /api/auth/change-password
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateToken, logout);           // → /api/auth/logout
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
