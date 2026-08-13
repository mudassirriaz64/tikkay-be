/// <reference types="node" />
/// <reference path="../../../types/global.d.ts" />
import { Schema, model, Document, Types } from 'mongoose';

export type SpiceLevel = 'Mild' | 'Medium' | 'Hot' | 'Extra Spicy';
export type MenuRibbon = 'Legendary' | "Chef's Choice";

export interface IMenuItem extends Document {
  category_id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  price: number;
  spice_level: SpiceLevel;
  is_bestseller: boolean;
  is_available: boolean;
  image_url: string;
  ribbon?: MenuRibbon;
  tags?: string[];
  is_signature?: boolean;
  display_section?: 'featured' | 'boti' | 'sides' | 'regular';
  display_order?: number;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'MenuCategory',
      required: [true, 'Category ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Menu item title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Menu item slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    spice_level: {
      type: String,
      enum: ['Mild', 'Medium', 'Hot', 'Extra Spicy'],
      required: [true, 'Spice level is required'],
      default: 'Medium',
    },
    is_bestseller: {
      type: Boolean,
      default: false,
    },
    is_available: {
      type: Boolean,
      default: true,
    },
    image_url: {
      type: String,
      required: [true, 'Image URL is required'],
      default: '/images/menu/default.jpg',
    },
    ribbon: {
      type: String,
      enum: ['Legendary', "Chef's Choice"],
      default: undefined,
    },
    tags: {
      type: [String],
      default: [],
    },
    is_signature: {
      type: Boolean,
      default: false,
    },
    display_section: {
      type: String,
      enum: ['featured', 'boti', 'sides', 'regular'],
      default: 'regular',
    },
    display_order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

menuItemSchema.index({ category_id: 1, display_order: 1 });
menuItemSchema.index({ is_available: 1, is_bestseller: 1 });

export const MenuItem = model<IMenuItem>('MenuItem', menuItemSchema);
