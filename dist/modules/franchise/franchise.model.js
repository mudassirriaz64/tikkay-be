import { Schema, model } from 'mongoose';
const franchiseInquirySchema = new Schema({
    full_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    target_city: { type: String, required: true, trim: true },
    proposed_location: { type: String, default: '' },
    investment_budget: { type: String, required: true },
    experience_summary: { type: String, default: '' },
    timeline: { type: String, required: true, default: '1-3 months' },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'contacted', 'approved', 'rejected'],
        default: 'pending',
        index: true,
    },
    notes: { type: String, default: '' },
}, { timestamps: true });
franchiseInquirySchema.index({ createdAt: -1 });
export const FranchiseInquiry = model('FranchiseInquiry', franchiseInquirySchema);
//# sourceMappingURL=franchise.model.js.map