import { Request, Response } from 'express';
export declare const getContactPageData: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const submitContactForm: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getSubmissions: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const markSubmissionRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteSubmission: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const contactMethods: {
    saveAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    create: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
export declare const openingDays: {
    saveAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    create: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
export declare const getPageConfig: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updatePageConfig: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=contact.controller.d.ts.map