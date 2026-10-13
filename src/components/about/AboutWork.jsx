import { useProjects, projectHref } from "../../lib/projects";
import { getOptimizedImage } from "../../lib/cloudinary";
import ProjectArrow from "../../assets/img/about/8d76b.svg";

const FEATURED_COUNT = 2;

const AboutWork = () => {
  const { projects, loading, error } = useProjects();
  const featured = projects.slice(0, FEATURED_COUNT);

  let status = "";
  if (loading) status = "Loading projects...";
  else if (error) status = "Projects could not be loaded right now.";
  else if (!featured.length) status = "No projects published yet.";

  return (
    <section className="about-content-width about-work" id="work" aria-labelledby="about-work-heading">
      <p className="about-lower-eyebrow" data-reveal>03 &mdash; IDEAS IN THE REAL WORLD</p>
      <h2 id="about-work-heading" data-reveal>A little of what<br />we&rsquo;ve helped build.</h2>
      <div className="about-project-grid" aria-busy={loading}>
        {status && <p className="about-project-status" role="status" aria-live="polite">{status}</p>}
        {featured.map((project) => (
          <a
            className="about-project"
            href={projectHref(project)}
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            key={project.id}
          >
            <div className="about-project-art">
              <img
                src={getOptimizedImage(project.image)}
                alt={project.title}
                loading="lazy"
                width="624"
                height="351"
              />
            </div>
            <p className="about-lower-eyebrow">{project.categoryText.toUpperCase()}</p>
            <div className="about-project-title">
              <h3>{project.title}</h3>
              <img src={ProjectArrow} alt="" aria-hidden="true" />
            </div>
          </a>
        ))}
      </div>
      <a className="about-projects-link" href="/works" target="_blank" rel="noopener noreferrer" data-reveal>
        View selected projects&nbsp; &#8599;
      </a>
    </section>
  );
};

export default AboutWork;
