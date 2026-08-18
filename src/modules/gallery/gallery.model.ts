/// <reference types="node" />
/// <reference types="mongoose" />
import { Schema, model, Document } from 'mongoose';

export type GalleryTabId = 'customers' | 'behind-scenes' | 'journey' | 'gallery';
export type GalleryCategoryId = 'food' | 'grill' | 'customers' | 'atmosphere';
export type JourneyType = 'milestone' | 'achievement' | 'challenge' | 'lesson' | 'future';

export interface IGalleryImage extends Document {
  media_type: 'image' | 'video';
  imageUrl: string;
  image_public_id?: string;
  video_url?: string;
  video_public_id?: string;
  duration?: string;
  caption: string;
  location: string;
  category: GalleryCategoryId;
  alt: string;
  tag?: string;
  display_order: number;
}

export interface IVideoTestimonial extends Document {
  customer_name: string;
  title: string;
  description?: string;
  duration: string;
  thumbnail: string;
  video_url?: string;
  video_public_id?: string;
  source: string;
  source_type: 'embed' | 'upload';
  status: 'ready' | 'processing' | 'failed';
  display_order: number;
}

export interface IInstagramPost extends Document {
  imageUrl: string;
  image_public_id?: string;
  caption: string;
  tag: string;
  likes: number;
  comments: number;
  display_order: number;
}

export interface IGoogleReview extends Document {
  customer_name: string;
  rating: number;
  visit_date: string;
  review_text: string;
  verified: boolean;
  source: string;
  display_order: number;
}

export interface ICustomerStory extends Document {
  customer_name: string;
  imageUrl: string;
  image_public_id?: string;
  favorite_meal: string;
  years_visiting: number;
  visits: number;
  quote: string;
  timeline: {
    year: string;
    label: string;
    note: string;
  }[];
  display_order: number;
}

export interface IKitchenProcess extends Document {
  step: number;
  title: string;
  imageUrl: string;
  image_public_id?: string;
  story: string;
  fact: string;
  time: string;
  display_order: number;
}

export interface IJourneyMilestone extends Document {
  year: string;
  title: string;
  imageUrl: string;
  image_public_id?: string;
  story: string;
  badge: string;
  type: JourneyType;
  stat?: {
    value: number;
    suffix: string;
    label: string;
  };
  display_order: number;
}

export interface IJourneyPost extends Document {
  day_number: number;
  title: string;
  content: string;
  media_type: 'Image' | 'Video';
  media_url: string;
  image_public_id?: string;
  created_at: string;
  display_order: number;
}

export interface IGalleryPageConfig extends Document<string> {
  hero: {
    label: string;
    titleLead: string;
    titleMid: string;
    titleAccent: string;
    description: string;
    imageUrl: string;
  };
  tabs: {
    id: GalleryTabId;
    sectionId: string;
    label: string;
    shortLabel: string;
    title: string;
    description: string;
    icon: 'users' | 'chef-hat' | 'flame' | 'camera';
  }[];
  galleryCategories: {
    id: GalleryCategoryId | 'all';
    label: string;
  }[];
  cta: {
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    imageUrl: string;
  };
}

const galleryImageSchema = new Schema<IGalleryImage>(
  {
    media_type: { type: String, enum: ['image', 'video'], default: 'image' },
    imageUrl: { type: String, required: true },
    image_public_id: { type: String, default: undefined },
    video_url: { type: String, default: undefined },
    video_public_id: { type: String, default: undefined },
    duration: { type: String, default: undefined },
    caption: { type: String, required: true, default: '' },
    location: { type: String, default: '' },
    category: { type: String, enum: ['food', 'grill', 'customers', 'atmosphere'], required: true },
    alt: { type: String, required: true, default: 'Gallery media' },
    tag: { type: String, default: undefined },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const videoTestimonialSchema = new Schema<IVideoTestimonial>(
  {
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
  },
  { timestamps: true }
);

const instagramPostSchema = new Schema<IInstagramPost>(
  {
    imageUrl: { type: String, required: true },
    image_public_id: { type: String, default: undefined },
    caption: { type: String, default: '' },
    tag: { type: String, default: '' },
    likes: { type: Number, default: 0, min: 0 },
    comments: { type: Number, default: 0, min: 0 },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const googleReviewSchema = new Schema<IGoogleReview>(
  {
    customer_name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    visit_date: { type: String, required: true, default: () => new Date().toISOString().split('T')[0] },
    review_text: { type: String, required: true },
    verified: { type: Boolean, default: false },
    source: { type: String, default: 'Google' },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const customerStorySchema = new Schema<ICustomerStory>(
  {
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
  },
  { timestamps: true }
);

const kitchenProcessSchema = new Schema<IKitchenProcess>(
  {
    step: { type: Number, required: true, min: 1 },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true, default: '/images/gallery/default-kitchen.jpg' },
    image_public_id: { type: String, default: undefined },
    story: { type: String, required: true },
    fact: { type: String, default: '' },
    time: { type: String, default: '' },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const journeyMilestoneSchema = new Schema<IJourneyMilestone>(
  {
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
  },
  { timestamps: true }
);

const journeyPostSchema = new Schema<IJourneyPost>(
  {
    day_number: { type: Number, required: true, min: 1 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    media_type: { type: String, enum: ['Image', 'Video'], required: true },
    media_url: { type: String, required: true },
    image_public_id: { type: String, default: undefined },
    created_at: { type: String, default: () => new Date().toISOString() },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const galleryPageConfigSchema = new Schema<IGalleryPageConfig>(
  {
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
  },
  { timestamps: true }
);

export const GalleryImage = model<IGalleryImage>('GalleryImage', galleryImageSchema);
export const VideoTestimonial = model<IVideoTestimonial>('VideoTestimonial', videoTestimonialSchema);
export const InstagramPost = model<IInstagramPost>('InstagramPost', instagramPostSchema);
export const GoogleReview = model<IGoogleReview>('GoogleReview', googleReviewSchema);
export const CustomerStory = model<ICustomerStory>('CustomerStory', customerStorySchema);
export const KitchenProcess = model<IKitchenProcess>('KitchenProcess', kitchenProcessSchema);
export const JourneyMilestone = model<IJourneyMilestone>('JourneyMilestone', journeyMilestoneSchema);
export const JourneyPost = model<IJourneyPost>('JourneyPost', journeyPostSchema);
export const GalleryPageConfig = model<IGalleryPageConfig>('GalleryPageConfig', galleryPageConfigSchema);
