import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { config, ROLES } from '../config';
import { User } from '../modules/auth/auth.model';
export const protect = asyncHandler(async (req, _res, next) => {
    let token;
    token = req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith('Bearer')
            ? req.headers.authorization.split(' ')[1]
            : undefined);
    if (!token) {
        throw new ApiError(401, 'Unauthorized request: No token provided');
    }
    try {
        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decodedToken?._id).select('-password -refreshToken -__v');
        if (!user) {
            throw new ApiError(401, 'Invalid Access Token: User not found');
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
        throw new ApiError(401, error?.message || 'Invalid Access Token');
    }
});
export const protectOptional = asyncHandler(async (req, _res, next) => {
    let token;
    token = req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith('Bearer')
            ? req.headers.authorization.split(' ')[1]
            : undefined);
    if (!token)
        return next();
    try {
        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decodedToken?._id).select('-password -refreshToken -__v');
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
export const verifyRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user?.role) {
            throw new ApiError(401, 'User not authenticated');
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, 'Forbidden: Insufficient permissions');
        }
        next();
    };
};
export const verifyAdmin = verifyRole(ROLES.ADMIN);
//# sourceMappingURL=auth.middleware.js.map