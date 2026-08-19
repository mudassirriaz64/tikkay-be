"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuPageConfig = void 0;
/// <reference types="node" />
/// <reference types="mongoose" />
const mongoose_1 = require("mongoose");
const platterOptionSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
}, { _id: false });
const menuPageConfigSchema = new mongoose_1.Schema({
    _id: { type: String },
    tabs: {
        type: [
            {
                id: { type: String, required: true },
                label: { type: String, required: true },
                sectionId: { type: String, required: true },
            },
        ],
        default: [
            { id: 'tab-tikka', label: 'Tikka', sectionId: 'tikka' },
            { id: 'tab-boti', label: 'Boti', sectionId: 'boti' },
            { id: 'tab-platters', label: 'Platters', sectionId: 'platters' },
            { id: 'tab-sides', label: 'Sides & Sauces', sectionId: 'sides' },
        ],
    },
    platter: {
        baseLabel: { type: String, default: 'Build Your Platter' },
        basePrice: { type: Number, default: 2500, min: 0 },
        imageUrl: { type: String, default: '/images/menu/platter-biryani.jpg' },
        image_public_id: { type: String, default: undefined },
        meats: {
            type: [platterOptionSchema],
            default: [],
        },
        sides: {
            type: [platterOptionSchema],
            default: [],
        },
    },
    boti_featured_item_id: {
        type: String,
        default: undefined,
    },
    boti_compact_ids: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});
exports.MenuPageConfig = (0, mongoose_1.model)('MenuPageConfig', menuPageConfigSchema);
//# sourceMappingURL=pageConfig.model.js.map