import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../config';
export interface AuthRequest extends Request {
    user?: {
        _id: string;
        name: string;
        email: string;
        role: UserRole;
    };
}
export declare const protect: (req: Request, res: Response, next: NextFunction) => void;
export declare const protectOptional: (req: Request, res: Response, next: NextFunction) => void;
export declare const verifyRole: (...allowedRoles: UserRole[]) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
export declare const verifyAdmin: (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map