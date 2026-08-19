import { Document } from 'mongoose';
export interface IBlogPost extends Document {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    publishedAt: string;
    imageUrl: string;
    category: string;
    readTime: string;
    tags?: string[];
    is_published: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BlogPost: import("mongoose").Model<IBlogPost, {}, {}, {}, Document<unknown, {}, IBlogPost, {}, {}> & IBlogPost & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=blog.model.d.ts.map