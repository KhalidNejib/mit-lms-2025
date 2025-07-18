import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import {config} from "../config/enviroment"

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

// JWT secret - should be in environment variables
const JWT_SECRET = config.jwtSecret || 'your-secret-key';

// Authentication middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction)  => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false, 
                message: 'Access token required' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const user = await User.findById(decoded.userId).select('-password');

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
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
};

// Role-based access control middleware
export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
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

// Specific role middleware functions
export const requireStudent = requireRole(['student']);
export const requireInstructor = requireRole(['instructor']);
export const requireAdmin = requireRole(['admin']);
export const requireContentManager = requireRole(['content_manager']);
export const requireInstructorOrAdmin = requireRole(['instructor', 'admin']);
export const requireAdminOrContentManager = requireRole(['admin', 'content_manager']);

// admin can acess all roles by using their id
//instructor can access his data and students by their id
//students acess only their  info
export const checkSelfOrInstructorOrAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
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
      if (isSelf) return next();
  
      try {
        const targetUser = await User.findById(targetUserId);
        if (targetUser?.role === 'student') {
          return next();
        } else {
           res.status(403).json({
            success: false,
            message: 'Instructors can only access their own profile or students',
          });
        }
      } catch (error) {
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
  

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const user = await User.findById(decoded.userId).select('-password');
            
            if (user && user.isActive) {
                req.user = user;
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};
