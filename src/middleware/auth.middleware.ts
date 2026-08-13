/// <reference types="node" />
/// <reference types="express" />
/// <reference types="jsonwebtoken" />
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { config, ROLES, UserRole } from '../config';
import { User } from '../modules/auth/auth.model';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export const protect = asyncHandler(async (req: AuthRequest, _res: Response, next: NextFunction) => {
  let token: string | undefined;

  token = req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : undefined);

  if (!token) {
    throw new ApiError(401, 'Unauthorized request: No token provided');
  }

  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decodedToken?._id).select('-password -refreshToken -__v');

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token: User not found');
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
    };

    next();
  } catch (error) {
    throw new ApiError(401, (error as Error)?.message || 'Invalid Access Token');
  }
});

export const verifyRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
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
