import { useState } from "react";
import { Link } from "react-router-dom";
import useScrollCarousel from "../../animations/useScrollCarousel";
import Button from "../Button";
import DomeMask from "../../assets/img/home/481b8.svg";
import DesktopImage from "../../assets/img/services/pi1.jpg";
import DesktopMask from "../../assets/img/services/5ffcd.svg";
import DesktopGlow from "../../assets/img/home/485ae.svg";
import DesktopRim from "../../assets/img/home/0479a.svg";
import LaptopImage from "../../assets/img/services/pi2.png";
import LaptopMask from "../../assets/img/services/5ffcd.svg";
import LaptopGlow from "../../assets/img/home/0b74f.svg";
import LaptopRim from "../../assets/img/home/d97d8.svg";
import WebsiteImage from "../../assets/img/services/pi3.png";
import WebsiteMask from "../../assets/img/services/8146e.svg";
import WebsiteGlow from "../../assets/img/home/a2c5c.svg";
import WebsiteRim from "../../assets/img/home/df9e5.svg";
import PrevArrow from "../../assets/img/home/69e64.svg";
import NextArrow from "../../assets/img/home/b5b40.svg";

const projects = {
  desktop: { image: DesktopImage, mask: DesktopMask, glow: DesktopGlow, rim: DesktopRim, title: "Website design presented on a desktop display" },
  laptop: { image: LaptopImage, mask: LaptopMask, glow: LaptopGlow, rim: LaptopRim, title: "Abhiwan website presented on a laptop" },
  website: { image: WebsiteImage, mask: WebsiteMask, glow: WebsiteGlow, rim: WebsiteRim, title: "Abhiwan website — Where Innovation Meets Immersion", center: true },
};
const categories = ["Branding", "Website", "All", "UI/UX", "Media"];

// Figma only supplies website presentations; other categories point to the full portfolio.
const itemsFor = (category) => {
  if (category === "All") return ["desktop", "laptop", "website", "desktop", "laptop"];
  if (category === "Website" || category === "UI/UX") return ["desktop", "website", "laptop"];
  return [];
};

const slideState = (slideIndex, activeIndex) => {
  if (slideIndex === activeIndex) return "is-active";
  return slideIndex < activeIndex ? "is-before" : "is-after";
};

const PortfolioCarousel = ({ items, startIndex }) => {
  const { viewportRef, index, controlIndex, settledIndex, isDragging, step } = useScrollCarousel({ align: "center", startIndex });

  return (
    <div className={`hl-portfolio-carousel${isDragging ? " is-dragging" : ""}`} aria-roledescription="carousel" aria-label="Selected portfolio projects">
      <div ref={viewportRef} className="carousel-viewport" tabIndex={0} role="group" aria-label="Portfolio. Swipe, drag, or use the left and right arrow keys to browse.">
        <div className="carousel-track">
          {items.map((key, itemIndex) => {
            const project = projects[key];
            return (
              <article
                key={itemIndex}
                className={`carousel-slide ${slideState(itemIndex, index)}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${itemIndex + 1} of ${items.length}: ${project.title}`}
              >
                <Link to="/works" className="hl-portfolio-visual" aria-label={`Explore ${project.title}`} draggable="false">
                  <span className={`hl-portfolio-native${project.center ? " hl-portfolio-native-center" : ""}`} style={{ "--hl-card-mask": `url("${project.mask}")` }}>
                    <span className="hl-portfolio-glow" aria-hidden="true"><img src={project.glow} alt="" draggable="false" /></span>
                    <span className="hl-portfolio-media">
                      <img src={project.image} alt={project.title} className={project.center ? "hl-portfolio-contain" : undefined} loading="lazy" draggable="false" />
                    </span>
                    <span className="hl-portfolio-rim" aria-hidden="true"><img src={project.rim} alt="" draggable="false" /></span>
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
      <button type="button" className="hl-portfolio-prev" aria-label="Previous project" disabled={controlIndex === 0} onClick={() => step(-1)}>
        <img src={PrevArrow} alt="" draggable="false" />
      </button>
      <button type="button" className="hl-portfolio-next" aria-label="Next project" disabled={controlIndex === items.length - 1} onClick={() => step(1)}>
        <img src={NextArrow} alt="" draggable="false" />
      </button>
      <p className="visually-hidden" aria-live="polite" aria-atomic="true">{`Selected portfolio projects: ${settledIndex + 1} of ${items.length}`}</p>
    </div>
  );
};

const HomePortfolio = () => {
  const [category, setCategory] = useState("All");
  const items = itemsFor(category);

  return (
    <section className="hl-portfolio" id="portfolio" aria-labelledby="hl-portfolio-title">
      <div className="hl-portfolio-atmosphere" aria-hidden="true">
        <div className="hl-portfolio-light" />
        <div className="hl-portfolio-dome" style={{ maskImage: `url("${DomeMask}")`, WebkitMaskImage: `url("${DomeMask}")` }} />
      </div>
      <h2 id="hl-portfolio-title" data-reveal>Our Craft, Your Expression.</h2>
      <div className="hl-portfolio-filters" role="group" aria-label="Filter portfolio">
        {categories.map((name) => (
          <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>
        ))}
      </div>
      {items.length ? (
        <PortfolioCarousel key={category} items={items} startIndex={category === "All" ? 2 : 1} />
      ) : (
        <div className="hl-portfolio-carousel">
          <div className="hl-portfolio-empty" role="status">
            <p>Explore our full portfolio for {category.toLowerCase()} projects.</p>
            <Link to="/works">View all projects ↗</Link>
          </div>
        </div>
      )}
      <Button to="/works" arrow className="hl-portfolio-link">Portfolio</Button>
    </section>
  );
};

export default HomePortfolio;
