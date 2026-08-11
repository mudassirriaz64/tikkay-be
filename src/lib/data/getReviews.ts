import { CustomerReview, ReviewsPageData } from "@/types";
import { db } from "./defaults";

export async function getReviews(): Promise<CustomerReview[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return db.reviews.reviews;
}

export async function getReviewsPageData(): Promise<ReviewsPageData> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return db.reviews;
}
