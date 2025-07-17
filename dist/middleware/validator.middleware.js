"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentSchema = exports.validateBody = void 0;
const joi_1 = __importDefault(require("joi"));
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: error.details.map(err => err.message),
            });
            return;
        }
        next();
    };
};
exports.validateBody = validateBody;
exports.contentSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    slug: joi_1.default.string().required(),
    body: joi_1.default.string().required(),
    author: joi_1.default.string().required(),
    media: joi_1.default.array().items(joi_1.default.string()),
    status: joi_1.default.string().valid('draft', 'published', 'archived'),
});
