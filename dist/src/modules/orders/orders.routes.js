"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="express" />
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const orders_controller_1 = require("./orders.controller");
const router = (0, express_1.Router)();
router.route('/')
    .post(orders_controller_1.createOrder)
    .get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, orders_controller_1.getAllOrders);
router.route('/stats').get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, orders_controller_1.getOrderStats);
router.route('/my').get(auth_middleware_1.protect, orders_controller_1.getMyOrders);
router.route('/:id')
    .get(auth_middleware_1.protectOptional, orders_controller_1.getOrderById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, orders_controller_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=orders.routes.js.map