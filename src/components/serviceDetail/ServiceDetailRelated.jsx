import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import ServiceOrbit from "./ServiceOrbit";
import { PortfolioSlides, PortfolioStatus } from "../services/ServicesPortfolio";
import { projectsForService } from "../../lib/serviceProjectFilters";
import { useProjects, projectsKey } from "../../lib/projects";
import MoreRim from "../../assets/img/service-pages/figma/0354d.svg";
import MoreLight from "../../assets/img/service-pages/figma/5bbe8.svg";

const ServiceDetailRelated = ({ slug }) => {
  const { projects: allProjects, loading, error } = useProjects();
  const projects = useMemo(() => projectsForService(allProjects, slug), [allProjects, slug]);

  let status = "";
  if (loading) status = "Loading projects...";
  else if (error) status = "Projects could not be loaded right now.";
  else if (!projects.length) status = "No related projects published yet.";

  return (
    <section className="ds-related" id="related-projects" aria-labelledby="ds-related-heading">
      <ServiceOrbit className="ds-related-orbit" />
      <h2 data-reveal id="ds-related-heading">Related Projects</h2>
      {/* Same carousel as the homepage portfolio section, fed with this service's projects. */}
      <div className="ds-related-gallery">
        <div className="services-page-shell home-portfolio-carousel">
          {status ? (
            <PortfolioStatus busy={loading}>{status}</PortfolioStatus>
          ) : (
            <PortfolioSlides key={projectsKey(projects)} projects={projects} />
          )}
        </div>
      </div>
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
