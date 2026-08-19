import { Document, Types } from 'mongoose';
export type ReviewSource = 'Google' | 'Instagram' | 'Direct';
export type ReviewCategory = 'Families' | 'Friends' | 'Corporate' | 'Birthday' | 'Couples';
export type StatisticIcon = 'star' | 'users' | 'repeat' | 'thumbs-up';
export interface ICustomerReview extends Document {
    customer_name: string;
    location: string;
    rating: number;
    title: string;
    review_text: string;
    source: ReviewSource;
    category: ReviewCategory;
    visit_date: string;
    favorite_meal: string;
    verified: boolean;
    helpful_count: number;
    image_url: string;
    customerImageUrl?: string;
    is_approved: boolean;
    display_section?: 'featured' | 'highlights' | 'reviews';
    display_order?: number;
    user_id?: Types.ObjectId;
}
export interface IStatistic extends Document {
    value: number;
    decimals?: number;
    suffix?: string;
    label: string;
    icon: StatisticIcon;
    display_order: number;
}
export interface IVideoReview extends Document {
    customer_name: string;
    title: string;
    duration: string;
    thumbnail: string;
    category: ReviewCategory;
    display_order: number;
}
export interface IReviewsPageConfig extends Document<string> {
    hero: {
        label: string;
        titleLead: string;
        titleAccent: string;
        description: string;
        imageUrl: string;
    };
    categories: {
        id: string;
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
export declare const CustomerReview: import("mongoose").Model<ICustomerReview, {}, {}, {}, Document<unknown, {}, ICustomerReview, {}, {}> & ICustomerReview & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const Statistic: import("mongoose").Model<IStatistic, {}, {}, {}, Document<unknown, {}, IStatistic, {}, {}> & IStatistic & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const VideoReview: import("mongoose").Model<IVideoReview, {}, {}, {}, Document<unknown, {}, IVideoReview, {}, {}> & IVideoReview & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const ReviewsPageConfig: import("mongoose").Model<IReviewsPageConfig, {}, {}, {}, Document<unknown, {}, IReviewsPageConfig, {}, {}> & IReviewsPageConfig & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=reviews.model.d.ts.map