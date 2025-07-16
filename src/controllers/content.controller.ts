import { Content } from "../models/content.model";
import { Request, Response } from "express";

export const createContent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore: assume req.user is populated by auth middleware
    const userId = req.user?._id;

    const contentData = {
      ...req.body,
      author: userId
    };

    const newContent = new Content(contentData);
    await newContent.save();

    res.status(201).json({
      message: "New content created successfully",
      content: newContent
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: error.errors
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate field value',
        details: error.keyValue
      });
    }
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updated = await Content.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        status: 'archived',
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({
      message: 'Content soft-deleted successfully',
      content: updated
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const getAllContent = async (req: Request, res: Response) => {
  try {
    const { status, type, author, courseId, accessLevel } = req.query;

    // Build dynamic filter
    const filter: any = {
      isDeleted: false // Exclude deleted by default
    };

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (author) filter.author = author;
    if (courseId) filter.courseId = courseId;
    if (accessLevel) filter.accessLevel = accessLevel;

    const contents = await Content.find(filter)
      .populate("author", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.json({ total: contents.length, contents });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch content",
      error: error.message
    });
  }
};
//===================get-single-content====================
export const getContentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const content = await Content.findOne({ _id: id, isDeleted: false })
      .populate("author", "firstName lastName email role")
      .populate("courseId", "title")
      .populate("moduleId", "title");

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


   

//=========================file upload for new contents=======================
export const updateContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingContent = await Content.findById(id);
    if (!existingContent || existingContent.isDeleted) {
      return res.status(404).json({ message: 'Content not found or deleted' });
    }

    const {
      title,
      slug,
      type,
      content,
      accessLevel,
      status,
      tags,
      courseId,
      moduleId
    } = req.body;

    // Update base fields
    existingContent.title = title ?? existingContent.title;
    existingContent.slug = slug ?? existingContent.slug;
    existingContent.type = type ?? existingContent.type;
    existingContent.content = content ? JSON.parse(content) : existingContent.content;
    existingContent.accessLevel = accessLevel ?? existingContent.accessLevel;
    existingContent.status = status ?? existingContent.status;
    existingContent.tags = tags ? JSON.parse(tags) : existingContent.tags;
    existingContent.courseId = courseId ?? existingContent.courseId;
    existingContent.moduleId = moduleId ?? existingContent.moduleId;
    existingContent.updatedAt = new Date();

    // Replace file if new one is uploaded
    if (req.file) {
      existingContent.metadata = {
        ...existingContent.metadata,
        fileUrl: useS3
          ? (req.file as any).location
          : `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        originalName: req.file.originalname
      };
    }

    const updatedContent = await existingContent.save();

    res.status(200).json({
      message: 'Content updated successfully',
      content: updatedContent
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
