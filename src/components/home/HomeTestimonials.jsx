import useScrollCarousel from "../../animations/useScrollCarousel";
import StarIcon from "../../assets/img/home/9d002.svg";
import PrevArrow from "../../assets/img/home/d3c18.svg";
import NextArrow from "../../assets/img/home/899df.svg";
import reviewData from "../../data/reviews.json";

const reviews = reviewData.reviews.map((review) => ({
  ...review,
  upwork: review.source === "upwork",
  url: review.url || reviewData.upworkProfiles[review.profile],
}));

const START_INDEX = Math.min(2, reviews.length - 1);
const reviewLabel = (review) => ("Upwork client review");

const slideState = (slideIndex, activeIndex) => {
  if (slideIndex === activeIndex) return "is-active";
  return slideIndex < activeIndex ? "is-before" : "is-after";
};

const HomeTestimonials = () => {
  const { viewportRef, index, controlIndex, settledIndex, isDragging, go, step } = useScrollCarousel({ align: "center", startIndex: START_INDEX });

  return (
    <section className="hl-testimonials" aria-labelledby="hl-testimonials-title">
      <h2 id="hl-testimonials-title" data-reveal>What Our Clients say</h2>
      <p className="hl-testimonials-intro">Real stories from the brands and people we’ve helped grow, design, and stand out</p>
      <div className={`hl-review-carousel${isDragging ? " is-dragging" : ""}`} aria-roledescription="carousel" aria-label="Client testimonials">
        <div ref={viewportRef} className="carousel-viewport" tabIndex={0} role="group" aria-label="Testimonials. Swipe, drag, or use the left and right arrow keys to browse.">
          <div className="carousel-track">
            {reviews.map((review, reviewIndex) => (
              <article
                key={reviewIndex}
                className={`carousel-slide ${slideState(reviewIndex, index)}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${reviewIndex + 1} of ${reviews.length}: ${reviewLabel(review)}`}
              >
                <div className={`hl-review-visual ${review.upwork ? "hl-review-upwork" : "hl-review-person"}`}>
                  <div className="hl-review-topline">
                    <p className="hl-review-category">{review.upwork ? review.category || "Upwork review" : "Client perspective"}</p>
                    {review.upwork && (
                      <div className="hl-review-rating">
                        <div className="hl-review-stars" aria-label={`${review.rating ?? 5} out of 5 stars`}>
                          {Array.from({ length: Math.round(review.rating ?? 5) }, (_, star) => star).map((star) => (
                            <span key={star} className="hl-review-star" aria-hidden="true"><span><img src={StarIcon} alt="" draggable="false" /></span></span>
                          ))}
                        </div>
                        <span className="hl-review-rating-value" aria-hidden="true">{(review.rating ?? 5).toFixed(1)} / 5</span>
                      </div>
                    )}
                  </div>
                  <blockquote className="hl-review-quote">{review.quote}</blockquote>
                  <div className="hl-review-footer">
                    {review.upwork ? (
                      <>
                        <div className="hl-review-attribution"><p>Upwork client</p><span>{review.date}</span></div>
                        <a href={review.url} className="hl-review-source" target="_blank" rel="noopener noreferrer">
                          Read on Upwork <span aria-hidden="true">↗</span>
                        </a>
                      </>
                    ) : (
                      <div className="hl-review-author">
                        <div className="hl-review-attribution"><p>Upwork client</p></div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="hl-review-controls">
          <button type="button" className="hl-review-prev ui-btn-icon-only" aria-label="Previous testimonial" disabled={controlIndex === 0} onClick={() => step(-1)}>
            <span aria-hidden="true"><img src={PrevArrow} alt="" draggable="false" /></span>
          </button>
          <div className="hl-review-dots" role="group" aria-label="Choose a testimonial">
            {reviews.map((review, reviewIndex) => (
              <button
                key={reviewIndex}
                type="button"
                aria-label={"Show Upwork client review"}
                aria-current={reviewIndex === index ? "true" : undefined}
                onClick={() => go(reviewIndex)}
              >
                <span />
              </button>
            ))}
          </div>
          <button type="button" className="hl-review-next ui-btn-icon-only" aria-label="Next testimonial" disabled={controlIndex === reviews.length - 1} onClick={() => step(1)}>
            <span aria-hidden="true"><img src={NextArrow} alt="" draggable="false" /></span>
          </button>
        </div>
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">{`Client testimonials: ${settledIndex + 1} of ${reviews.length}`}</p>
      </div>
    </section>
  );
};

export default HomeTestimonials;
