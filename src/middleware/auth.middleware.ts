import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.model';
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
// ✅ Allow if user is admin, instructor, or accessing their own profile
export const checkSelfOrInstructorOrAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const user = req.user;
  
    if (
      user?.role === 'admin' ||
      user?.role === 'instructor' ||
      user?._id.toString() === req.params.id
    ) {
      return next();
    }
  
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
