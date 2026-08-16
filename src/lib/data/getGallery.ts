import { GalleryPageData } from "@/types";
import { GalleryItem } from "../mock/gallery";
import { galleryService } from "@/lib/api/gallery.service";
import { tryOrFallback } from "@/lib/api/client";
import { db } from "./defaults";

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return tryOrFallback(
    async () => galleryService.images.getAll() as unknown as GalleryItem[],
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return db.gallery.galleryItems;
    },
  );
}

export async function getGalleryPageData(): Promise<GalleryPageData> {
  return tryOrFallback(
    async () => galleryService.getPageData(),
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return db.gallery.pageData;
    },
  );
}
