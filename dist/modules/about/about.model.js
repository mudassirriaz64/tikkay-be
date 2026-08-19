"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutPageConfig = exports.MilestoneStat = exports.StatItem = exports.FounderDetails = exports.JourneyPostModel = void 0;
const mongoose_1 = require("mongoose");
var gallery_model_1 = require("../gallery/gallery.model");
Object.defineProperty(exports, "JourneyPostModel", { enumerable: true, get: function () { return gallery_model_1.JourneyPost; } });
const founderDetailsSchema = new mongoose_1.Schema({
    _id: { type: String },
    portraitUrl: { type: String, required: true, default: '/images/our_legacy.png' },
    portrait_public_id: { type: String, default: undefined },
    quote: { type: String, required: true, default: '' },
    quoteAuthor: { type: String, required: true, default: 'Ahmed Raza' },
    quoteRole: { type: String, required: true, default: 'Founder & Pitmaster' },
    eyebrow: { type: String, required: true, default: 'The Visionary' },
    title: { type: String, required: true, default: 'Meet Ahmed' },
    bio: { type: String, required: true, default: '' },
    caption: { type: String, default: '' },
    mission: { type: String, default: '' },
    vision: { type: String, default: '' },
}, { timestamps: true });
const statItemSchema = new mongoose_1.Schema({
    value: { type: String, required: true },
    label: { type: String, required: true },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const milestoneStatSchema = new mongoose_1.Schema({
    number: { type: String, required: true },
    label: { type: String, required: true },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const aboutPageConfigSchema = new mongoose_1.Schema({
    _id: { type: String },
    hero: {
        label: { type: String, default: 'Our Story' },
        titleLead: { type: String, default: 'Twelve Years of' },
        titleAccent: { type: String, default: 'Fire & Flavor' },
        description: { type: String, default: 'From a backyard grill obsession to Pakistan\'s most-loved BBQ brand — this is how the fire grew.' },
        imageUrl: { type: String, default: '/images/about-hero.jpg' },
        image_public_id: { type: String, default: undefined },
    },
}, { timestamps: true });
exports.FounderDetails = (0, mongoose_1.model)('FounderDetails', founderDetailsSchema);
exports.StatItem = (0, mongoose_1.model)('StatItem', statItemSchema);
exports.MilestoneStat = (0, mongoose_1.model)('MilestoneStat', milestoneStatSchema);
exports.AboutPageConfig = (0, mongoose_1.model)('AboutPageConfig', aboutPageConfigSchema);
//# sourceMappingURL=about.model.js.map