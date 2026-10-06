import { Link } from "react-router-dom";
import Button from "../Button";
import useScrollCarousel from "../../animations/useScrollCarousel";
import { useProjects, projectHref, isExternalProject, projectsKey } from "../../lib/projects";
import { getOptimizedImage } from "../../lib/cloudinary";
import SideGlow from "../../assets/img/services/485ae.svg";
import DesktopRim from "../../assets/img/services/0479a.svg";
import LaptopRim from "../../assets/img/services/d97d8.svg";
import CenterGlow from "../../assets/img/services/a2c5c.svg";
import CenterRim from "../../assets/img/services/df9e5.svg";
import PortfolioArrow from "../../assets/img/services/69e64.svg";

const WORK_URL = "/works";

const FRAMES = [
  { glow: SideGlow, rim: DesktopRim },
  { glow: SideGlow, rim: LaptopRim },
  { glow: CenterGlow, rim: CenterRim, center: true },
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

const PortfolioStatus = ({ children, busy = false }) => (
  <div className="portfolio-carousel carousel" aria-roledescription="carousel" aria-label="Selected portfolio projects" aria-busy={busy}>
    <p className="portfolio-status" role="status" aria-live="polite">{children}</p>
  </div>
);

const PortfolioSlides = ({ projects }) => {
  const startIndex = Math.min(2, projects.length - 1);
  const { viewportRef, index, controlIndex, settledIndex, isDragging, step } = useScrollCarousel({
    align: "center",
    startIndex,
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
            {projects.map((project, projectIndex) => {
              const frame = frameFor(projectIndex);
              return (
                <article
                  className={`carousel-slide ${slideState(projectIndex, index)}`}
                  key={project.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${projectIndex + 1} of ${projects.length}: ${project.title}`}
                >
                  <SlideLink project={project} className="portfolio-visual" aria-label={`Explore ${project.title}`} draggable="false">
                    <div className={`portfolio-card-native${frame.center ? " portfolio-native-center" : ""}`}>
                      <div className="portfolio-card-glow" aria-hidden="true"><img src={frame.glow} alt="" draggable={false} /></div>
                      <div className="portfolio-card-media">
                        <img
                          className="portfolio-project-image"
                          src={getOptimizedImage(project.image)}
                          alt={project.title}
                          loading="lazy"
                          draggable={false}
                        />
                      </div>
                      <div className="portfolio-card-overlay" aria-hidden="true">
                        <img className="portfolio-card-rim" src={frame.rim} alt="" draggable={false} />
                      </div>
                    </div>
                  </SlideLink>
                </article>
              );
            })}
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

export const PortfolioCarousel = () => {
  const { projects, loading, error } = useProjects();

  if (loading) return <PortfolioStatus busy>Loading projects...</PortfolioStatus>;
  if (error) return <PortfolioStatus>Projects could not be loaded right now.</PortfolioStatus>;
  if (!projects.length) return <PortfolioStatus>No projects published yet.</PortfolioStatus>;

  return <PortfolioSlides key={projectsKey(projects)} projects={projects} />;
};

const ServicesPortfolio = () => {
  return (
    <section className="services-portfolio" id="selected-work" aria-labelledby="services-portfolio-title">
      <div className="portfolio-atmosphere" aria-hidden="true"><div className="portfolio-light"></div><div className="portfolio-dome"></div></div>
      <h2 id="services-portfolio-title" data-reveal>Our Curated Portfolio</h2>
      <Link className="portfolio-filter" to={WORK_URL}>All Projects</Link>
      <PortfolioCarousel />
      <p className="portfolio-caption" data-reveal>Projects built for brands that move fast and think big.</p>
      <Button className="portfolio-link" to={WORK_URL} data-reveal arrow>Portfolio</Button>
    </section>
  );
};

export default ServicesPortfolio;
