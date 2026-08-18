import { ApiError } from '../utils/ApiError';
export const validate = (schema) => (req, _res, next) => {
    try {
        const result = schema.safeParse({
            params: req.params,
            query: req.query,
            body: req.body,
        });
        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));
            throw new ApiError(400, 'Validation failed' + JSON.stringify(errors));
        }
        Object.assign(req, result.data);
        next();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=validate.middleware.js.map