"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuCategory = void 0;
/// <reference types="node" />
/// <reference types="mongoose" />
const mongoose_1 = require("mongoose");
const menuCategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
        type: String,
        required: [true, 'Category slug is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    subtitle: {
        type: String,
        default: undefined,
        trim: true,
    },
    display_order: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});
exports.MenuCategory = (0, mongoose_1.model)('MenuCategory', menuCategorySchema);
//# sourceMappingURL=category.model.js.map