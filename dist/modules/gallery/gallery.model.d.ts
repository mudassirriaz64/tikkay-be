import { Document } from 'mongoose';
export type GalleryTabId = 'customers' | 'behind-scenes' | 'journey' | 'gallery';
export type GalleryCategoryId = 'food' | 'grill' | 'customers' | 'atmosphere';
export type JourneyType = 'milestone' | 'achievement' | 'challenge' | 'lesson' | 'future';
export interface IGalleryImage extends Document {
    imageUrl: string;
    image_public_id?: string;
    caption: string;
    location: string;
    category: GalleryCategoryId;
    alt: string;
    tag?: string;
    display_order: number;
}
export interface IVideoTestimonial extends Document {
    customer_name: string;
    title: string;
    description?: string;
    duration: string;
    thumbnail: string;
    video_url?: string;
    video_public_id?: string;
    source: string;
    source_type: 'embed' | 'upload';
    status: 'ready' | 'processing' | 'failed';
    display_order: number;
}
export interface IInstagramPost extends Document {
    imageUrl: string;
    image_public_id?: string;
    caption: string;
    tag: string;
    likes: number;
    comments: number;
    display_order: number;
}
export interface IGoogleReview extends Document {
    customer_name: string;
    rating: number;
    visit_date: string;
    review_text: string;
    verified: boolean;
    source: string;
    display_order: number;
}
export interface ICustomerStory extends Document {
    customer_name: string;
    imageUrl: string;
    image_public_id?: string;
    favorite_meal: string;
    years_visiting: number;
    visits: number;
    quote: string;
    timeline: {
        year: string;
        label: string;
        note: string;
    }[];
    display_order: number;
}
export interface IKitchenProcess extends Document {
    step: number;
    title: string;
    imageUrl: string;
    image_public_id?: string;
    story: string;
    fact: string;
    time: string;
    display_order: number;
}
export interface IJourneyMilestone extends Document {
    year: string;
    title: string;
    imageUrl: string;
    image_public_id?: string;
    story: string;
    badge: string;
    type: JourneyType;
    stat?: {
        value: number;
        suffix: string;
        label: string;
    };
    display_order: number;
}
export interface IJourneyPost extends Document {
    day_number: number;
    title: string;
    content: string;
    media_type: 'Image' | 'Video';
    media_url: string;
    image_public_id?: string;
    created_at: string;
    display_order: number;
}
export interface IGalleryPageConfig extends Document<string> {
    hero: {
        label: string;
        titleLead: string;
        titleMid: string;
        titleAccent: string;
        description: string;
        imageUrl: string;
    };
    tabs: {
        id: GalleryTabId;
        sectionId: string;
        label: string;
        shortLabel: string;
        title: string;
        description: string;
        icon: 'users' | 'chef-hat' | 'flame' | 'camera';
    }[];
    galleryCategories: {
        id: GalleryCategoryId | 'all';
        label: string;
    }[];
    cta: {
        title: string;
        description: string;
        primaryLabel: string;
        primaryHref: string;
        secondaryLabel: string;
        secondaryHref: string;
        imageUrl: string;
    };
}
export declare const GalleryImage: import("mongoose").Model<IGalleryImage, {}, {}, {}, Document<unknown, {}, IGalleryImage, {}, {}> & IGalleryImage & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const VideoTestimonial: import("mongoose").Model<IVideoTestimonial, {}, {}, {}, Document<unknown, {}, IVideoTestimonial, {}, {}> & IVideoTestimonial & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const InstagramPost: import("mongoose").Model<IInstagramPost, {}, {}, {}, Document<unknown, {}, IInstagramPost, {}, {}> & IInstagramPost & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const GoogleReview: import("mongoose").Model<IGoogleReview, {}, {}, {}, Document<unknown, {}, IGoogleReview, {}, {}> & IGoogleReview & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const CustomerStory: import("mongoose").Model<ICustomerStory, {}, {}, {}, Document<unknown, {}, ICustomerStory, {}, {}> & ICustomerStory & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const KitchenProcess: import("mongoose").Model<IKitchenProcess, {}, {}, {}, Document<unknown, {}, IKitchenProcess, {}, {}> & IKitchenProcess & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const JourneyMilestone: import("mongoose").Model<IJourneyMilestone, {}, {}, {}, Document<unknown, {}, IJourneyMilestone, {}, {}> & IJourneyMilestone & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const JourneyPost: import("mongoose").Model<IJourneyPost, {}, {}, {}, Document<unknown, {}, IJourneyPost, {}, {}> & IJourneyPost & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const GalleryPageConfig: import("mongoose").Model<IGalleryPageConfig, {}, {}, {}, Document<unknown, {}, IGalleryPageConfig, {}, {}> & IGalleryPageConfig & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=gallery.model.d.ts.map