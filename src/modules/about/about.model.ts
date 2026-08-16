import { Schema, model, Document } from 'mongoose';
export type MediaType = 'Image' | 'Video';
export type { IJourneyPost } from '../gallery/gallery.model';
export { JourneyPost as JourneyPostModel } from '../gallery/gallery.model';

export interface IFounderDetails extends Document {
  portraitUrl: string;
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
  eyebrow: string;
  title: string;
  bio: string;
  caption: string;
  mission: string;
  vision: string;
}

export interface IStatItem extends Document {
  value: string;
  label: string;
  display_order: number;
}

export interface IMilestoneStat extends Document {
  number: string;
  label: string;
  display_order: number;
}

export interface IAboutPageConfig extends Document {
  hero: {
    label: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    imageUrl: string;
  };
}

const founderDetailsSchema = new Schema<IFounderDetails>(
  {
    portraitUrl: { type: String, required: true, default: '/images/our_legacy.png' },
    quote: { type: String, required: true, default: '' },
    quoteAuthor: { type: String, required: true, default: 'Ahmed Raza' },
    quoteRole: { type: String, required: true, default: 'Founder & Pitmaster' },
    eyebrow: { type: String, required: true, default: 'The Visionary' },
    title: { type: String, required: true, default: 'Meet Ahmed' },
    bio: { type: String, required: true, default: '' },
    caption: { type: String, default: '' },
    mission: { type: String, default: '' },
    vision: { type: String, default: '' },
  },
  { timestamps: true }
);

const statItemSchema = new Schema<IStatItem>(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const milestoneStatSchema = new Schema<IMilestoneStat>(
  {
    number: { type: String, required: true },
    label: { type: String, required: true },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const aboutPageConfigSchema = new Schema<IAboutPageConfig>(
  {
    hero: {
      label: { type: String, default: 'Our Story' },
      titleLead: { type: String, default: 'Twelve Years of' },
      titleAccent: { type: String, default: 'Fire & Flavor' },
      description: { type: String, default: 'From a backyard grill obsession to Pakistan\'s most-loved BBQ brand — this is how the fire grew.' },
      imageUrl: { type: String, default: '/images/about-hero.jpg' },
    },
  },
  { timestamps: true }
);

export const FounderDetails = model<IFounderDetails>('FounderDetails', founderDetailsSchema);
export const StatItem = model<IStatItem>('StatItem', statItemSchema);
export const MilestoneStat = model<IMilestoneStat>('MilestoneStat', milestoneStatSchema);
export const AboutPageConfig = model<IAboutPageConfig>('AboutPageConfig', aboutPageConfigSchema);
