import Button from "../Button";
import useScrollCarousel from "../../animations/useScrollCarousel";
import DesktopProject from "../../assets/img/services/pi1.jpg";
import LaptopProject from "../../assets/img/services/pi2.png";
import CenterProject from "../../assets/img/services/pi3.png";
import SideGlow from "../../assets/img/services/485ae.svg";
import DesktopRim from "../../assets/img/services/0479a.svg";
import LaptopRim from "../../assets/img/services/d97d8.svg";
import CenterGlow from "../../assets/img/services/a2c5c.svg";
import CenterRim from "../../assets/img/services/df9e5.svg";
import PortfolioArrow from "../../assets/img/services/69e64.svg";

const WORK_URL = "/works";
const DESKTOP_ALT = "Website design presented on a desktop display";
const LAPTOP_ALT = "Abhiwan website presented on a laptop";

const projects = [
  { label: "website on a desktop display", image: DesktopProject, alt: DESKTOP_ALT, glow: SideGlow, rim: DesktopRim },
  { label: "Abhiwan laptop presentation", image: LaptopProject, alt: LAPTOP_ALT, glow: SideGlow, rim: LaptopRim },
  {
    label: "Abhiwan website",
    image: CenterProject,
    alt: "Abhiwan website with a purple rocket and the headline Where Innovation Meets Immersion",
    glow: CenterGlow,
    rim: CenterRim,
    center: true,
  },
  { label: "website on a desktop display", image: DesktopProject, alt: DESKTOP_ALT, glow: SideGlow, rim: DesktopRim },
  { label: "Abhiwan laptop presentation", image: LaptopProject, alt: LAPTOP_ALT, glow: SideGlow, rim: LaptopRim },
];

const START_INDEX = 2;

const slideState = (slideIndex, activeIndex) => {
  if (slideIndex === activeIndex) return "is-active";
  return slideIndex < activeIndex ? "is-before" : "is-after";
};

export const PortfolioCarousel = () => {
  const { viewportRef, index, controlIndex, settledIndex, isDragging, step } = useScrollCarousel({
    align: "center",
    startIndex: START_INDEX,
  });

  return (
    <div
        className={`portfolio-carousel carousel${isDragging ? " is-dragging" : ""}`}
        aria-roledescription="carousel"
        aria-label="Selected portfolio projects"
      >
        <div
          className="carousel-viewport"
          ref={viewportRef}
          tabIndex={0}
          role="group"
          aria-label="Portfolio. Use left and right arrow keys, swipe, or drag to browse."
        >
          <div className="carousel-track">
            {projects.map((project, projectIndex) => (
              <article
                className={`carousel-slide ${slideState(projectIndex, index)}`}
                key={projectIndex}
                role="group"
                aria-roledescription="slide"
                aria-label={`${projectIndex + 1} of ${projects.length}: ${project.label}`}
              >
                <div className="portfolio-visual">
                  <div className={`portfolio-card-native${project.center ? " portfolio-native-center" : ""}`}>
                    <div className="portfolio-card-glow" aria-hidden="true"><img src={project.glow} alt="" draggable={false} /></div>
                    <div className="portfolio-card-media">
                      <img
                        className={`portfolio-project-image${project.center ? " portfolio-project-contain" : ""}`}
                        src={project.image}
                        alt={project.alt}
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                    <div className="portfolio-card-overlay" aria-hidden="true">
                      <img className="portfolio-card-rim" src={project.rim} alt="" draggable={false} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <button
          className="portfolio-prev"
          type="button"
          aria-label="Previous portfolio project"
          disabled={controlIndex === 0}
          onClick={() => step(-1)}
        >
          <img src={PortfolioArrow} alt="" aria-hidden="true" draggable={false} />
        </button>
        <button
          className="portfolio-next"
          type="button"
          aria-label="Next portfolio project"
          disabled={controlIndex === projects.length - 1}
          onClick={() => step(1)}
        >
          <img src={PortfolioArrow} alt="" aria-hidden="true" draggable={false} />
        </button>
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">
          {`Selected portfolio projects: ${settledIndex + 1} of ${projects.length}`}
        </p>
      </div>
  );
};

const ServicesPortfolio = () => {
  return (
    <section className="services-portfolio" id="selected-work" aria-labelledby="services-portfolio-title">
      <div className="portfolio-atmosphere" aria-hidden="true"><div className="portfolio-light"></div><div className="portfolio-dome"></div></div>
      <h2 id="services-portfolio-title" data-reveal>Our Curated Portfolio</h2>
      <a className="portfolio-filter" href={WORK_URL}>All Projects</a>
      <PortfolioCarousel />
      <p className="portfolio-caption" data-reveal>Projects built for brands that move fast and think big.</p>
      <Button className="portfolio-link" href={WORK_URL} data-reveal arrow>Portfolio</Button>
    </section>
  );
};

export default ServicesPortfolio;
