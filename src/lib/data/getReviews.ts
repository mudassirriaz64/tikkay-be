import { CustomerReview, ReviewsPageData } from "@/types";
import {
  mockGalleryImages,
  mockReviewCategories,
  mockReviewFeatured,
  mockReviewHighlights,
  mockReviews,
  mockReviewStatistics,
  mockReviewsCta,
  mockReviewsHero,
  mockVideoReviews,
} from "../mock/reviews";

export async function getReviews(): Promise<CustomerReview[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockReviews.filter((review) => review.is_approved);
}

export async function getReviewsPageData(): Promise<ReviewsPageData> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    hero: mockReviewsHero,
    statistics: mockReviewStatistics,
    categories: mockReviewCategories,
    featured: mockReviewFeatured,
    highlights: mockReviewHighlights,
    reviews: mockReviews.filter((review) => review.is_approved),
    videos: mockVideoReviews,
    gallery: mockGalleryImages,
    cta: mockReviewsCta,
  };
}
