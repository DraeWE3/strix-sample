import { Link } from "react-router-dom";
import Button from "../Button";
import useMobileCarousel from "./useMobileCarousel";
import { useProjects, projectHref, isExternalProject } from "../../lib/projects";
import { getOptimizedImage } from "../../lib/cloudinary";
import PhaseImage from "../../assets/img/home/cd596.png";
import CopyTexture from "../../assets/img/home/09427.png";
import CaseGlowFirst from "../../assets/img/home/c8da3.svg";
import CaseGlowLast from "../../assets/img/home/1b34e.svg";
import CaseActionArrow from "../../assets/img/home/ad547.svg";

const phases = ["Research", "Development", "Design"];
const CASE_COUNT = 2;

const CaseGlow = () => (
  <div className="hm-case-glows" aria-hidden="true">
    <span className="hm-case-glow hm-case-glow-first"><span><img src={CaseGlowFirst} alt="" /></span></span>
    <span className="hm-case-glow hm-case-glow-last"><span><img src={CaseGlowLast} alt="" /></span></span>
  </div>
);

const CaseLink = ({ project, children, ...rest }) => {
  const href = projectHref(project);
  if (isExternalProject(project)) {
    return <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>;
  }
  return <Link to={href} {...rest}>{children}</Link>;
};

const CaseVisual = ({ project }) => (
  <div className="hm-case-visual">
    <CaseLink project={project} className="hm-case-preview" aria-label={`Explore the ${project.title} case study`}>
      <img className="hm-case-image" src={getOptimizedImage(project.image)} alt={project.title} loading="lazy" />
      <span className="hm-case-action"><span>View Case Study</span><img src={CaseActionArrow} alt="" aria-hidden="true" /></span>
    </CaseLink>
    <p className="hm-case-category"><span aria-hidden="true">•</span> {project.categoryText}</p>
  </div>
);

const MvpCases = () => {
  const { projects, loading, error } = useProjects();
  const cases = projects.slice(0, CASE_COUNT);

  let status = "";
  if (loading) status = "Loading projects...";
  else if (error) status = "Projects could not be loaded right now.";
  else if (!cases.length) status = "No projects published yet.";

  return (
    <div className="hm-cases" aria-busy={loading}>
      <h3 className="hm-cases-title" data-reveal>Our Successful MVPs</h3>
      {status && <p className="hm-case-status" role="status" aria-live="polite">{status}</p>}
      {cases.map((project) => (
        <article className="hm-case" data-reveal aria-label={`${project.title} MVP`} key={project.id}>
          <CaseGlow />
          <div className="hm-case-content">
            <div className="hm-case-info">
              <h4 className="hm-case-logo hm-case-logo-text">{project.title}</h4>
              <p className="hm-case-description">{project.categoryText}</p>
            </div>
            <CaseVisual project={project} />
          </div>
        </article>
      ))}
      <Button to="/works">Explore Cases</Button>
    </div>
  );
};

const HomeMvp = () => {
  const { mobile, viewportRef, settledIndex, isDragging } = useMobileCarousel();

  return (
    <section className="hm-mvp" aria-labelledby="hm-mvp-title">
      <h2 id="hm-mvp-title" className="hm-section-heading" data-reveal><span>From Idea to Market<br />in 4 Weeks</span></h2>
      <div className={`hm-mvp-intro${isDragging ? " is-dragging" : ""}`}>
        <div
          ref={viewportRef}
          className={`hm-mvp-stack${mobile ? " carousel-viewport" : ""}`}
          tabIndex={mobile ? 0 : undefined}
          role={mobile ? "region" : undefined}
          aria-label={mobile ? "Our MVP process. Use arrow keys or drag to browse." : "Our MVP process"}
          data-reveal
        >
          {phases.map((phase, index) => (
            <Link
              to="/mvp"
              key={phase}
              className={`hm-mvp-phase hm-mvp-phase-${index + 1}${mobile ? " carousel-slide" : ""}`}
              aria-label={`Learn about MVP ${phase.toLowerCase()}`}
            >
              <img src={PhaseImage} alt="" loading="lazy" />
              <h3>MVP<br />{phase}</h3>
            </Link>
          ))}
        </div>
        {mobile && <p className="visually-hidden" aria-live="polite" aria-atomic="true">{`MVP process: ${settledIndex + 1} of ${phases.length}`}</p>}
        <p className="hm-body-copy" data-reveal style={{ backgroundImage: `url("${CopyTexture}")` }}>
          We don’t just design and develop - we help founders validate and launch market-ready MVPs with speed, clarity, and impact.
        </p>
        <Button to="/mvp" arrow>Build MVP</Button>
      </div>
      <MvpCases />
    </section>
  );
};

export { MvpCases };
export default HomeMvp;
