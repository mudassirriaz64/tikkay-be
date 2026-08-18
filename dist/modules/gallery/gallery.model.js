/// <reference types="node" />
/// <reference types="mongoose" />
import { Schema, model } from 'mongoose';
const galleryImageSchema = new Schema({
    imageUrl: { type: String, required: true },
    image_public_id: { type: String, default: undefined },
    caption: { type: String, required: true, default: '' },
    location: { type: String, default: '' },
    category: { type: String, enum: ['food', 'grill', 'customers', 'atmosphere'], required: true },
    alt: { type: String, required: true, default: 'Gallery image' },
    tag: { type: String, default: undefined },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const videoTestimonialSchema = new Schema({
    customer_name: { type: String, required: true, default: 'Tikkay Shikkay' },
    title: { type: String, required: true },
    description: { type: String, default: undefined },
    duration: { type: String, required: true, default: '0:00' },
    thumbnail: { type: String, required: true, default: '/images/gallery/default-video.jpg' },
    video_url: { type: String, default: undefined },
    video_public_id: { type: String, default: undefined },
    source: { type: String, default: 'Internal' },
    source_type: { type: String, enum: ['embed', 'upload'], default: 'embed' },
    status: { type: String, enum: ['ready', 'processing', 'failed'], default: 'ready' },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const instagramPostSchema = new Schema({
    imageUrl: { type: String, required: true },
    image_public_id: { type: String, default: undefined },
    caption: { type: String, default: '' },
    tag: { type: String, default: '' },
    likes: { type: Number, default: 0, min: 0 },
    comments: { type: Number, default: 0, min: 0 },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const googleReviewSchema = new Schema({
    customer_name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    visit_date: { type: String, required: true, default: () => new Date().toISOString().split('T')[0] },
    review_text: { type: String, required: true },
    verified: { type: Boolean, default: false },
    source: { type: String, default: 'Google' },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const customerStorySchema = new Schema({
    customer_name: { type: String, required: true },
    imageUrl: { type: String, required: true, default: '/images/gallery/default-customer.jpg' },
    image_public_id: { type: String, default: undefined },
    favorite_meal: { type: String, default: '' },
    years_visiting: { type: Number, default: 1, min: 1 },
    visits: { type: Number, default: 1, min: 1 },
    quote: { type: String, required: true },
    timeline: [
        {
            year: { type: String, required: true },
            label: { type: String, required: true },
            note: { type: String, default: '' },
        },
    ],
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const kitchenProcessSchema = new Schema({
    step: { type: Number, required: true, min: 1 },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true, default: '/images/gallery/default-kitchen.jpg' },
    image_public_id: { type: String, default: undefined },
    story: { type: String, required: true },
    fact: { type: String, default: '' },
    time: { type: String, default: '' },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const journeyMilestoneSchema = new Schema({
    year: { type: String, required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true, default: '/images/gallery/default-journey.jpg' },
    image_public_id: { type: String, default: undefined },
    story: { type: String, required: true },
    badge: { type: String, default: '' },
    type: { type: String, enum: ['milestone', 'achievement', 'challenge', 'lesson', 'future'], required: true },
    stat: {
        value: { type: Number, min: 0 },
        suffix: { type: String, default: '' },
        label: { type: String, default: '' },
    },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const journeyPostSchema = new Schema({
    day_number: { type: Number, required: true, min: 1 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    media_type: { type: String, enum: ['Image', 'Video'], required: true },
    media_url: { type: String, required: true },
    image_public_id: { type: String, default: undefined },
    created_at: { type: String, default: () => new Date().toISOString() },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });
const galleryPageConfigSchema = new Schema({
    _id: { type: String },
    hero: {
        label: { type: String, default: 'Gallery' },
        titleLead: { type: String, default: 'A Peek Inside the' },
        titleMid: { type: String, default: 'Flames,' },
        titleAccent: { type: String, default: 'Flavor & Family' },
        description: { type: String, default: 'From our kitchen fires to your tables — every moment, shared.' },
        imageUrl: { type: String, default: '/images/gallery/hero-fire.jpg' },
    },
    tabs: {
        type: [
            {
                id: { type: String, enum: ['customers', 'behind-scenes', 'journey', 'gallery'], required: true },
                sectionId: { type: String, required: true },
                label: { type: String, required: true },
                shortLabel: { type: String, required: true },
                title: { type: String, required: true },
                description: { type: String, required: true },
                icon: { type: String, enum: ['users', 'chef-hat', 'flame', 'camera'], required: true },
            },
        ],
        default: [
            { id: 'customers', sectionId: 'customers', label: 'Customer Stories', shortLabel: 'Customers', title: 'Our Regulars', description: 'The faces that keep our fires lit.', icon: 'users' },
            { id: 'behind-scenes', sectionId: 'behind-scenes', label: 'Behind the Scenes', shortLabel: 'Kitchen', title: 'Our Kitchen', description: 'The alchemy of fire, spice, and craft.', icon: 'chef-hat' },
            { id: 'journey', sectionId: 'journey', label: 'Brand Journey', shortLabel: 'Journey', title: 'The Story So Far', description: 'How the fire spread from a single grill.', icon: 'flame' },
            { id: 'gallery', sectionId: 'gallery', label: 'Photo Gallery', shortLabel: 'Gallery', title: 'Gallery', description: 'Snapshots from the grill-side.', icon: 'camera' },
        ],
    },
    galleryCategories: {
        type: [
            {
                id: { type: String, enum: ['all', 'food', 'grill', 'customers', 'atmosphere'], required: true },
                label: { type: String, required: true },
            },
        ],
        default: [
            { id: 'all', label: 'All Photos' },
            { id: 'food', label: 'Food' },
            { id: 'grill', label: 'Grill' },
            { id: 'customers', label: 'Customers' },
            { id: 'atmosphere', label: 'Atmosphere' },
        ],
    },
    cta: {
        title: { type: String, default: 'Experience It In Person' },
        description: { type: String, default: 'The photos tell half the story. Come taste the fire.' },
        primaryLabel: { type: String, default: 'Book a Table' },
        primaryHref: { type: String, default: '/contact' },
        secondaryLabel: { type: String, default: 'Order Online' },
        secondaryHref: { type: String, default: '/menu' },
        imageUrl: { type: String, default: '/images/gallery/cta-fire.jpg' },
    },
}, { timestamps: true });
export const GalleryImage = model('GalleryImage', galleryImageSchema);
export const VideoTestimonial = model('VideoTestimonial', videoTestimonialSchema);
export const InstagramPost = model('InstagramPost', instagramPostSchema);
export const GoogleReview = model('GoogleReview', googleReviewSchema);
export const CustomerStory = model('CustomerStory', customerStorySchema);
export const KitchenProcess = model('KitchenProcess', kitchenProcessSchema);
export const JourneyMilestone = model('JourneyMilestone', journeyMilestoneSchema);
export const JourneyPost = model('JourneyPost', journeyPostSchema);
export const GalleryPageConfig = model('GalleryPageConfig', galleryPageConfigSchema);
//# sourceMappingURL=gallery.model.js.map