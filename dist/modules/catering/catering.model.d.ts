import { Document, Types } from 'mongoose';
export type CateringEventType = 'corporate' | 'birthday' | 'wedding' | 'bulk-order';
export type CateringPackageTier = 'classic-grill' | 'royal-bbq-feast' | 'pitmaster-live-station' | 'custom';
export type CateringStatus = 'inquiry' | 'under-review' | 'confirmed' | 'completed' | 'cancelled';
export interface ICateringRequest extends Document {
    user_id?: Types.ObjectId;
    event_type: CateringEventType;
    guest_count: number;
    event_date: string;
    event_time: string;
    package_tier: CateringPackageTier;
    selected_items?: string[];
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    event_location: string;
    special_instructions?: string;
    estimated_total: number;
    status: CateringStatus;
    is_live_tandoor_requested: boolean;
    coordinator_notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CateringRequest: import("mongoose").Model<ICateringRequest, {}, {}, {}, Document<unknown, {}, ICateringRequest, {}, {}> & ICateringRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=catering.model.d.ts.map