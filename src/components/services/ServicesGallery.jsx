import { Link } from "react-router-dom";
import useScrollCarousel from "../../animations/useScrollCarousel";
import ExploreRim from "../../assets/img/services/97acd.svg";
import ExploreGlow from "../../assets/img/services/f3ffd.svg";
import ActionRim from "../../assets/img/shared/3e10a.svg";
import ActionGlow from "../../assets/img/shared/51ad2.svg";
import Arrow from "../../assets/img/shared/e23f5.svg";

const modifierClass = (base, modifier) => (modifier ? `${base} ${base}--${modifier}` : base);

const ServicesGallery = ({ gallery, onShowreel }) => {
  const { id, title, tagline, cards, tools } = gallery;
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
                <div className="service-card__art">
                  <div className="service-card__image">
                    <img src={card.image} alt="" loading="lazy" draggable={false} width="1004" height="503" />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <Link className="service-card__explore" to="/contact" aria-label={`Explore ${card.title} with Strix Production`}>
                  <img className="service-card__explore-rim" src={ExploreRim} alt="" width="97.477" height="33" />
                  <span className="service-card__explore-glow" aria-hidden="true"><img src={ExploreGlow} alt="" /></span>
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
          <div className="service-tools" aria-hidden="true">
            {tools.map((tool) => (
              <span className={modifierClass("service-tool", tool.modifier)} key={tool.icon}>
                {tool.frame ? (
                  <>
                    <img className="service-tool__video-body" src={tool.icon} alt="" />
                    <img className="service-tool__video-frame" src={tool.frame} alt="" />
                  </>
                ) : (
                  <img src={tool.icon} alt="" />
                )}
              </span>
            ))}
          </div>
          <div className="service-carousel__pagination" role="group" aria-label={`Choose ${name} service`}>
            {cards.map((card, cardIndex) => (
              <button
                type="button"
                key={card.title}
                aria-label={`Show ${card.title}`}
                aria-controls={viewportId}
                aria-current={cardIndex === index ? "true" : undefined}
                onClick={() => go(cardIndex)}
              >
                <span></span>
              </button>
            ))}
          </div>
          <div className="service-actions">
            <a className="service-action-button" href="#selected-work">
              <img className="service-action-button__rim" src={ActionRim} alt="" width="213.75" height="65.25" />
              <span className="service-action-button__glow" aria-hidden="true"><img src={ActionGlow} alt="" /></span>
              <span className="service-action-button__label">View Work</span>
            </a>
            <button className="service-action-button" type="button" aria-haspopup="dialog" onClick={onShowreel}>
              <img className="service-action-button__rim" src={ActionRim} alt="" width="213.75" height="65.25" />
              <span className="service-action-button__glow" aria-hidden="true"><img src={ActionGlow} alt="" /></span>
              <span className="service-action-button__label">
                Showreel
                <img className="service-action-button__arrow" src={Arrow} alt="" width="20.482" height="16.1336" />
              </span>
            </button>
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
