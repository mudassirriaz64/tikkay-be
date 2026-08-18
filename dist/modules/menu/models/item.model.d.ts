import { Document, Types } from 'mongoose';
export type SpiceLevel = 'Mild' | 'Medium' | 'Hot' | 'Extra Spicy';
export type MenuRibbon = string;
export interface IMenuItem extends Document {
    category_id: Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    price: number;
    spice_level: SpiceLevel;
    is_bestseller: boolean;
    is_available: boolean;
    image_url: string;
    image_public_id?: string;
    ribbon?: MenuRibbon;
    tags?: string[];
    servings?: number;
    included_items?: string[];
    is_signature?: boolean;
    display_section?: 'featured' | 'boti' | 'sides' | 'regular';
    display_order?: number;
}
export declare const MenuItem: import("mongoose").Model<IMenuItem, {}, {}, {}, Document<unknown, {}, IMenuItem, {}, {}> & IMenuItem & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=item.model.d.ts.map