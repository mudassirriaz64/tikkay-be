import { Document } from 'mongoose';
export type MediaType = 'Image' | 'Video';
export type { IJourneyPost } from '../gallery/gallery.model';
export { JourneyPost as JourneyPostModel } from '../gallery/gallery.model';
export interface IFounderDetails extends Document<string> {
    portraitUrl: string;
    portrait_public_id?: string;
    quote: string;
    quoteAuthor: string;
    quoteRole: string;
    eyebrow: string;
    title: string;
    bio: string;
    caption: string;
    mission: string;
    vision: string;
}
export interface IStatItem extends Document {
    value: string;
    label: string;
    display_order: number;
}
export interface IMilestoneStat extends Document {
    number: string;
    label: string;
    display_order: number;
}
export interface IAboutPageConfig extends Document<string> {
    hero: {
        label: string;
        titleLead: string;
        titleAccent: string;
        description: string;
        imageUrl: string;
        image_public_id?: string;
    };
}
export declare const FounderDetails: import("mongoose").Model<IFounderDetails, {}, {}, {}, Document<unknown, {}, IFounderDetails, {}, {}> & IFounderDetails & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export declare const StatItem: import("mongoose").Model<IStatItem, {}, {}, {}, Document<unknown, {}, IStatItem, {}, {}> & IStatItem & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const MilestoneStat: import("mongoose").Model<IMilestoneStat, {}, {}, {}, Document<unknown, {}, IMilestoneStat, {}, {}> & IMilestoneStat & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const AboutPageConfig: import("mongoose").Model<IAboutPageConfig, {}, {}, {}, Document<unknown, {}, IAboutPageConfig, {}, {}> & IAboutPageConfig & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=about.model.d.ts.map