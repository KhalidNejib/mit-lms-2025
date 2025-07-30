import {Content} from '../models/content.model';

export const getAllContent = async (filters: any) => {
  return await Content.find(filters).exec();
};

export const getContentBySlug = async (slug: string) => {
  return await Content.findOne({ slug }).exec();
};

export const createContent = async (data: any) => {
  return await Content.create(data);
};

export const updateContent = async (id: string, data: any) => {
  return await Content.findByIdAndUpdate(id, data, { new: true }).exec();
};

export const deleteContent = async (id: string) => {
  return await Content.findByIdAndDelete(id).exec();
};
