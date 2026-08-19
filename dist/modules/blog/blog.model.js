"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPost = void 0;
const mongoose_1 = require("mongoose");
const blogPostSchema = new mongoose_1.Schema({
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Tikkay Shikkay Pitmasters' },
    publishedAt: { type: String, required: true },
    imageUrl: { type: String, default: '/images/hero_image.png' },
    category: { type: String, required: true, index: true },
    readTime: { type: String, default: '5 min' },
    tags: [{ type: String }],
    is_published: { type: Boolean, default: true, index: true },
}, { timestamps: true });
blogPostSchema.index({ category: 1, is_published: 1, createdAt: -1 });
exports.BlogPost = (0, mongoose_1.model)('BlogPost', blogPostSchema);
//# sourceMappingURL=blog.model.js.map