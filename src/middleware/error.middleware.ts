/// <reference types="node" />
/// <reference types="express" />
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (
  err: ApiError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode: number;
  let message: string;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    statusCode = (res.statusCode && res.statusCode >= 400) ? res.statusCode : 500;
    message = err.message || 'Internal Server Error';
  }

  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message,
    stack: isProduction ? undefined : err.stack,
    errors: (err as any).errors || undefined,
  });
};
