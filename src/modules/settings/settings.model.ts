/// <reference types="node" />
/// <reference path="../../types/global.d.ts" />
import { Schema, model, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  hero_title: string;
  hero_subtitle: string;
  hero_media_url: string;
  live_cam_active: boolean;
  fresh_batch_count: number;
  updated_at: string;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    hero_title: {
      type: String,
      required: [true, 'Hero title is required'],
      trim: true,
      default: 'Fire-Grilled. Fresh Daily. Made With Pride.',
    },
    hero_subtitle: {
      type: String,
      required: [true, 'Hero subtitle is required'],
      trim: true,
      default: 'Experience the raw, untamed flavor of Pakistani street BBQ.',
    },
    hero_media_url: {
      type: String,
      required: [true, 'Hero media URL is required'],
      default: '/images/hero_image.png',
    },
    live_cam_active: {
      type: Boolean,
      default: false,
    },
    fresh_batch_count: {
      type: Number,
      default: 0,
      min: [0, 'Fresh batch count cannot be negative'],
    },
    updated_at: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const SiteSettings = model<ISiteSettings>('SiteSettings', siteSettingsSchema);
