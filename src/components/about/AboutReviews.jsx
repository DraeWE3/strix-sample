import StarIcon from "../../assets/img/about/36223.svg";
import ReviewStarIcon from "../../assets/img/about/3e994.svg";
import { freelancerReviews, upworkProfiles, reviewStats, formatRating } from "../../data/reviews";

const FEATURED_COUNT = 2;
const featured = freelancerReviews.slice(0, FEATURED_COUNT);
const Stars = ({ icon, rating }) => (
  <span className="about-rating-stars" role="img" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: Math.round(rating) }).map((_, i) => (
      <img key={i} src={icon} alt="" />
    ))}
  </span>
);

const AboutReviews = () => {
  if (!featured.length) return null;
  const { freelancerCount, freelancerAverageRating } = reviewStats;

  return (
    <section className="about-content-width about-reviews" aria-labelledby="about-reviews-heading">
      <p className="about-lower-eyebrow" data-reveal>CLIENT FEEDBACK / UPWORK</p>
      <div className="about-reviews-content">
        <h2 id="about-reviews-heading" data-reveal>What leaders think about us</h2>
        <div className="about-review-source" data-reveal>
          <div className="about-review-aggregate">
            <Stars icon={StarIcon} rating={freelancerAverageRating} />
            <p>{formatRating(freelancerAverageRating)} / 5.0 of {freelancerCount} reviews</p>
          </div>
          <a href={upworkProfiles.freelancer} target="_blank" rel="noopener noreferrer">
            Selected reviews from Rajnandan&rsquo;s Upwork profile &#8599;
          </a>
        </div>
        <div className="about-review-grid">
          {featured.map((review) => (
            <a
              key={`${review.category}-${review.date}`}
              className="about-review-card"
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
            >
              <Stars icon={ReviewStarIcon} rating={review.rating} />
              <blockquote>&ldquo;{review.quote}&rdquo;</blockquote>
              <p className="about-review-project">{review.category}</p>
              <p className="about-review-date">{review.date} &middot; Upwork &middot; {formatRating(review.rating)}/5</p>
              <span className="about-review-arrow" aria-hidden="true">&#8599;</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutReviews;
