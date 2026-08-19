"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="express" />
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const menu_controller_1 = require("./menu.controller");
const router = (0, express_1.Router)();
router.route('/page-data').get(menu_controller_1.getMenuPageData);
router.route('/page-config')
    .get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, menu_controller_1.getPageConfig)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, menu_controller_1.updatePageConfig);
router.route('/categories')
    .get(menu_controller_1.getCategories)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, menu_controller_1.createCategory);
router.route('/categories/:id')
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, menu_controller_1.updateCategory)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, menu_controller_1.deleteCategory);
router.route('/items')
    .get(menu_controller_1.getMenuItems)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, menu_controller_1.createMenuItem);
router.route('/items/:id')
    .get(menu_controller_1.getMenuItem)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, menu_controller_1.updateMenuItem)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, menu_controller_1.deleteMenuItem);
exports.default = router;
//# sourceMappingURL=menu.routes.js.map