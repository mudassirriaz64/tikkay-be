/// <reference types="node" />
/// <reference types="mongoose" />
import { Schema, model, Document } from 'mongoose';

export interface IPlatterOption {
  id: string;
  name: string;
  price: number;
}

export interface IMenuPageConfig extends Document<string> {
  tabs: {
    id: string;
    label: string;
    sectionId: string;
  }[];
  platter: {
    baseLabel: string;
    basePrice: number;
    imageUrl: string;
    image_public_id?: string;
    meats: IPlatterOption[];
    sides: IPlatterOption[];
  };
  boti_featured_item_id?: string;
  boti_compact_ids: string[];
}

const platterOptionSchema = new Schema<IPlatterOption>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const menuPageConfigSchema = new Schema<IMenuPageConfig>(
  {
    _id: { type: String },
    tabs: {
      type: [
        {
          id: { type: String, required: true },
          label: { type: String, required: true },
          sectionId: { type: String, required: true },
        },
      ],
      default: [
        { id: 'tab-tikka', label: 'Tikka', sectionId: 'tikka' },
        { id: 'tab-boti', label: 'Boti', sectionId: 'boti' },
        { id: 'tab-platters', label: 'Platters', sectionId: 'platters' },
        { id: 'tab-sides', label: 'Sides & Sauces', sectionId: 'sides' },
      ],
    },
    platter: {
      baseLabel: { type: String, default: 'Build Your Platter' },
      basePrice: { type: Number, default: 2500, min: 0 },
      imageUrl: { type: String, default: '/images/menu/platter-biryani.jpg' },
      image_public_id: { type: String, default: undefined },
      meats: {
        type: [platterOptionSchema],
        default: [],
      },
      sides: {
        type: [platterOptionSchema],
        default: [],
      },
    },
    boti_featured_item_id: {
      type: String,
      default: undefined,
    },
    boti_compact_ids: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const MenuPageConfig = model<IMenuPageConfig>('MenuPageConfig', menuPageConfigSchema);
