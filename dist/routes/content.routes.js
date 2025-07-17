"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const content_controller_1 = require("../controllers/content.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
// Get all content items
router.get('/', content_controller_1.getAllContent);
// Get content by slug
router.get('/:slug', content_controller_1.getContentBySlug);
// Create new content
router.post('/', content_controller_1.createContent);
// Update content
router.put('/:id', content_controller_1.updateContent);
// Delete content
router.delete('/:id', content_controller_1.deleteContent);
// Upload media files
router.post('/upload', upload_middleware_1.upload.array('media', 10), content_controller_1.uploadMedia);
// Get media library
router.get('/media', content_controller_1.getMediaLibrary);
exports.default = router;
