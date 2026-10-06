import { memo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ServiceOrbit from "./ServiceOrbit";
import { createContinuousCarousels } from "./continuousCarousel";
import { useProjects, projectHref, isExternalProject, projectsKey } from "../../lib/projects";
import { getOptimizedImage } from "../../lib/cloudinary";
import DesktopGlow from "../../assets/img/service-pages/figma/485ae.svg";
import DesktopRim from "../../assets/img/service-pages/figma/0479a.svg";
import LaptopGlow from "../../assets/img/service-pages/figma/0b74f.svg";
import LaptopRim from "../../assets/img/service-pages/figma/d97d8.svg";
import FeaturedGlow from "../../assets/img/service-pages/figma/a2c5c.svg";
import FeaturedRim from "../../assets/img/service-pages/figma/df9e5.svg";
import LaptopRightGlow from "../../assets/img/service-pages/figma/acbca.svg";
import LaptopRightRim from "../../assets/img/service-pages/figma/7862f.svg";
import PrevArrow from "../../assets/img/service-pages/figma/69e64.svg";
import NextArrow from "../../assets/img/service-pages/figma/b5b40.svg";
import MoreRim from "../../assets/img/service-pages/figma/0354d.svg";
import MoreLight from "../../assets/img/service-pages/figma/5bbe8.svg";

const FRAMES = [
  { variant: "desktop", glow: DesktopGlow, rim: DesktopRim },
  { variant: "laptop", glow: LaptopGlow, rim: LaptopRim },
  { variant: "featured", glow: FeaturedGlow, rim: FeaturedRim },
  { variant: "desktop", glow: DesktopGlow, rim: DesktopRim },
  { variant: "laptop-right", glow: LaptopRightGlow, rim: LaptopRightRim },
];

const frameFor = (index) => FRAMES[index % FRAMES.length];

const RelatedCard = ({ project, index }) => {
  const frame = frameFor(index);
  const href = projectHref(project);
  const className = `ds-related-card ds-related-card--${frame.variant}`;
  const label = `View ${project.title} project`;
  const content = (
    <span className="ds-related-native">
      <span className="ds-related-card-glow" aria-hidden="true"><img src={frame.glow} alt="" loading="lazy" draggable={false} /></span>
      <span className="ds-related-card-media"><img src={getOptimizedImage(project.image)} alt={project.title} loading="lazy" draggable={false} data-related-image /></span>
      <span className="ds-related-card-rim" aria-hidden="true"><img src={frame.rim} alt="" loading="lazy" draggable={false} /></span>
    </span>
  );
  if (isExternalProject(project)) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} data-related-card>
        {content}
      </a>
    );
  }
  return (
    <Link className={className} to={href} aria-label={label} data-related-card>
      {content}
    </Link>
  );
};

const RelatedGallery = ({ projects, sectionRef }) => {
  const galleryRef = useRef(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    const carousels = createContinuousCarousels(sectionRef.current);
    let startX = 0;
    let moved = false;
    const onDown = (event) => { startX = event.clientX; moved = false; };
    const onMove = (event) => { if (event.buttons && Math.abs(event.clientX - startX) > 5) moved = true; };
    const onClick = (event) => { if (moved) { event.preventDefault(); moved = false; } };
    gallery.addEventListener("pointerdown", onDown, { passive: true });
    gallery.addEventListener("pointermove", onMove, { passive: true });
    gallery.addEventListener("click", onClick, true);
    return () => {
      gallery.removeEventListener("pointerdown", onDown);
      gallery.removeEventListener("pointermove", onMove);
      gallery.removeEventListener("click", onClick, true);
      carousels.destroy();
    };
  }, [sectionRef]);

  return (
    <div className="ds-related-gallery">
      <div
        className="ds-related-viewport"
        id="ds-related-viewport"
        ref={galleryRef}
        data-carousel="related"
        data-initial-align="center"
        data-speed="18"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Related projects. Use arrow keys or swipe to browse."
      >
        <div className="ds-related-track" data-track data-related-track>
          {projects.map((project, index) => <RelatedCard key={project.id} project={project} index={index} />)}
        </div>
      </div>
      <button className="ds-related-prev" type="button" data-carousel-prev="related" aria-controls="ds-related-viewport" aria-label="Previous related project">
        <img src={PrevArrow} alt="" loading="lazy" />
      </button>
      <button className="ds-related-next" type="button" data-carousel-next="related" aria-controls="ds-related-viewport" aria-label="Next related project">
        <img src={NextArrow} alt="" loading="lazy" />
      </button>
      <button className="ds-related-pause" type="button" data-carousel-toggle="related" aria-controls="ds-related-viewport" aria-label="Pause related projects" aria-pressed="false">
        Pause
      </button>
    </div>
  );
};

const ServiceDetailRelated = () => {
  const sectionRef = useRef(null);
  const { projects, loading, error } = useProjects();

  let status = "";
  if (loading) status = "Loading projects...";
  else if (error) status = "Projects could not be loaded right now.";
  else if (!projects.length) status = "No projects published yet.";

  return (
    <section className="ds-related" id="related-projects" aria-labelledby="ds-related-heading" ref={sectionRef}>
      <ServiceOrbit className="ds-related-orbit" />
      <h2 data-reveal id="ds-related-heading">Related Projects</h2>
      {status ? (
        <div className="ds-related-gallery" aria-busy={loading}>
          <p className="ds-related-status" role="status" aria-live="polite">{status}</p>
        </div>
      ) : (
        <RelatedGallery key={projectsKey(projects)} projects={projects} sectionRef={sectionRef} />
      )}
      <p className="ds-related-caption">Projects tailored to your industry or need are available on request.</p>
      <Link className="ds-lower-button ds-related-more" to="/works">
        <span className="ds-button-art" aria-hidden="true">
          <img className="ds-button-rim" src={MoreRim} alt="" loading="lazy" />
          <span className="ds-button-light"><img src={MoreLight} alt="" loading="lazy" /></span>
        </span>
        <span className="ds-button-label">Know More</span>
      </Link>
    </section>
  );
};

export default memo(ServiceDetailRelated);
