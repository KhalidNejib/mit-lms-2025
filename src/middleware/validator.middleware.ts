import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import Joi from 'joi';

export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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

export const contentSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  body: Joi.string().required(),
  author: Joi.string().required(),
  media: Joi.array().items(Joi.string()),
  status: Joi.string().valid('draft', 'published', 'archived'),
});
