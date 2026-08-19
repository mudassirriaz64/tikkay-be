"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsPageConfig = exports.VideoReview = exports.Statistic = exports.CustomerReview = void 0;
/// <reference types="node" />
/// <reference types="mongoose" />
const mongoose_1 = require("mongoose");
const customerReviewSchema = new mongoose_1.Schema({
    customer_name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    review_text: { type: String, required: true, trim: true },
    source: { type: String, enum: ['Google', 'Instagram', 'Direct'], default: 'Direct' },
    category: {
        type: String,
        enum: ['Families', 'Friends', 'Corporate', 'Birthday', 'Couples'],
        required: true,
    },
    visit_date: { type: String, required: true, default: () => new Date().toISOString().split('T')[0] },
    favorite_meal: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    helpful_count: { type: Number, default: 0, min: 0 },
    image_url: { type: String, default: '/images/reviews/default-review.jpg' },
    customerImageUrl: { type: String, default: undefined },
    is_approved: { type: Boolean, default: false, index: true },
    display_section: { type: String, enum: ['featured', 'highlights', 'reviews'], default: 'reviews' },
    display_order: { type: Number, default: 0 },
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: undefined },
}, { timestamps: true });
customerReviewSchema.index({ is_approved: 1, rating: -1, display_order: 1 });
const statisticSchema = new mongoose_1.Schema({
    value: { type: Number, required: true, min: 0 },
    decimals: { type: Number, default: 0, min: 0, max: 2 },
    suffix: { type: String, default: '' },
    label: { type: String, required: true, trim: true },
    icon: { type: String, enum: ['star', 'users', 'repeat', 'thumbs-up'], required: true },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const videoReviewSchema = new mongoose_1.Schema({
    customer_name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    duration: { type: String, required: true, default: '0:00' },
    thumbnail: { type: String, required: true, default: '/images/reviews/default-video.jpg' },
    category: {
        type: String,
        enum: ['Families', 'Friends', 'Corporate', 'Birthday', 'Couples'],
        required: true,
    },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const reviewsPageConfigSchema = new mongoose_1.Schema({
    _id: { type: String },
    hero: {
        label: { type: String, default: 'Wall of Love' },
        titleLead: { type: String, default: 'Stories from the' },
        titleAccent: { type: String, default: 'Flame Side' },
        description: { type: String, default: 'Real words from real guests who bring us back every night.' },
        imageUrl: { type: String, default: '/images/reviews/hero-bbq.jpg' },
    },
    categories: {
        type: [
            {
                id: { type: String, required: true },
                label: { type: String, required: true },
            },
        ],
        default: [
            { id: 'all', label: 'All Reviews' },
            { id: 'Families', label: 'Families' },
            { id: 'Friends', label: 'Friends' },
            { id: 'Corporate', label: 'Corporate' },
            { id: 'Birthday', label: 'Birthday' },
            { id: 'Couples', label: 'Couples' },
        ],
    },
    cta: {
        title: { type: String, default: 'Share Your Story' },
        description: { type: String, default: 'Tell us about your night at Tikkay Shikkay. Every review fuels the fire.' },
        primaryLabel: { type: String, default: 'Leave a Review' },
        primaryHref: { type: String, default: '/contact' },
        secondaryLabel: { type: String, default: 'Order Now' },
        secondaryHref: { type: String, default: '/menu' },
        imageUrl: { type: String, default: '/images/reviews/cta-fire.jpg' },
    },
}, { timestamps: true });
exports.CustomerReview = (0, mongoose_1.model)('CustomerReview', customerReviewSchema);
exports.Statistic = (0, mongoose_1.model)('Statistic', statisticSchema);
exports.VideoReview = (0, mongoose_1.model)('VideoReview', videoReviewSchema);
exports.ReviewsPageConfig = (0, mongoose_1.model)('ReviewsPageConfig', reviewsPageConfigSchema);
//# sourceMappingURL=reviews.model.js.map