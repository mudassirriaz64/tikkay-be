export type ReviewSource = 'Google' | 'Instagram' | 'Direct';

export interface CustomerReview {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  source: ReviewSource;
  is_approved: boolean;
}
