export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  tag: string;
}

export const mockGalleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    url: "https://picsum.photos/600/900?random=51",
    alt: "Hand marination with authentic secret spices",
    tag: "Marination",
  },
  {
    id: "gal-2",
    url: "https://picsum.photos/800/500?random=52",
    alt: "Hand-slicing fresh ingredients daily",
    tag: "Prep Work",
  },
  {
    id: "gal-3",
    url: "https://picsum.photos/800/500?random=53",
    alt: "Grilling over red-hot natural charcoal skewers",
    tag: "The Fire",
  },
];
