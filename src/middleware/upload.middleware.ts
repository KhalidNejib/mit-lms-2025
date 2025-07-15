import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Local disk storage configuration
const storage = multer.diskStorage({
   destination: (req: Request, file: any, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req: Request, file: any, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

// File type filter
const fileFilter = (req: Request, file: any, cb: FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});