import { CustomerReview } from "@/types";

export const mockReviews: CustomerReview[] = [
  {
    id: "rev-1",
    customer_name: "Ali H.",
    rating: 5,
    review_text:
      "The grill taste is unreal. The spice lands clean, and the texture stays juicy from first bite to last.",
    source: "Google",
    is_approved: true,
  },
  {
    id: "rev-2",
    customer_name: "Sara M.",
    rating: 5,
    review_text:
      "We ordered the platter for family dinner and every item felt like its own highlight.",
    source: "Instagram",
    is_approved: true,
  },
  {
    id: "rev-3",
    customer_name: "Usman T.",
    rating: 4,
    review_text:
      "Fast, fresh, and honestly better than I expected from a first visit.",
    source: "Direct",
    is_approved: true,
  },
  {
    id: "rev-4",
    customer_name: "Fatima R.",
    rating: 5,
    review_text:
      "The food tastes handcrafted. You can tell the team cares about every detail.",
    source: "Google",
    is_approved: true,
  },
];
