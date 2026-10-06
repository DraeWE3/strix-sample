import { getOptimizedImage } from "../../lib/cloudinary";
import CaseGlowImage from "../../assets/img/home/c8da3.svg";
import CaseActionArrow from "../../assets/img/home/ad547.svg";
import ExploreRim from "../../assets/img/shared/3e10a.svg";
import ExploreGlow from "../../assets/img/shared/51ad2.svg";
import ExploreMask from "../../assets/img/shared/81e7e.svg";

const CaseGlows = () => (
  <div className="mvp-case__glows" aria-hidden="true">
    <span className="mvp-case__glow mvp-case__glow--first"><span><img src={CaseGlowImage} alt="" /></span></span>
    <span className="mvp-case__glow mvp-case__glow--last"><span><img src={CaseGlowImage} alt="" /></span></span>
  </div>
);

const CasePreview = ({ project, onOpen }) => (
  <div className="mvp-case__visual">
    <button className="mvp-case__preview" type="button" aria-haspopup="dialog" aria-label={`View ${project.title} case study`} onClick={() => onOpen(project)}>
      <img className="mvp-case__image" src={getOptimizedImage(project.image)} alt={project.title} width="407" height="229" loading="lazy" />
      <span className="mvp-case__action"><span>View Case Study</span><img src={CaseActionArrow} alt="" aria-hidden="true" /></span>
    </button>
    <p className="mvp-case__category"><span aria-hidden="true">•</span> {project.categoryText}</p>
  </div>
);

const MvpSuccess = ({ projects, loading, error, onOpen }) => {
  let status = "";
  if (loading) status = "Loading projects...";
  else if (error) status = "Projects could not be loaded right now.";
  else if (!projects.length) status = "No projects published yet.";

  return (
    <section className="mvp-success" aria-labelledby="mvp-success-title" aria-busy={loading}>
      <h2 className="mvp-success__title" id="mvp-success-title" data-reveal>Our Successful MVPs</h2>
      {status && <p className="mvp-status" role="status" aria-live="polite">{status}</p>}
      {projects.map((project) => (
        <article className="mvp-case" aria-label={`${project.title} MVP`} data-reveal key={project.id}>
          <CaseGlows />
          <div className="mvp-case__content">
            <div className="mvp-case__info">
              <h3 className="mvp-case__logo mvp-case__logo--text">{project.title}</h3>
              <p className="mvp-case__description">{project.categoryText}</p>
            </div>
            <CasePreview project={project} onOpen={onOpen} />
          </div>
        </article>
      ))}
      <a className="mvp-explore" href="#more-mvps">
        <img className="mvp-explore__rim" src={ExploreRim} alt="" aria-hidden="true" />
        <span className="mvp-explore__mask" aria-hidden="true"><img src={ExploreGlow} alt="" /></span>
        <span className="mvp-explore__label">Explore Cases</span>
      </a>
    </section>
  );
};

export default MvpSuccess;
