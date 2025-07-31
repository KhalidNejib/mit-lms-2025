import { Request, Response } from 'express';
import { uploadToCloudinary } from '../services/upload.service';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await uploadToCloudinary(file.buffer);

    res.status(201).json({
      message: 'Uploaded to Cloudinary',
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      original_filename: result.original_filename || file.originalname,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error });
  }
};
