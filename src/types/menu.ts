export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export type SpiceLevel = 'Mild' | 'Medium' | 'Hot' | 'Extra Spicy';

export interface MenuItem {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  spice_level: SpiceLevel;
  is_bestseller: boolean;
  is_available: boolean;
  image_url: string;
}
