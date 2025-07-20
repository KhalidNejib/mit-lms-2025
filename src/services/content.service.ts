import { Content } from '../models/content.model';

interface ContentFilters {
  status?: string | string[];
  type?: string | string[];
  author?: string;
  courseId?: string;
  accessLevel?: string;
  isDeleted?: boolean;
}

export const createContent = async (data: any) => {
  const newContent = new Content(data);
  return newContent.save();
};

export const getAllContent = async (filters: ContentFilters = {}) => {
  const filter: any = { isDeleted: false, ...filters };
  return Content.find(filter)
    .populate('author', 'firstName lastName email role')
    .sort({ createdAt: -1 });
};

export const getContentBySlug = async (slug: string) => {
  return Content.findOne({ slug, isDeleted: false })
    .populate('author', 'firstName lastName email role');
};

export const getContentById = async (id: string) => {
  return Content.findById(id)
    .populate('author', 'firstName lastName email role');
};

export const updateContent = async (id: string, updateData: any) => {
  return Content.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteContent = async (id: string) => {
  return Content.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const getMediaLibrary = async () => {
  // Assuming media files are stored with type 'media' or similar
  return Content.find({ type: 'media', isDeleted: false }).sort({ createdAt: -1 });
};
