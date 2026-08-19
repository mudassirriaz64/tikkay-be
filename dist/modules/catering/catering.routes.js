"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="express" />
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const catering_controller_1 = require("./catering.controller");
const router = (0, express_1.Router)();
router.route('/requests').post(auth_middleware_1.protectOptional, catering_controller_1.createCateringRequest);
router.route('/availability').get(catering_controller_1.checkAvailability);
router.route('/my').get(auth_middleware_1.protect, catering_controller_1.getMyCateringRequests);
router.route('/')
    .get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, catering_controller_1.getAllCateringRequests);
router.route('/:id/status')
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, catering_controller_1.updateCateringStatus);
exports.default = router;
//# sourceMappingURL=catering.routes.js.map