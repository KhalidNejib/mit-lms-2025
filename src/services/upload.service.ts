import cloudinary from '../config/Cloudinary';
import streamifier from 'streamifier';

export const uploadToCloudinary = (fileBuffer: Buffer, folder = 'lms_media') => {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
