"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const ApiError_1 = require("../utils/ApiError");
const validate = (schema) => (req, _res, next) => {
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
            throw new ApiError_1.ApiError(400, 'Validation failed' + JSON.stringify(errors));
        }
        Object.assign(req, result.data);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map