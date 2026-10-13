import useScrollCarousel from "../../animations/useScrollCarousel";
import StarIcon from "../../assets/img/home/9d002.svg";
import Chevron from "../../assets/img/home/d3c18.svg";
import CircleOne from "../../assets/img/home/t-e27ce.svg";
import CircleTwo from "../../assets/img/home/t-33149.svg";
import CircleThree from "../../assets/img/home/t-6a8f8.svg";
import CardTexture from "../../assets/img/home/t-0820c.png";
import { reviews, formatRating } from "../../data/reviews";

// Card art and layout follow Figma "Component 50" (node 4807:8894): a 703x424 active card
// flanked by the same card at 0.8 scale, 694px apart.
const START_INDEX = Math.min(2, reviews.length - 1);

const slideState = (slideIndex, activeIndex) => {
  if (slideIndex === activeIndex) return "is-active";
  return slideIndex < activeIndex ? "is-before" : "is-after";
};

const CardArt = () => (
  <span className="ht-card-art" aria-hidden="true">
    <span className="ht-circle-3"><span><img src={CircleThree} alt="" draggable="false" /></span></span>
    <span className="ht-circle-2"><img src={CircleTwo} alt="" draggable="false" /></span>
    <span className="ht-circle-1"><img src={CircleOne} alt="" draggable="false" /></span>
    <img className="ht-card-texture" src={CardTexture} alt="" draggable="false" />
  </span>
);

const HomeTestimonials = () => {
  const { viewportRef, index, controlIndex, settledIndex, isDragging, step } = useScrollCarousel({ align: "center", startIndex: START_INDEX });

  return (
    <section className="ht-testimonials" aria-labelledby="ht-testimonials-title">
      <h2 id="ht-testimonials-title" data-reveal>What Our Clients say</h2>
      <p className="ht-intro">Real stories from the brands and people we’ve helped grow, design, and stand out</p>
      <div className={`ht-carousel${isDragging ? " is-dragging" : ""}`} aria-roledescription="carousel" aria-label="Client testimonials">
        <div ref={viewportRef} className="carousel-viewport" tabIndex={0} role="group" aria-label="Testimonials. Swipe, drag, or use the left and right arrow keys to browse.">
          <div className="carousel-track">
            {reviews.map((review, reviewIndex) => (
              <article
                key={reviewIndex}
                className={`carousel-slide ${slideState(reviewIndex, index)}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${reviewIndex + 1} of ${reviews.length}: Upwork client review`}
              >
                <div className="ht-card">
                  <CardArt />
                  <div className="ht-stars" role="img" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: Math.round(review.rating) }, (_, star) => (
                      <img key={star} src={StarIcon} alt="" draggable="false" />
                    ))}
                  </div>
                  <p className="ht-meta">{review.date} · Upwork · {formatRating(review.rating)}/5</p>
                  <blockquote className="ht-quote"><p>{review.quote}</p></blockquote>
                  <p className="ht-category">{review.category}</p>
                  <a href={review.url} className="ht-source" target="_blank" rel="noopener noreferrer" aria-label="Read this review on Upwork">↗</a>
                </div>
              </article>
            ))}
          </div>
        </div>
        <button type="button" className="ht-prev" aria-label="Previous testimonial" disabled={controlIndex === 0} onClick={() => step(-1)}>
          <img src={Chevron} alt="" draggable="false" />
        </button>
        <button type="button" className="ht-next" aria-label="Next testimonial" disabled={controlIndex === reviews.length - 1} onClick={() => step(1)}>
          <img src={Chevron} alt="" draggable="false" />
        </button>
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">{`Client testimonials: ${settledIndex + 1} of ${reviews.length}`}</p>
      </div>
    </section>
  );
};

export default HomeTestimonials;
