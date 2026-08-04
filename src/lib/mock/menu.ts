import { MenuCategory, MenuItem } from "@/types";

export const mockMenuCategories: MenuCategory[] = [
  { id: "cat-1", name: "Tikka", slug: "tikka", display_order: 1 },
  { id: "cat-2", name: "Boti", slug: "boti", display_order: 2 },
  { id: "cat-3", name: "Platters", slug: "platters", display_order: 3 },
  { id: "cat-4", name: "Sides", slug: "sides", display_order: 4 },
  { id: "cat-5", name: "Drinks", slug: "drinks", display_order: 5 },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: "menu-1",
    category_id: "cat-1",
    title: "Reshmi Boti",
    slug: "classic-chicken-tikka",
    description:
      "Velvety smooth chicken morsels in a rich, cream-kissed marinade.",
    price: 850,
    spice_level: "Mild",
    is_bestseller: true,
    is_available: true,
    image_url: "https://picsum.photos/800/600?random=31",
  },
  {
    id: "menu-2",
    category_id: "cat-2",
    title: "Bharli Tikka",
    slug: "beef-behari-boti",
    description:
      "Smoky, charred, and lacquered with our signature spice blend.",
    price: 1320,
    spice_level: "Hot",
    is_bestseller: true,
    is_available: true,
    image_url: "https://picsum.photos/800/600?random=32",
  },
  {
    id: "menu-3",
    category_id: "cat-3",
    title: "The Grand Feast",
    slug: "the-shikkay-platter",
    description:
      "A crowd-pleasing spread built for generous tables and hungry nights.",
    price: 4500,
    spice_level: "Medium",
    is_bestseller: false,
    is_available: true,
    image_url: "https://picsum.photos/800/600?random=33",
  },
  {
    id: "menu-4",
    category_id: "cat-4",
    title: "Nuktaan Chops",
    slug: "nuktaan-chops",
    description: "Lamb chops finished over coal for a deep, savory edge.",
    price: 1830,
    spice_level: "Extra Spicy",
    is_bestseller: false,
    is_available: true,
    image_url: "https://picsum.photos/800/600?random=34",
  },
];
