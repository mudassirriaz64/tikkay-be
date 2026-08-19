"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="express" />
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const users_controller_1 = require("./users.controller");
const router = (0, express_1.Router)();
router.route('/profile')
    .get(auth_middleware_1.protect, users_controller_1.getProfile)
    .patch(auth_middleware_1.protect, users_controller_1.updateProfile);
router.route('/loyalty/join').post(auth_middleware_1.protect, users_controller_1.joinLoyalty);
router.route('/loyalty/status').get(auth_middleware_1.protect, users_controller_1.getLoyaltyStatus);
router.route('/loyalty/count').get(users_controller_1.getLoyaltyCount);
router.route('/accounts-page').get(auth_middleware_1.protect, users_controller_1.getAccountsPageData);
router.route('/favorites')
    .get(auth_middleware_1.protect, users_controller_1.getFavorites)
    .post(auth_middleware_1.protect, users_controller_1.addToFavorites);
router.route('/my-reviews').get(auth_middleware_1.protect, users_controller_1.getMyReviews);
router.route('/').get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, users_controller_1.getAllUsers);
router.route('/:id')
    .get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, users_controller_1.getUserById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, users_controller_1.updateUserRole)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, users_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=users.routes.js.map