import useScrollCarousel from "../../animations/useScrollCarousel";
import StarIcon from "../../assets/img/home/9d002.svg";
import PrevArrow from "../../assets/img/home/d3c18.svg";
import NextArrow from "../../assets/img/home/899df.svg";
import SameerPortrait from "../../assets/img/home/6abc5.png";
import AnjaliPortrait from "../../assets/img/home/b4507.png";

const UPWORK_PROFILE = "https://www.upwork.com/freelancers/rajnandan";

const reviews = [
  {
    name: "Sameer",
    role: "CEO, Zenith Wellness",
    portrait: SameerPortrait,
    quote: "From brand design to web development and video production, they excel at everything. It’s rare to find a single agency that delivers such high quality across the board. They are our go-to creative partner.",
  },
  {
    upwork: true,
    quote: "We hired Strix Production for few Web-Design projects and it was great working with them. The team's commitment to timely delivery and high quality makes him stand different from others. Everyone in the team is a thorough gentleman and professional to work with!",
  },
  {
    name: "Anjali",
    role: "Project Lead, FinSecure Logistics",
    portrait: AnjaliPortrait,
    quote: "We had a highly complex web portal project. Their development team delivered a robust, secure, and elegant solution that has drastically improved our efficiency. True technical experts.",
  },
];

const START_INDEX = 1;
const reviewLabel = (review) => (review.upwork ? "Upwork client review" : review.name);

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
                    <p className="hl-review-category">{review.upwork ? "Web design" : "Client perspective"}</p>
                    {review.upwork && (
                      <div className="hl-review-rating">
                        <div className="hl-review-stars" aria-label="5 out of 5 stars">
                          {[0, 1, 2, 3, 4].map((star) => (
                            <span key={star} className="hl-review-star" aria-hidden="true"><span><img src={StarIcon} alt="" draggable="false" /></span></span>
                          ))}
                        </div>
                        <span className="hl-review-rating-value" aria-hidden="true">5.0 / 5</span>
                      </div>
                    )}
                  </div>
                  <blockquote className="hl-review-quote">{review.quote}</blockquote>
                  <div className="hl-review-footer">
                    {review.upwork ? (
                      <>
                        <div className="hl-review-attribution"><p>Upwork client</p><span>7 February 2026</span></div>
                        <a href={UPWORK_PROFILE} className="hl-review-source" target="_blank" rel="noopener noreferrer">
                          Read on Upwork <span aria-hidden="true">↗</span>
                        </a>
                      </>
                    ) : (
                      <div className="hl-review-author">
                        <img className="hl-review-portrait" src={review.portrait} alt="" loading="lazy" draggable="false" />
                        <div className="hl-review-attribution"><p>{review.name}</p><span>{review.role}</span></div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="hl-review-controls">
          <button type="button" className="hl-review-prev" aria-label="Previous testimonial" disabled={controlIndex === 0} onClick={() => step(-1)}>
            <span aria-hidden="true"><img src={PrevArrow} alt="" draggable="false" /></span>
          </button>
          <div className="hl-review-dots" role="group" aria-label="Choose a testimonial">
            {reviews.map((review, reviewIndex) => (
              <button
                key={reviewIndex}
                type="button"
                aria-label={`Show ${review.upwork ? "Upwork client review" : `${review.name}’s review`}`}
                aria-current={reviewIndex === index ? "true" : undefined}
                onClick={() => go(reviewIndex)}
              >
                <span />
              </button>
            ))}
          </div>
          <button type="button" className="hl-review-next" aria-label="Next testimonial" disabled={controlIndex === reviews.length - 1} onClick={() => step(1)}>
            <span aria-hidden="true"><img src={NextArrow} alt="" draggable="false" /></span>
          </button>
        </div>
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">{`Client testimonials: ${settledIndex + 1} of ${reviews.length}`}</p>
      </div>
    </section>
  );
};

export default HomeTestimonials;
