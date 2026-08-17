import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodIssue } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validate = (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      if (!result.success) {
        const errors = result.error.issues.map((issue: ZodIssue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        throw new ApiError(400, 'Validation failed' + JSON.stringify(errors));
      }

      Object.assign(req, result.data);
      next();
    } catch (error) {
      next(error);
    }
  };
