import { Link } from "react-router-dom";
import { getOptimizedImage } from "../../lib/cloudinary";
import { projectHref, isExternalProject } from "../../lib/projects";
import BackdropImage from "../../assets/img/mvp/98796.png";
import WorkArrow from "../../assets/img/mvp/6499e.svg";

const WorkLink = ({ project, children, ...rest }) => {
  const href = projectHref(project);
  if (isExternalProject(project)) {
    return <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>;
  }
  return <Link to={href} {...rest}>{children}</Link>;
};

const MvpMore = ({ projects, loading, error }) => {
  let status = "";
  if (loading) status = "Loading projects...";
  else if (error) status = "Projects could not be loaded right now.";
  else if (!projects.length) status = "No more projects published yet.";

  return (
    <section className="mvp-more" id="more-mvps" aria-labelledby="more-mvps-heading">
      <h2 id="more-mvps-heading" data-reveal>More MVPs Delivered</h2>
      <p className="mvp-more-intro" data-reveal>Real products. Real timelines. Real results.</p>
      <div className="mvp-more-grid" aria-busy={loading}>
        {status && <p className="mvp-status" role="status" aria-live="polite">{status}</p>}
        {projects.map((project) => (
          <article className="mvp-work-card" key={project.id} data-reveal>
            <WorkLink project={project} className="mvp-work-open" aria-label={`View ${project.title} project`}>
              <span className="mvp-work-media mvp-work-media--project">
                <img className="mvp-work-backdrop" src={BackdropImage} alt="" loading="lazy" />
                <img className="mvp-work-image" src={getOptimizedImage(project.image)} alt={project.title} loading="lazy" />
              </span>
              <span className="mvp-work-service">{project.categoryText}</span>
              <span className="mvp-work-title"><span>{project.title}</span><span className="mvp-work-arrow" aria-hidden="true"><img src={WorkArrow} alt="" loading="lazy" /></span></span>
            </WorkLink>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MvpMore;
