import { Schema, model, Document, Types } from 'mongoose';

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

const cateringRequestSchema = new Schema<ICateringRequest>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', index: true, default: undefined },
    event_type: {
      type: String,
      enum: ['corporate', 'birthday', 'wedding', 'bulk-order'],
      required: true,
      index: true,
    },
    guest_count: { type: Number, required: true, min: 10 },
    event_date: { type: String, required: true, index: true },
    event_time: { type: String, required: true, default: '19:00' },
    package_tier: {
      type: String,
      enum: ['classic-grill', 'royal-bbq-feast', 'pitmaster-live-station', 'custom'],
      default: 'royal-bbq-feast',
    },
    selected_items: [{ type: String }],
    contact_name: { type: String, required: true, trim: true },
    contact_email: { type: String, required: true, lowercase: true, trim: true },
    contact_phone: { type: String, required: true, trim: true },
    event_location: { type: String, required: true, trim: true },
    special_instructions: { type: String, default: '' },
    estimated_total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['inquiry', 'under-review', 'confirmed', 'completed', 'cancelled'],
      default: 'inquiry',
      index: true,
    },
    is_live_tandoor_requested: { type: Boolean, default: false },
    coordinator_notes: { type: String, default: '' },
  },
  { timestamps: true }
);

cateringRequestSchema.index({ event_date: 1, status: 1 });
cateringRequestSchema.index({ user_id: 1, createdAt: -1 });

export const CateringRequest = model<ICateringRequest>('CateringRequest', cateringRequestSchema);
