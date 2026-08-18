import { Document } from 'mongoose';
export interface IPlatterOption {
    id: string;
    name: string;
    price: number;
}
export interface IMenuPageConfig extends Document<string> {
    tabs: {
        id: string;
        label: string;
        sectionId: string;
    }[];
    platter: {
        baseLabel: string;
        basePrice: number;
        imageUrl: string;
        image_public_id?: string;
        meats: IPlatterOption[];
        sides: IPlatterOption[];
    };
    boti_featured_item_id?: string;
    boti_compact_ids: string[];
}
export declare const MenuPageConfig: import("mongoose").Model<IMenuPageConfig, {}, {}, {}, Document<unknown, {}, IMenuPageConfig, {}, {}> & IMenuPageConfig & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=pageConfig.model.d.ts.map