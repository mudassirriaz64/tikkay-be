import { Schema, model, Document } from 'mongoose';

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

const franchiseInquirySchema = new Schema<IFranchiseInquiry>(
  {
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
  },
  { timestamps: true }
);

franchiseInquirySchema.index({ createdAt: -1 });

export const FranchiseInquiry = model<IFranchiseInquiry>('FranchiseInquiry', franchiseInquirySchema);
