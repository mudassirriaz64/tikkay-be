import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: ApiError | Error, _req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map