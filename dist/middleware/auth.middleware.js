"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.verifyRole = exports.protectOptional = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const config_1 = require("../config");
const auth_model_1 = require("../modules/auth/auth.model");
exports.protect = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    let token;
    token = req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith('Bearer')
            ? req.headers.authorization.split(' ')[1]
            : undefined);
    if (!token) {
        throw new ApiError_1.ApiError(401, 'Unauthorized request: No token provided');
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        const user = await auth_model_1.User.findById(decodedToken?._id).select('-password -refreshToken -__v');
        if (!user) {
            throw new ApiError_1.ApiError(401, 'Invalid Access Token: User not found');
        }
        req.user = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        throw new ApiError_1.ApiError(401, error?.message || 'Invalid Access Token');
    }
});
exports.protectOptional = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    let token;
    token = req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith('Bearer')
            ? req.headers.authorization.split(' ')[1]
            : undefined);
    if (!token)
        return next();
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        const user = await auth_model_1.User.findById(decodedToken?._id).select('-password -refreshToken -__v');
        if (user) {
            req.user = {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            };
        }
        next();
    }
    catch {
        next();
    }
});
const verifyRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user?.role) {
            throw new ApiError_1.ApiError(401, 'User not authenticated');
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError_1.ApiError(403, 'Forbidden: Insufficient permissions');
        }
        next();
    };
};
exports.verifyRole = verifyRole;
exports.verifyAdmin = (0, exports.verifyRole)(config_1.ROLES.ADMIN);
//# sourceMappingURL=auth.middleware.js.map