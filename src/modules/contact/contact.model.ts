/// <reference types="node" />
/// <reference types="mongoose" />
import { Schema, model, Document } from 'mongoose';

export type ContactAccent = 'whatsapp' | 'orange' | 'peach' | 'gold';

export interface IContactMethod extends Document {
  icon: 'whatsapp' | 'phone' | 'map-pin';
  accent: ContactAccent;
  title: string;
  value: string;
  helper: string;
  href: string;
  display_order: number;
}

export interface IOpeningDay extends Document {
  day: string;
  hours: string;
  isClosed?: boolean;
  display_order: number;
}

export interface IContactPageConfig extends Document<string> {
  hero: {
    label: string;
    titleLead: string;
    titleAccent: string;
    availability: string;
  };
  map: {
    restaurantName: string;
    description: string;
    address: string;
    mapsUrl: string;
  };
  form: {
    heading: string;
    accent: string;
    description: string;
    responseTime: string;
  };
  catering: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    menuLabel: string;
    quoteLabel: string;
    imageUrl: string;
  };
  franchise: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    placeholder: string;
    notifyLabel: string;
    portalLabel: string;
  };
}

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const contactMethodSchema = new Schema<IContactMethod>(
  {
    icon: { type: String, enum: ['whatsapp', 'phone', 'map-pin'], required: true },
    accent: { type: String, enum: ['whatsapp', 'orange', 'peach', 'gold'], required: true },
    title: { type: String, required: true },
    value: { type: String, required: true },
    helper: { type: String, default: '' },
    href: { type: String, required: true },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const openingDaySchema = new Schema<IOpeningDay>(
  {
    day: { type: String, required: true },
    hours: { type: String, default: '' },
    isClosed: { type: Boolean, default: false },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const contactPageConfigSchema = new Schema<IContactPageConfig>(
  {
    _id: { type: String },
    hero: {
      label: { type: String, default: 'Get In Touch' },
      titleLead: { type: String, default: "Let's Talk" },
      titleAccent: { type: String, default: 'Fire & Spice' },
      availability: { type: String, default: 'We reply within 24 hours' },
    },
    map: {
      restaurantName: { type: String, default: 'Tikkay Shikkay' },
      description: { type: String, default: 'Find us at our flagship location' },
      address: { type: String, default: 'Main Boulevard, Gulberg III, Lahore, Pakistan' },
      mapsUrl: { type: String, default: 'https://maps.google.com' },
    },
    form: {
      heading: { type: String, default: 'Send us a message' },
      accent: { type: String, default: 'orange' },
      description: { type: String, default: 'Got a question, booking, or idea? We are all ears.' },
      responseTime: { type: String, default: 'Response within 24 hours' },
    },
    catering: {
      eyebrow: { type: String, default: 'Catering' },
      titleLead: { type: String, default: 'Big Party? Big' },
      titleAccent: { type: String, default: 'Flavor.' },
      description: { type: String, default: 'Corporate events, weddings, or private gatherings — we cater them all with signature fire and spice.' },
      menuLabel: { type: String, default: 'View Catering Menu' },
      quoteLabel: { type: String, default: 'Request a Custom Quote' },
      imageUrl: { type: String, default: '/images/contact/catering.jpg' },
    },
    franchise: {
      eyebrow: { type: String, default: 'Franchise' },
      title: { type: String, default: 'Own a Tikkay Shikkay' },
      titleAccent: { type: String, default: 'Franchise' },
      description: { type: String, default: 'Bring the fire to your city. We are expanding to passionate partners who take flavor seriously.' },
      placeholder: { type: String, default: 'Enter your email for franchise portal access' },
      notifyLabel: { type: String, default: 'Notify Me' },
      portalLabel: { type: String, default: 'Existing Franchise Portal' },
    },
  },
  { timestamps: true }
);

const contactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false, index: true },
    created_at: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const ContactMethod = model<IContactMethod>('ContactMethod', contactMethodSchema);
export const OpeningDay = model<IOpeningDay>('OpeningDay', openingDaySchema);
export const ContactPageConfig = model<IContactPageConfig>('ContactPageConfig', contactPageConfigSchema);
export const ContactSubmission = model<IContactSubmission>('ContactSubmission', contactSubmissionSchema);
