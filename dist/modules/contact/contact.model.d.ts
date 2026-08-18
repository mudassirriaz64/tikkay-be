import { Document } from 'mongoose';
export type ContactAccent = 'whatsapp' | 'orange' | 'peach' | 'gold';
export interface IContactMethod extends Document {
    icon: 'whatsapp' | 'phone' | 'map-pin';
    accent: ContactAccent;
    title: string;
    value: string;
    helper: string;
    href: string;
    display_order: number;
}
export interface IOpeningDay extends Document {
    day: string;
    hours: string;
    isClosed?: boolean;
    display_order: number;
}
export interface IContactPageConfig extends Document<string> {
    hero: {
        label: string;
        titleLead: string;
        titleAccent: string;
        availability: string;
    };
    map: {
        restaurantName: string;
        description: string;
        address: string;
        mapsUrl: string;
    };
    form: {
        heading: string;
        accent: string;
        description: string;
        responseTime: string;
    };
    catering: {
        eyebrow: string;
        titleLead: string;
        titleAccent: string;
        description: string;
        menuLabel: string;
        quoteLabel: string;
        imageUrl: string;
        image_public_id?: string;
    };
    franchise: {
        eyebrow: string;
        title: string;
        titleAccent: string;
        description: string;
        placeholder: string;
        notifyLabel: string;
        portalLabel: string;
    };
}
export interface IContactSubmission extends Document {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
}
export declare const ContactMethod: import("mongoose").Model<IContactMethod, {}, {}, {}, Document<unknown, {}, IContactMethod, {}, {}> & IContactMethod & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const OpeningDay: import("mongoose").Model<IOpeningDay, {}, {}, {}, Document<unknown, {}, IOpeningDay, {}, {}> & IOpeningDay & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const ContactPageConfig: import("mongoose").Model<IContactPageConfig, {}, {}, {}, Document<unknown, {}, IContactPageConfig, {}, {}> & IContactPageConfig & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export declare const ContactSubmission: import("mongoose").Model<IContactSubmission, {}, {}, {}, Document<unknown, {}, IContactSubmission, {}, {}> & IContactSubmission & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=contact.model.d.ts.map