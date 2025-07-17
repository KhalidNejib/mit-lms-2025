import path from 'path';

export class UploadService {
  static getFilePath(filename: string): string {
    return path.join('/uploads', filename);
  }
} 