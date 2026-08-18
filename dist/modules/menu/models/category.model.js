/// <reference types="node" />
/// <reference types="mongoose" />
import { Schema, model } from 'mongoose';
const menuCategorySchema = new Schema({
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
export const MenuCategory = model('MenuCategory', menuCategorySchema);
//# sourceMappingURL=category.model.js.map