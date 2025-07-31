import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/Cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Setup Multer + Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'lms_uploads',
    allowed_formats: ['jpg', 'png', 'pdf', 'mp4'],
  }),
});

const upload = multer({ storage });

// POST route

router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  try {
    // req.file may be undefined if upload fails
    const fileUrl = req.file?.path;
    if (!fileUrl) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
  }
});

export default router;
