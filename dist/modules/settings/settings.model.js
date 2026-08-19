"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettings = void 0;
/// <reference types="node" />
/// <reference path="../../types/global.d.ts" />
const mongoose_1 = require("mongoose");
const siteSettingsSchema = new mongoose_1.Schema({
    _id: { type: String },
    hero_title: {
        type: String,
        required: [true, 'Hero title is required'],
        trim: true,
        default: 'Fire-Grilled. Fresh Daily. Made With Pride.',
    },
    hero_subtitle: {
        type: String,
        required: [true, 'Hero subtitle is required'],
        trim: true,
        default: 'Experience the raw, untamed flavor of Pakistani street BBQ.',
    },
    hero_media_url: {
        type: String,
        required: [true, 'Hero media URL is required'],
        default: '/images/hero_image.png',
    },
    hero_media_public_id: {
        type: String,
        default: undefined,
    },
    live_cam_active: {
        type: Boolean,
        default: false,
    },
    fresh_batch_count: {
        type: Number,
        default: 0,
        min: [0, 'Fresh batch count cannot be negative'],
    },
    updated_at: {
        type: String,
        default: () => new Date().toISOString(),
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.SiteSettings = (0, mongoose_1.model)('SiteSettings', siteSettingsSchema);
//# sourceMappingURL=settings.model.js.map