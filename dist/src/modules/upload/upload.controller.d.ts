import multer from 'multer';
import { Request, Response } from 'express';
export declare const upload: multer.Multer;
export declare const uploadResume: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * Hard delete file from Cloudinary storage
 */
export declare function destroyCloudinaryAsset(publicId: string): Promise<void>;
export declare const uploadSingle: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadVideoDisk: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * Returns current server video capability (VPS vs Vercel Direct)
 */
export declare const getVideoUploadConfig: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Generates Cloudinary signed upload parameters for Vercel/direct browser uploads
 */
export declare const generateVideoSignature: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * VPS Mode: Async transcode pipeline with 202 Accepted response
 */
export declare const uploadVideoVPS: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const uploadFile: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=upload.controller.d.ts.map