// Single source of truth for testimonials/reviews: src/data/reviews.json.
// Every component that shows a review, rating, review count, or Upwork
// profile link should import from here rather than hardcoding values.
import reviewData from "./reviews.json";

export const upworkProfiles = reviewData.upworkProfiles;

export const reviews = reviewData.reviews.map((review) => ({
  ...review,
  rating: review.rating ?? 5,
  upwork: review.source === "upwork",
  url: review.url || upworkProfiles[review.profile],
}));

export const freelancerReviews = reviews.filter((review) => review.profile === "freelancer");
export const agencyReviews = reviews.filter((review) => review.profile === "agency");

const average = (list) => (list.length ? list.reduce((sum, review) => sum + review.rating, 0) / list.length : 0);

export const reviewStats = {
  count: reviews.length,
  averageRating: average(reviews),
  freelancerCount: freelancerReviews.length,
  freelancerAverageRating: average(freelancerReviews),
};

export const formatRating = (rating) => rating.toFixed(1);
