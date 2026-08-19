"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePageConfig = exports.getPageConfig = exports.deleteVideoReview = exports.updateVideoReview = exports.createVideoReview = exports.getVideoReviews = exports.deleteStatistic = exports.updateStatistic = exports.createStatistic = exports.getStatistics = exports.deleteReview = exports.updateReview = exports.approveReview = exports.createReview = exports.getPendingReviews = exports.getReviewsPageData = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const reviews_model_1 = require("./reviews.model");
const gallery_model_1 = require("../gallery/gallery.model");
const mongoose_1 = require("mongoose");
const getOrCreatePageConfig = async () => {
    let config = await reviews_model_1.ReviewsPageConfig.findOne({});
    if (!config) {
        config = new reviews_model_1.ReviewsPageConfig({});
        await config.save();
    }
    return config;
};
exports.getReviewsPageData = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const [pageConfig, statistics, allReviews, videoReviews, galleryImages] = await Promise.all([
        getOrCreatePageConfig(),
        reviews_model_1.Statistic.find().sort({ display_order: 1 }),
        reviews_model_1.CustomerReview.find().sort({ display_order: 1, createdAt: -1 }),
        reviews_model_1.VideoReview.find().sort({ display_order: 1 }),
        gallery_model_1.GalleryImage.find().sort({ createdAt: -1 }).limit(12),
    ]);
    const featured = allReviews.find((r) => r.display_section === 'featured') || allReviews[0];
    const highlights = allReviews.filter((r) => r.display_section === 'highlights').slice(0, 3);
    const reviews = allReviews;
    const pageData = {
        hero: pageConfig.hero,
        statistics,
        categories: pageConfig.categories,
        featured: featured || null,
        highlights,
        reviews,
        videos: videoReviews,
        gallery: galleryImages,
        cta: pageConfig.cta,
    };
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, pageData, 'Reviews page data fetched successfully'));
});
exports.getPendingReviews = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const reviews = await reviews_model_1.CustomerReview.find({ is_approved: false })
        .sort({ createdAt: -1 })
        .populate('user_id', 'name email');
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, reviews, 'Pending reviews fetched successfully'));
});
exports.createReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const isApproved = req.body.is_approved !== undefined ? Boolean(req.body.is_approved) : true;
    const review = await reviews_model_1.CustomerReview.create({
        ...req.body,
        user_id: req.user?._id ? new mongoose_1.Types.ObjectId(req.user._id) : undefined,
        is_approved: isApproved,
    });
    res
        .status(201)
        .json(new ApiResponse_1.ApiResponse(201, review, 'Review submitted successfully'));
});
exports.approveReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const review = await reviews_model_1.CustomerReview.findByIdAndUpdate(id, { is_approved: true }, { new: true });
    if (!review) {
        throw new ApiError_1.ApiError(404, 'Review not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, review, 'Review approved successfully'));
});
exports.updateReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const review = await reviews_model_1.CustomerReview.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!review) {
        throw new ApiError_1.ApiError(404, 'Review not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, review, 'Review updated successfully'));
});
exports.deleteReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const review = await reviews_model_1.CustomerReview.findByIdAndDelete(id);
    if (!review) {
        throw new ApiError_1.ApiError(404, 'Review not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, 'Review deleted successfully'));
});
exports.getStatistics = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const stats = await reviews_model_1.Statistic.find().sort({ display_order: 1 });
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, stats, 'Statistics fetched successfully'));
});
exports.createStatistic = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const stat = await reviews_model_1.Statistic.create(req.body);
    res
        .status(201)
        .json(new ApiResponse_1.ApiResponse(201, stat, 'Statistic created successfully'));
});
exports.updateStatistic = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const stat = await reviews_model_1.Statistic.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!stat) {
        throw new ApiError_1.ApiError(404, 'Statistic not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, stat, 'Statistic updated successfully'));
});
exports.deleteStatistic = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const stat = await reviews_model_1.Statistic.findByIdAndDelete(id);
    if (!stat) {
        throw new ApiError_1.ApiError(404, 'Statistic not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, 'Statistic deleted successfully'));
});
exports.getVideoReviews = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const videos = await reviews_model_1.VideoReview.find().sort({ display_order: 1 });
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, videos, 'Video reviews fetched successfully'));
});
exports.createVideoReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const video = await reviews_model_1.VideoReview.create(req.body);
    res
        .status(201)
        .json(new ApiResponse_1.ApiResponse(201, video, 'Video review created successfully'));
});
exports.updateVideoReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const video = await reviews_model_1.VideoReview.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!video) {
        throw new ApiError_1.ApiError(404, 'Video review not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, video, 'Video review updated successfully'));
});
exports.deleteVideoReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const video = await reviews_model_1.VideoReview.findByIdAndDelete(id);
    if (!video) {
        throw new ApiError_1.ApiError(404, 'Video review not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, 'Video review deleted successfully'));
});
exports.getPageConfig = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const config = await getOrCreatePageConfig();
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, config, 'Reviews page config fetched successfully'));
});
exports.updatePageConfig = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const config = await getOrCreatePageConfig();
    Object.assign(config, req.body);
    await config.save();
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, config, 'Reviews page config updated successfully'));
});
//# sourceMappingURL=reviews.controller.js.map