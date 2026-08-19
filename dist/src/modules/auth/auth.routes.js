"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="express" />
const express_1 = require("express");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.route('/register').post((0, validate_middleware_1.validate)(auth_validation_1.registerSchema), auth_controller_1.register);
router.route('/login').post((0, validate_middleware_1.validate)(auth_validation_1.loginSchema), auth_controller_1.login);
router.route('/logout').post(auth_middleware_1.protect, auth_controller_1.logout);
router.route('/refresh-token').post(auth_controller_1.refreshAccessToken);
router.route('/change-password').post(auth_middleware_1.protect, (0, validate_middleware_1.validate)(auth_validation_1.changePasswordSchema), auth_controller_1.changeCurrentPassword);
router.route('/me').get(auth_middleware_1.protect, auth_controller_1.getCurrentUser);
router.route('/forgot-password').post((0, validate_middleware_1.validate)(auth_validation_1.forgotPasswordSchema), auth_controller_1.forgotPassword);
router.route('/reset-password').post((0, validate_middleware_1.validate)(auth_validation_1.resetPasswordSchema), auth_controller_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map