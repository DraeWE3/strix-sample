import { useState } from "react";
import { Link } from "react-router-dom";
import useScrollCarousel from "../../animations/useScrollCarousel";
import Button from "../Button";
import { useProjects, projectHref, isExternalProject, projectsKey } from "../../lib/projects";
import { getOptimizedImage } from "../../lib/cloudinary";
import { CATEGORIES, filterProjects } from "../projects/projectFilters";
import DomeMask from "../../assets/img/home/481b8.svg";
import DesktopMask from "../../assets/img/services/5ffcd.svg";
import DesktopGlow from "../../assets/img/home/485ae.svg";
import DesktopRim from "../../assets/img/home/0479a.svg";
import LaptopGlow from "../../assets/img/home/0b74f.svg";
import LaptopRim from "../../assets/img/home/d97d8.svg";
import WebsiteMask from "../../assets/img/services/8146e.svg";
import WebsiteGlow from "../../assets/img/home/a2c5c.svg";
import WebsiteRim from "../../assets/img/home/df9e5.svg";
import PrevArrow from "../../assets/img/home/69e64.svg";
import NextArrow from "../../assets/img/home/b5b40.svg";

const FRAMES = [
  { mask: DesktopMask, glow: DesktopGlow, rim: DesktopRim },
  { mask: DesktopMask, glow: LaptopGlow, rim: LaptopRim },
  { mask: WebsiteMask, glow: WebsiteGlow, rim: WebsiteRim, center: true },
];

const frameFor = (index) => FRAMES[index % FRAMES.length];

const slideState = (slideIndex, activeIndex) => {
  if (slideIndex === activeIndex) return "is-active";
  return slideIndex < activeIndex ? "is-before" : "is-after";
};

const SlideLink = ({ project, children, ...rest }) => {
  const href = projectHref(project);
  if (isExternalProject(project)) {
    return <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>;
  }
  return <Link to={href} {...rest}>{children}</Link>;
};

const PortfolioCarousel = ({ items, startIndex }) => {
  const { viewportRef, index, controlIndex, settledIndex, isDragging, step } = useScrollCarousel({ align: "center", startIndex });

  return (
    <div className={`hl-portfolio-carousel${isDragging ? " is-dragging" : ""}`} aria-roledescription="carousel" aria-label="Selected portfolio projects">
      <div ref={viewportRef} className="carousel-viewport" tabIndex={0} role="group" aria-label="Portfolio. Swipe, drag, or use the left and right arrow keys to browse.">
        <div className="carousel-track">
          {items.map((project, itemIndex) => {
            const frame = frameFor(itemIndex);
            return (
              <article
                key={project.id}
                className={`carousel-slide ${slideState(itemIndex, index)}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${itemIndex + 1} of ${items.length}: ${project.title}`}
              >
                <SlideLink project={project} className="hl-portfolio-visual" aria-label={`Explore ${project.title}`} draggable="false">
                  <span className={`hl-portfolio-native${frame.center ? " hl-portfolio-native-center" : ""}`} style={{ "--hl-card-mask": `url("${frame.mask}")` }}>
                    <span className="hl-portfolio-glow" aria-hidden="true"><img src={frame.glow} alt="" draggable="false" /></span>
                    <span className="hl-portfolio-media">
                      <img src={getOptimizedImage(project.image)} alt={project.title} loading="lazy" draggable="false" />
                    </span>
                    <span className="hl-portfolio-rim" aria-hidden="true"><img src={frame.rim} alt="" draggable="false" /></span>
                  </span>
                </SlideLink>
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
  const { projects, loading, error } = useProjects();
  const items = filterProjects(projects, { category, type: "" });

  let status = "";
  if (loading) status = "Loading projects...";
  else if (error) status = "Projects could not be loaded right now.";
  else if (!items.length) status = projects.length ? `Explore our full portfolio for ${category.toLowerCase()} projects.` : "No projects published yet.";

  return (
    <section className="hl-portfolio" id="portfolio" aria-labelledby="hl-portfolio-title">
      <div className="hl-portfolio-atmosphere" aria-hidden="true">
        <div className="hl-portfolio-light" />
        <div className="hl-portfolio-dome" style={{ maskImage: `url("${DomeMask}")`, WebkitMaskImage: `url("${DomeMask}")` }} />
      </div>
      <h2 id="hl-portfolio-title" data-reveal>Our Craft, Your Expression.</h2>
      <div className="hl-portfolio-filters" role="group" aria-label="Filter portfolio">
        {CATEGORIES.map((name) => (
          <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>
        ))}
      </div>
      {status ? (
        <div className="hl-portfolio-carousel" aria-busy={loading}>
          <div className="hl-portfolio-empty" role="status">
            <p>{status}</p>
            <Link to="/works">View all projects ↗</Link>
          </div>
        </div>
      ) : (
        <PortfolioCarousel key={`${category}-${projectsKey(items)}`} items={items} startIndex={Math.min(2, items.length - 1)} />
      )}
      <Button to="/works" arrow className="hl-portfolio-link">Portfolio</Button>
    </section>
  );
};

export default HomePortfolio;
