/// <reference types="express" />
import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { protect } from '../../middleware/auth.middleware';
import { register, login, logout, refreshAccessToken, changeCurrentPassword, getCurrentUser, } from './auth.controller';
import { registerSchema, loginSchema, changePasswordSchema, } from './auth.validation';
const router = Router();
router.route('/register').post(validate(registerSchema), register);
router.route('/login').post(validate(loginSchema), login);
router.route('/logout').post(protect, logout);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/change-password').post(protect, validate(changePasswordSchema), changeCurrentPassword);
router.route('/me').get(protect, getCurrentUser);
export default router;
//# sourceMappingURL=auth.routes.js.map