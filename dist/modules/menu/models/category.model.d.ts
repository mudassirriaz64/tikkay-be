import { Document } from 'mongoose';
export interface IMenuCategory extends Document {
    name: string;
    slug: string;
    subtitle?: string;
    display_order: number;
}
export declare const MenuCategory: import("mongoose").Model<IMenuCategory, {}, {}, {}, Document<unknown, {}, IMenuCategory, {}, {}> & IMenuCategory & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=category.model.d.ts.map