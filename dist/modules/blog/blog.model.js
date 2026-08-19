import { Schema, model } from 'mongoose';
const blogPostSchema = new Schema({
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
export const BlogPost = model('BlogPost', blogPostSchema);
//# sourceMappingURL=blog.model.js.map