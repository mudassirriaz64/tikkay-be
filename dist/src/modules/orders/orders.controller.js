"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStats = exports.updateOrderStatus = exports.getOrderById = exports.getAllOrders = exports.getMyOrders = exports.createOrder = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const orders_model_1 = require("./orders.model");
const mongoose_1 = require("mongoose");
const STATUS_LABELS = {
    placed: 'Order Placed',
    preparing: 'Preparing Your Order',
    ready: 'Ready for Pickup',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered',
};
exports.createOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { user_id, customer_name, customer_email, customer_phone, customer_address, items, subtotal, deliveryFee = 0, total, payment_method = 'cash', order_notes, } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new ApiError_1.ApiError(400, 'Order must contain at least one item');
    }
    if (user_id !== undefined && user_id !== null && !mongoose_1.Types.ObjectId.isValid(user_id)) {
        throw new ApiError_1.ApiError(400, 'Invalid user_id');
    }
    const placedAt = new Date().toISOString();
    const order = await orders_model_1.Order.create({
        user_id: user_id ? new mongoose_1.Types.ObjectId(user_id) : undefined,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        items,
        subtotal,
        deliveryFee,
        total,
        payment_method,
        order_notes,
        placedAt,
    });
    res
        .status(201)
        .json(new ApiResponse_1.ApiResponse(201, order, 'Order placed successfully'));
});
exports.getMyOrders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const orders = await orders_model_1.Order.find({ user_id: new mongoose_1.Types.ObjectId(userId) })
        .sort({ createdAt: -1 });
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, orders, 'User orders fetched successfully'));
});
exports.getAllOrders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status, limit } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    const query = orders_model_1.Order.find(filter).sort({ createdAt: -1 });
    const parsedLimit = limit ? parseInt(limit, 10) : NaN;
    if (Number.isFinite(parsedLimit) && parsedLimit > 0)
        query.limit(parsedLimit);
    const orders = await query;
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, orders, 'All orders fetched successfully'));
});
exports.getOrderById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = await orders_model_1.Order.findById(id);
    if (!order) {
        throw new ApiError_1.ApiError(404, 'Order not found');
    }
    // If order was placed as a guest (no user_id), allow retrieval
    // If order is linked to a user, enforce owner or admin access
    if (order.user_id) {
        const isAdmin = req.user?.role === 'admin';
        const isOwner = req.user?._id && order.user_id.toString() === req.user._id;
        if (!isAdmin && !isOwner) {
            throw new ApiError_1.ApiError(403, 'You do not have permission to view this order');
        }
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, order, 'Order fetched successfully'));
});
exports.updateOrderStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orders_model_1.Order.findById(id);
    if (!order) {
        throw new ApiError_1.ApiError(404, 'Order not found');
    }
    const validStatuses = ['placed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
    if (!validStatuses.includes(status)) {
        throw new ApiError_1.ApiError(400, 'Invalid order status');
    }
    const currentIndex = validStatuses.indexOf(order.status);
    const newIndex = validStatuses.indexOf(status);
    if (newIndex < currentIndex) {
        throw new ApiError_1.ApiError(400, 'Cannot revert order status to an earlier stage');
    }
    order.status = status;
    const timelineStatuses = order.timeline.map((t) => t.status);
    if (!timelineStatuses.includes(status)) {
        order.timeline.push({
            status,
            label: STATUS_LABELS[status],
            timestamp: new Date().toISOString(),
        });
    }
    if (status === 'delivered') {
        order.payment_status = 'paid';
        // Award loyalty points to member if order is linked to a user account
        if (order.user_id) {
            try {
                const { User } = await Promise.resolve().then(() => __importStar(require('../auth/auth.model')));
                const user = await User.findById(order.user_id);
                if (user && user.is_loyalty_member) {
                    const pointsEarned = Math.floor(order.total / 100);
                    if (pointsEarned > 0) {
                        user.loyalty_points = (user.loyalty_points || 0) + pointsEarned;
                        await user.save();
                    }
                }
            }
            catch {
                // Continue silently if user loyalty points update fails
            }
        }
    }
    await order.save();
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, order, 'Order status updated successfully'));
});
exports.getOrderStats = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const [totalOrders, pending, preparing, ready, outForDelivery, delivered, today] = await Promise.all([
        orders_model_1.Order.countDocuments(),
        orders_model_1.Order.countDocuments({ status: 'placed' }),
        orders_model_1.Order.countDocuments({ status: 'preparing' }),
        orders_model_1.Order.countDocuments({ status: 'ready' }),
        orders_model_1.Order.countDocuments({ status: 'out-for-delivery' }),
        orders_model_1.Order.countDocuments({ status: 'delivered' }),
        orders_model_1.Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            },
            { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } },
        ]),
    ]);
    const stats = {
        total: totalOrders,
        byStatus: {
            placed: pending,
            preparing,
            ready,
            'out-for-delivery': outForDelivery,
            delivered,
        },
        today: today[0]?.count || 0,
        todayRevenue: today[0]?.revenue || 0,
    };
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, stats, 'Order statistics fetched successfully'));
});
//# sourceMappingURL=orders.controller.js.map