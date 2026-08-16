import { GalleryPageData } from "@/types";
import { galleryService } from "@/lib/api/gallery.service";

export async function getGalleryPageData(): Promise<GalleryPageData> {
  return galleryService.getPageData();
}

export async function getGalleryItems() {
  return galleryService.images.getAll() as unknown as any[];
}
