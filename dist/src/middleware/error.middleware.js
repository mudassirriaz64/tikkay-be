"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const ApiError_1 = require("../utils/ApiError");
const notFound = (req, res, next) => {
    const error = new ApiError_1.ApiError(404, `Not Found - ${req.originalUrl}`);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, _req, res, _next) => {
    let statusCode;
    let message;
    if (err instanceof ApiError_1.ApiError) {
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
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map