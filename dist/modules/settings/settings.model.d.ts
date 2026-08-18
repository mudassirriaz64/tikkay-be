import { Document } from 'mongoose';
export interface ISiteSettings extends Document<string> {
    hero_title: string;
    hero_subtitle: string;
    hero_media_url: string;
    hero_media_public_id?: string;
    live_cam_active: boolean;
    fresh_batch_count: number;
    updated_at: string;
}
export declare const SiteSettings: import("mongoose").Model<ISiteSettings, {}, {}, {}, Document<unknown, {}, ISiteSettings, {}, {}> & ISiteSettings & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=settings.model.d.ts.map