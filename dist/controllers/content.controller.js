"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaLibrary = exports.uploadMedia = exports.deleteContent = exports.updateContent = exports.createContent = exports.getContentBySlug = exports.getAllContent = void 0;
const content_model_1 = __importDefault(require("../models/content.model"));
// Get all content items
const getAllContent = async (req, res) => {
    try {
        const contents = await content_model_1.default.find();
        res.json({ success: true, data: contents });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch content', error: err });
    }
};
exports.getAllContent = getAllContent;
// Get content by slug
const getContentBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const content = await content_model_1.default.findOne({ slug });
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.json({ success: true, data: content });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch content', error: err });
    }
};
exports.getContentBySlug = getContentBySlug;
// Create new content
const createContent = async (req, res) => {
    try {
        const { title, slug, body, author, media, status } = req.body;
        const newContent = new content_model_1.default({ title, slug, body, author, media, status });
        await newContent.save();
        res.status(201).json({ success: true, data: newContent });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create content', error: err });
    }
};
exports.createContent = createContent;
// Update content
const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await content_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.json({ success: true, data: updated });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update content', error: err });
    }
};
exports.updateContent = updateContent;
// Delete content
const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await content_model_1.default.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.json({ success: true, message: 'Content deleted' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete content', error: err });
    }
};
exports.deleteContent = deleteContent;
// Upload media files
const uploadMedia = async (req, res) => {
    if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const files = req.files;
    const filePaths = files.map(file => `/uploads/${file.filename}`);
    res.json({ success: true, files: filePaths });
};
exports.uploadMedia = uploadMedia;
// Get media library (placeholder)
const getMediaLibrary = async (req, res) => {
    // Placeholder logic
    res.json({ success: true, data: [] });
};
exports.getMediaLibrary = getMediaLibrary;
