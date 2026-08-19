declare global {
    interface ErrorConstructor {
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    }
}
export declare class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    data: null;
    success: boolean;
    constructor(statusCode: number, message: string, isOperational?: boolean, stack?: string);
}
//# sourceMappingURL=ApiError.d.ts.map