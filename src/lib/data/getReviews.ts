import { CustomerReview } from '@/types';
import { mockReviews } from '../mock/reviews';

export async function getReviews(): Promise<CustomerReview[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockReviews;
}
