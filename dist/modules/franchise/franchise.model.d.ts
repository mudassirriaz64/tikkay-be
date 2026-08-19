import { Document } from 'mongoose';
export type FranchiseStatus = 'pending' | 'reviewed' | 'contacted' | 'approved' | 'rejected';
export interface IFranchiseInquiry extends Document {
    full_name: string;
    email: string;
    phone: string;
    target_city: string;
    proposed_location?: string;
    investment_budget: string;
    experience_summary?: string;
    timeline: string;
    status: FranchiseStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const FranchiseInquiry: import("mongoose").Model<IFranchiseInquiry, {}, {}, {}, Document<unknown, {}, IFranchiseInquiry, {}, {}> & IFranchiseInquiry & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=franchise.model.d.ts.map