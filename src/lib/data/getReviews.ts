import { CustomerReview, ReviewsPageData } from "@/types";
import { reviewsService } from "@/lib/api/reviews.service";

export async function getReviews(): Promise<CustomerReview[]> {
  return reviewsService.getApproved();
}

export async function getReviewsPageData(): Promise<ReviewsPageData> {
  return reviewsService.getPageData();
}
