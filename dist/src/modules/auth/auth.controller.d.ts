import { Request, Response } from 'express';
export declare const register: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const login: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const logout: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const refreshAccessToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const changeCurrentPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getCurrentUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const forgotPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=auth.controller.d.ts.map