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
exports.getAccountsPageData = exports.getLoyaltyCount = exports.getLoyaltyStatus = exports.joinLoyalty = exports.getMyReviews = exports.getFavorites = exports.addToFavorites = exports.deleteUser = exports.updateUserRole = exports.getUserById = exports.getAllUsers = exports.updateProfile = exports.getProfile = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const auth_model_1 = require("../auth/auth.model");
const mongoose_1 = require("mongoose");
exports.getProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await auth_model_1.User.findById(req.user._id);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, user, 'Profile fetched successfully'));
});
exports.updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const updateData = {};
    const allowedFields = ['name', 'phone', 'address'];
    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    }
    const user = await auth_model_1.User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, user, 'Profile updated successfully'));
});
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const users = await auth_model_1.User.find().sort({ createdAt: -1 });
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, users, 'Users fetched successfully'));
});
exports.getUserById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const user = await auth_model_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, user, 'User fetched successfully'));
});
exports.updateUserRole = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        throw new ApiError_1.ApiError(400, 'Invalid role');
    }
    const user = await auth_model_1.User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, user, 'User role updated successfully'));
});
exports.deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (id === req.user._id) {
        throw new ApiError_1.ApiError(400, 'Cannot delete your own account');
    }
    const user = await auth_model_1.User.findByIdAndDelete(id);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, 'User deleted successfully'));
});
exports.addToFavorites = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { itemId, toggle } = req.body;
    if (!itemId || !mongoose_1.Types.ObjectId.isValid(itemId)) {
        throw new ApiError_1.ApiError(400, 'Valid itemId is required');
    }
    const user = await auth_model_1.User.findById(userId);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    const objectId = new mongoose_1.Types.ObjectId(itemId);
    const exists = user.favorites.some((id) => id.toString() === itemId);
    if (toggle) {
        user.favorites = exists
            ? user.favorites.filter((id) => id.toString() !== itemId)
            : [...user.favorites, objectId];
    }
    else if (!exists) {
        user.favorites.push(objectId);
    }
    await user.save();
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, user.favorites.map((id) => id.toString()), 'Favorites updated successfully'));
});
exports.getFavorites = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await auth_model_1.User.findById(req.user._id);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, user.favorites.map((id) => id.toString()), 'Favorites fetched successfully'));
});
const toAccountReview = (review) => ({
    id: review._id.toString(),
    dish: review.favorite_meal || '',
    rating: review.rating,
    review_text: review.review_text,
    created_at: review.createdAt,
    is_approved: review.is_approved,
});
exports.getMyReviews = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { CustomerReview } = await Promise.resolve().then(() => __importStar(require('../reviews/reviews.model')));
    const reviews = await CustomerReview.find({ user_id: new mongoose_1.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, reviews.map(toAccountReview), 'My reviews fetched successfully'));
});
exports.joinLoyalty = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { birthday, whatsapp_opt_in } = req.body;
    const user = await auth_model_1.User.findById(userId);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    user.is_loyalty_member = true;
    if (!user.loyalty_joined_at) {
        user.loyalty_joined_at = new Date().toISOString();
    }
    if (birthday) {
        user.birthday = birthday;
    }
    if (whatsapp_opt_in !== undefined) {
        user.whatsapp_opt_in = Boolean(whatsapp_opt_in);
    }
    await user.save();
    // WhatsApp VIP community invite link
    const whatsappCommunityUrl = 'https://chat.whatsapp.com/TikkayShikkayGrillFamVIP';
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        user,
        whatsapp_community_url: whatsappCommunityUrl,
    }, 'Successfully joined the Tikkay Shikkay Loyalty Club'));
});
exports.getLoyaltyStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const user = await auth_model_1.User.findById(userId);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        is_loyalty_member: Boolean(user.is_loyalty_member),
        loyalty_points: user.loyalty_points || 0,
        loyalty_joined_at: user.loyalty_joined_at,
        birthday: user.birthday || '',
        whatsapp_opt_in: Boolean(user.whatsapp_opt_in),
        whatsapp_community_url: 'https://chat.whatsapp.com/TikkayShikkayGrillFamVIP',
    }, 'Loyalty status fetched successfully'));
});
exports.getLoyaltyCount = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const memberCount = await auth_model_1.User.countDocuments({ is_loyalty_member: true });
    // Base offset of real loyal community members + live database members
    const totalDisplayCount = 12470 + memberCount;
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { count: totalDisplayCount, rawCount: memberCount }, 'Loyalty member count fetched successfully'));
});
exports.getAccountsPageData = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const [user, orders, reviews, menuItems] = await Promise.all([
        auth_model_1.User.findById(userId),
        Promise.resolve().then(() => __importStar(require('../orders/orders.model'))).then(({ Order }) => Order.find({ user_id: new mongoose_1.Types.ObjectId(userId) }).sort({ createdAt: -1 }).limit(10)),
        Promise.resolve().then(() => __importStar(require('../reviews/reviews.model'))).then(({ CustomerReview }) => CustomerReview.find({ user_id: new mongoose_1.Types.ObjectId(userId) }).sort({ createdAt: -1 }).limit(20)),
        Promise.resolve().then(() => __importStar(require('../menu/models/item.model'))).then(({ MenuItem }) => MenuItem.find()),
    ]);
    const pageData = {
        demoProfile: user,
        orders,
        reviews: reviews.map(toAccountReview),
        menuItems,
    };
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, pageData, 'Accounts page data fetched successfully'));
});
//# sourceMappingURL=users.controller.js.map