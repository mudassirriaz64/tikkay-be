import { CustomerReview, ReviewsPageData } from "@/types";
import { reviewsService } from "@/lib/api/reviews.service";
import { tryOrFallback } from "@/lib/api/client";
import { db } from "./defaults";

export async function getReviews(): Promise<CustomerReview[]> {
  return tryOrFallback(
    async () => reviewsService.getApproved(),
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return db.reviews.reviews;
    },
  );
}

export async function getReviewsPageData(): Promise<ReviewsPageData> {
  return tryOrFallback(
    async () => reviewsService.getPageData(),
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return db.reviews;
    },
  );
}
