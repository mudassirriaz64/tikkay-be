"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="express" />
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const franchise_controller_1 = require("./franchise.controller");
const router = (0, express_1.Router)();
router.route('/')
    .post(franchise_controller_1.createFranchiseInquiry)
    .get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, franchise_controller_1.getAllFranchiseInquiries);
router.route('/:id/status')
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, franchise_controller_1.updateFranchiseStatus);
router.route('/:id')
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, franchise_controller_1.deleteFranchiseInquiry);
exports.default = router;
//# sourceMappingURL=franchise.routes.js.map