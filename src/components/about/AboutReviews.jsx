import StarIcon from "../../assets/img/about/36223.svg";
import ReviewStarIcon from "../../assets/img/about/3e994.svg";

const REVIEW_TEXT = "Great experience working with Raj, project was delivered flawlessly.";

const AboutReviews = () => {
  return (
    <section className="about-content-width about-reviews" aria-labelledby="about-reviews-heading">
      <p className="about-lower-eyebrow" data-reveal>CLIENT FEEDBACK / UPWORK</p>
      <div className="about-reviews-content">
        <h2 id="about-reviews-heading" data-reveal>What leaders think about us</h2>
        <div className="about-review-source" data-reveal>
          <div className="about-review-aggregate">
            <span className="about-rating-stars" role="img" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <img key={i} src={StarIcon} alt="" />
              ))}
            </span>
            <p>5.0 / 5.0 of 13 reviews</p>
          </div>
          <a href="https://www.upwork.com/freelancers/rajnandan" target="_blank" rel="noopener noreferrer">
            Selected reviews from Rajnandan&rsquo;s Upwork profile &#8599;
          </a>
        </div>
        <div className="about-review-grid">
          {[0, 1].map((i) => (
            <a
              key={i}
              className="about-review-card"
              href="https://www.upwork.com/freelancers/rajnandan"
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
            >
              <span className="about-rating-stars" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, j) => (
                  <img key={j} src={ReviewStarIcon} alt="" />
                ))}
              </span>
              <blockquote>&ldquo;{REVIEW_TEXT}&rdquo;</blockquote>
              <p className="about-review-project">SaaS product development</p>
              <p className="about-review-date">7 February 2026 &middot; Upwork &middot; 5.0/5</p>
              <span className="about-review-arrow" aria-hidden="true">&#8599;</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutReviews;
