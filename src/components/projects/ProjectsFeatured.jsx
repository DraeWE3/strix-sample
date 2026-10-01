import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getOptimizedImage } from "../../lib/cloudinary";
import DotIdle from "../../assets/img/projects/8f231.svg";
import DotActive from "../../assets/img/projects/4e3a0.svg";
import CardGlow from "../../assets/img/projects/ccefa.svg";

const FEATURED_COUNT = 5;
const SWIPE_DISTANCE = 45;

const Chevron = ({ direction }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={direction === "prev" ? "M14.5 6 8.5 12l6 6" : "M9.5 6l6 6-6 6"} />
  </svg>
);

const ProjectsFeatured = ({ projects, children }) => {
  const slides = projects.slice(0, FEATURED_COUNT);
  const [activeIndex, setActiveIndex] = useState(2);
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const gesture = useRef(null);
  const suppressClickUntil = useRef(0);
  const [dragging, setDragging] = useState(false);

  const count = slides.length;
  const current = count ? Math.min(activeIndex, count - 1) : 0;
  const slide = slides[current];

  const slideLink = slide && (slide.link || `/case-study/${slide.id}`);

  const showSlide = (index) => setActiveIndex((index + count) % count);

  useEffect(() => {
    const image = imageRef.current;
    if (!image?.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = image.animate([{ opacity: 0.6 }, { opacity: 1 }], { duration: 220, easing: "ease-out" });
    return () => animation.cancel();
  }, [slide?.id]);

  const clearGesture = () => {
    const active = gesture.current;
    if (!active) return;
    gesture.current = null;
    setDragging(false);
    if (cardRef.current?.hasPointerCapture(active.pointerId)) cardRef.current.releasePointerCapture(active.pointerId);
  };

  useEffect(() => {
    window.addEventListener("blur", clearGesture);
    return () => window.removeEventListener("blur", clearGesture);
  }, []);

  const onPointerDown = (event) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    if (event.target.closest("button, input, select, textarea, .featured-copy a")) return;
    gesture.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, horizontal: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    const active = gesture.current;
    if (!active || event.pointerId !== active.pointerId) return;
    const dx = event.clientX - active.x;
    const dy = event.clientY - active.y;
    if (!active.horizontal) {
      if (Math.abs(dy) > 10 && Math.abs(dy) >= Math.abs(dx)) return clearGesture();
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        active.horizontal = true;
        setDragging(true);
      }
    }
  };

  const onPointerUp = (event) => {
    const active = gesture.current;
    if (!active || event.pointerId !== active.pointerId) return;
    const dx = event.clientX - active.x;
    const dy = event.clientY - active.y;
    const horizontal = active.horizontal || (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2);
    clearGesture();
    if (!horizontal) return;
    suppressClickUntil.current = performance.now() + 350;
    if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.2) showSlide(current + (dx < 0 ? 1 : -1));
  };

  const onClickCapture = (event) => {
    if (performance.now() < suppressClickUntil.current && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const onKeyDown = (event) => {
    if (!count || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (!event.target.closest(".featured-card, .featured-direction, #featured-pagination button")) return;
    event.preventDefault();
    showSlide(current + (event.key === "ArrowRight" ? 1 : -1));
  };

  return (
    <section className="featured-projects" id="featured-projects" aria-label="Featured projects" aria-roledescription="carousel" aria-busy={!count} onKeyDown={onKeyDown}>
      <div className="featured-stage">
        <button type="button" className="featured-direction featured-direction--prev" aria-label="Previous featured project" disabled={!count} onClick={() => showSlide(current - 1)}><Chevron direction="prev" /></button>
        <div
          ref={cardRef}
          className={`featured-card${dragging ? " is-dragging" : ""}`}
          tabIndex={0}
          role="group"
          aria-label="Featured project. Use left and right arrow keys to browse."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={clearGesture}
          onLostPointerCapture={clearGesture}
          onDragStart={(event) => event.preventDefault()}
          onClickCapture={onClickCapture}
        >
          {slide && (
            <Link className="featured-card__link" to={slideLink} tabIndex={-1} aria-hidden="true" draggable="false" />
          )}
          {slide && (
            <img
              ref={imageRef}
              className="featured-image"
              src={getOptimizedImage(slide.image)}
              alt={slide.title}
              width="1076"
              height="605"
              fetchPriority="high"
              draggable="false"
            />
          )}
          {!slide && <div className="featured-image featured-image--skeleton" aria-hidden="true" />}
          <div className="featured-copy">
            <p>{slide?.categoryText}</p>
            <p>{slide && <Link to={slideLink}>{slide.title}</Link>}</p>
            <div id="featured-pagination" aria-label="Choose featured project">
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-current={index === current}
                  aria-label={`Show featured project ${index + 1} of ${count}: ${item.title}`}
                  onClick={() => showSlide(index)}
                >
                  <img className="dot-idle" src={DotIdle} alt="" />
                  <img className="dot-active" src={DotActive} alt="" />
                </button>
              ))}
            </div>
          </div>
          <div className="featured-glow" aria-hidden="true"><img src={CardGlow} alt="" /></div>
        </div>
        <button type="button" className="featured-direction featured-direction--next" aria-label="Next featured project" disabled={!count} onClick={() => showSlide(current + 1)}><Chevron direction="next" /></button>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {slide ? `Featured project ${current + 1} of ${count}: ${slide.title}` : ""}
      </p>
      {children}
    </section>
  );
};

export default ProjectsFeatured;
