import {
  mockCustomerStories,
  mockGalleryCategories,
  mockGalleryCta,
  mockGalleryHero,
  mockGalleryImages,
  mockGalleryItems,
  mockGoogleReviews,
  mockInstagramPosts,
  mockJourneyMilestones,
  mockKitchenProcesses,
  mockGalleryTabs,
  mockVideoTestimonials,
  GalleryItem,
} from "../mock/gallery";
import { GalleryPageData } from "@/types";

export async function getGalleryItems(): Promise<GalleryItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockGalleryItems;
}

export async function getGalleryPageData(): Promise<GalleryPageData> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    hero: mockGalleryHero,
    tabs: mockGalleryTabs,
    videos: mockVideoTestimonials,
    instagram: mockInstagramPosts,
    googleReviews: mockGoogleReviews,
    stories: mockCustomerStories,
    kitchen: mockKitchenProcesses,
    journey: mockJourneyMilestones,
    gallery: mockGalleryImages,
    galleryCategories: mockGalleryCategories,
    cta: mockGalleryCta,
  };
}
