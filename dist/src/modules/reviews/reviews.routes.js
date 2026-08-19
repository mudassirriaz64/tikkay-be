"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const reviews_controller_1 = require("./reviews.controller");
const reviews_model_1 = require("./reviews.model");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.route('/page-data').get(reviews_controller_1.getReviewsPageData);
router.route('/page-config')
    .get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, reviews_controller_1.getPageConfig)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, reviews_controller_1.updatePageConfig);
router.route('/')
    .get((0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const reviews = await reviews_model_1.CustomerReview.find({ is_approved: true }).sort({ display_order: 1, createdAt: -1 });
    res.json({ success: true, data: reviews, message: 'Reviews fetched' });
}))
    .post(auth_middleware_1.protectOptional, reviews_controller_1.createReview);
router.route('/statistics')
    .get(reviews_controller_1.getStatistics)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, reviews_controller_1.createStatistic);
router.route('/statistics/:id')
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, reviews_controller_1.updateStatistic)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, reviews_controller_1.deleteStatistic);
router.route('/videos')
    .get(reviews_controller_1.getVideoReviews)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, reviews_controller_1.createVideoReview);
router.route('/videos/:id')
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, reviews_controller_1.updateVideoReview)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, reviews_controller_1.deleteVideoReview);
router.route('/pending').get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, reviews_controller_1.getPendingReviews);
router.route('/:id/approve').patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, reviews_controller_1.approveReview);
router.route('/:id')
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, reviews_controller_1.updateReview)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, reviews_controller_1.deleteReview);
exports.default = router;
//# sourceMappingURL=reviews.routes.js.map