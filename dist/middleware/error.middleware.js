import { ApiError } from '../utils/ApiError';
export const notFound = (req, res, next) => {
    const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
    next(error);
};
export const errorHandler = (err, _req, res, _next) => {
    let statusCode;
    let message;
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else {
        statusCode = (res.statusCode && res.statusCode >= 400) ? res.statusCode : 500;
        message = err.message || 'Internal Server Error';
    }
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(statusCode).json({
        success: false,
        message,
        stack: isProduction ? undefined : err.stack,
        errors: err.errors || undefined,
    });
};
//# sourceMappingURL=error.middleware.js.map