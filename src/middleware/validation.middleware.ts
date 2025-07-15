 import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

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