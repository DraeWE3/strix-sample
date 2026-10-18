import { memo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ServiceOrbit from "./ServiceOrbit";
import { initContinuousCarousels } from "../shared/continuousCarousel";
import { useProjects, projectHref, isExternalProject, projectsKey } from "../../lib/projects";
import { getOptimizedImage } from "../../lib/cloudinary";
import MoreRim from "../../assets/img/service-pages/figma/0354d.svg";
import MoreLight from "../../assets/img/service-pages/figma/5bbe8.svg";

const RelatedCard = ({ project }) => {
  const href = projectHref(project);
  const className = "ds-related-card";
  const label = `View ${project.title} project`;
  const content = (
    <>
      <span className="ds-related-card-media"><img src={getOptimizedImage(project.image)} alt={project.title} loading="lazy" draggable={false} data-related-image /></span>
      <span className="ds-related-card-info">
        {project.categoryText ? <span className="ds-related-card-cat">{project.categoryText}</span> : null}
        <span className="ds-related-card-title">{project.title}</span>
      </span>
      <span className="ds-related-card-go" aria-hidden="true">↗</span>
    </>
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
    const destroyCarousels = initContinuousCarousels(sectionRef.current);
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
      destroyCarousels();
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
          {projects.map((project) => <RelatedCard key={project.id} project={project} />)}
        </div>
      </div>
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
