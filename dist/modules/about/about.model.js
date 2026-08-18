import { Schema, model } from 'mongoose';
export { JourneyPost as JourneyPostModel } from '../gallery/gallery.model';
const founderDetailsSchema = new Schema({
    _id: { type: String },
    portraitUrl: { type: String, required: true, default: '/images/our_legacy.png' },
    portrait_public_id: { type: String, default: undefined },
    quote: { type: String, required: true, default: '' },
    quoteAuthor: { type: String, required: true, default: 'Ahmed Raza' },
    quoteRole: { type: String, required: true, default: 'Founder & Pitmaster' },
    eyebrow: { type: String, required: true, default: 'The Visionary' },
    title: { type: String, required: true, default: 'Meet Ahmed' },
    bio: { type: String, required: true, default: '' },
    caption: { type: String, default: '' },
    mission: { type: String, default: '' },
    vision: { type: String, default: '' },
}, { timestamps: true });
const statItemSchema = new Schema({
    value: { type: String, required: true },
    label: { type: String, required: true },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const milestoneStatSchema = new Schema({
    number: { type: String, required: true },
    label: { type: String, required: true },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const aboutPageConfigSchema = new Schema({
    _id: { type: String },
    hero: {
        label: { type: String, default: 'Our Story' },
        titleLead: { type: String, default: 'Twelve Years of' },
        titleAccent: { type: String, default: 'Fire & Flavor' },
        description: { type: String, default: 'From a backyard grill obsession to Pakistan\'s most-loved BBQ brand — this is how the fire grew.' },
        imageUrl: { type: String, default: '/images/about-hero.jpg' },
        image_public_id: { type: String, default: undefined },
    },
}, { timestamps: true });
export const FounderDetails = model('FounderDetails', founderDetailsSchema);
export const StatItem = model('StatItem', statItemSchema);
export const MilestoneStat = model('MilestoneStat', milestoneStatSchema);
export const AboutPageConfig = model('AboutPageConfig', aboutPageConfigSchema);
//# sourceMappingURL=about.model.js.map