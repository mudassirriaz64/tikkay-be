/// <reference types="node" />
/// <reference types="mongoose" />
import { Schema, model, Document } from 'mongoose';

export interface IMenuCategory extends Document {
  name: string;
  slug: string;
  display_order: number;
}

const menuCategorySchema = new Schema<IMenuCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    display_order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const MenuCategory = model<IMenuCategory>('MenuCategory', menuCategorySchema);
