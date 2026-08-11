import { GalleryPageData } from "@/types";
import { GalleryItem } from "../mock/gallery";
import { db } from "./defaults";

export async function getGalleryItems(): Promise<GalleryItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return db.gallery.galleryItems;
}

export async function getGalleryPageData(): Promise<GalleryPageData> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return db.gallery.pageData;
}
