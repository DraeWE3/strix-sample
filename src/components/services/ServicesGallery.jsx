import Button from "../Button";
import { Link } from "react-router-dom";
import useScrollCarousel from "../../animations/useScrollCarousel";
import Arrow from "../../assets/img/shared/e23f5.svg";
import ExploreRim from "../../assets/img/services/97acd.svg";
import ExploreShine from "../../assets/img/services/f3ffd.svg";

const modifierClass = (base, modifier) => (modifier ? `${base} ${base}--${modifier}` : base);

const descStyle = (gallery, card) => {
  const { top, width, size, line, tracking } = { ...gallery, ...card };
  return {
    "--desc-top": top !== undefined ? `${top}px` : undefined,
    "--desc-width": width !== undefined ? `${width}px` : undefined,
    "--desc-size": size !== undefined ? `${size}px` : undefined,
    "--desc-line": line !== undefined ? `${line}px` : undefined,
    "--desc-tracking": tracking !== undefined ? `${tracking}px` : undefined,
  };
};

const ServicesGallery = ({ gallery, onShowreel }) => {
  const { id, title, tagline, desc, cards, tools } = gallery;
  const name = title.toLowerCase();
  const viewportId = `${id}-gallery`;
  const { viewportRef, index, controlIndex, settledIndex, isDragging, go, step } = useScrollCarousel();

  return (
    <section className={`service-section service-section--${id}`} id={id} aria-labelledby={`${id}-title`}>
      <header className="service-section__heading" data-reveal>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{tagline}</p>
      </header>
      <div className={`carousel service-carousel${isDragging ? " is-dragging" : ""}`}>
        <div
          className="carousel-viewport service-carousel__viewport"
          id={viewportId}
          ref={viewportRef}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${title} services. Swipe or use the arrow keys to explore.`}
        >
          <div className="carousel-track service-carousel__track">
            {cards.map((card, cardIndex) => (
              <article
                className={`carousel-slide ${modifierClass("service-card", card.modifier)}`}
                key={card.title}
                role="group"
                aria-roledescription="slide"
                aria-label={`${cardIndex + 1} of ${cards.length}: ${card.title}`}
              >
                <Link className="service-card__art" to={card.href || "/contact"} draggable={false}>
                  <div className="service-card__image">
                    <img src={card.image} alt="" loading="lazy" draggable={false} width="1004" height="503" />
                  </div>
                  <h3>{card.title}</h3>
                  <p style={descStyle(desc, card.desc)}>{card.description}</p>
                </Link>
                <Link className="service-card__explore" to={card.href || "/contact"} draggable={false} tabIndex={-1} aria-hidden="true">
                  <img src={ExploreRim} alt="" draggable={false} />
                  <span className="service-card__explore-shine"><img src={ExploreShine} alt="" draggable={false} /></span>
                  <span>Explore</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
        <button
          className="service-carousel-arrow service-carousel-arrow--prev"
          type="button"
          aria-label={`Previous ${name} service`}
          aria-controls={viewportId}
          disabled={controlIndex === 0}
          onClick={() => step(-1)}
        >
          <img src={Arrow} alt="" width="20.482" height="16.1336" />
        </button>
        <button
          className="service-carousel-arrow service-carousel-arrow--next"
          type="button"
          aria-label={`Next ${name} service`}
          aria-controls={viewportId}
          disabled={controlIndex === cards.length - 1}
          onClick={() => step(1)}
        >
          <img src={Arrow} alt="" width="20.482" height="16.1336" />
        </button>
        <div className="service-carousel__footer">
          <div className="service-tools" role="group" aria-label={`Choose ${name} service`}>
            {tools.map((tool, toolIndex) => (
              <button
                type="button"
                className={`${modifierClass("service-tool", tool.modifier)}${toolIndex === index ? " is-active" : ""}`}
                key={tool.icon}
                aria-label={`Show ${cards[toolIndex].title}`}
                aria-controls={viewportId}
                aria-current={toolIndex === index ? "true" : undefined}
                onClick={() => go(toolIndex)}
              >
                {tool.frame ? (
                  <>
                    <img className="service-tool__video-body" src={tool.icon} alt="" />
                    <img className="service-tool__video-frame" src={tool.frame} alt="" />
                  </>
                ) : (
                  <img src={tool.icon} alt="" />
                )}
              </button>
            ))}
          </div>
          <div className="service-pagination" role="group" aria-label={`${title} slides`}>
            {cards.map((card, dotIndex) => {
              const distance = Math.abs(dotIndex - index);
              const state = distance === 0 ? " is-active" : distance === 1 ? " is-near" : "";
              return (
                <button
                  type="button"
                  className={state.trim() || undefined}
                  key={card.title}
                  aria-label={`Go to ${card.title}`}
                  aria-controls={viewportId}
                  aria-current={distance === 0 ? "true" : undefined}
                  onClick={() => go(dotIndex)}
                />
              );
            })}
          </div>
          <div className="service-actions">
            <Button href="#selected-work">View Work</Button>
            <Button onClick={onShowreel} arrow>Showreel</Button>
          </div>
        </div>
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">
          {`${title}: ${settledIndex + 1} of ${cards.length}`}
        </p>
      </div>
    </section>
  );
};

export default ServicesGallery;
