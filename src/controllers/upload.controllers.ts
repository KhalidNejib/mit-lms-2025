import { Request, Response } from 'express';
import { uploadToCloudinary } from '../services/upload.service';
import  Course  from '../models/course.model';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { title, slug, content, status, type } = req.body;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file.buffer);

    // ✅ Get the authenticated user's ID from middleware
    const userId = req.user?.id;

    if (!type) {
      return res.status(400).json({ message: 'Field "type" is required.' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: user ID missing from token' });
    }

    // Save metadata + Cloudinary URL to MongoDB
    const newUpload = new Course({
      title,
      slug,
      content,
      status,
      type,             
      author: userId,    
      fileUrl: result.secure_url,
      publicId: result.public_id,
    });

    const saved = await newUpload.save();

    // Final response
    res.status(201).json({
      success: true,
      message: 'File uploaded and saved to DB',
      data: saved,
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error });
  }
};    