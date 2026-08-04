import { GalleryItem, mockGalleryItems } from '../mock/gallery';

export async function getGalleryItems(): Promise<GalleryItem[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockGalleryItems;
}
