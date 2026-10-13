import { useProjects, projectHref } from "../../lib/projects";
import { getOptimizedImage } from "../../lib/cloudinary";
import ProjectArrow from "../../assets/img/about/8d76b.svg";
import RyvonArtwork from "../../assets/img/about/78a5d.webp";
import KundliArtwork from "../../assets/img/about/d5627.webp";

const FEATURED_COUNT = 2;

// Figma 4783:7062 features these two Firebase projects with original artwork
// and a short summary. Projects are matched by title; links stay live from
// Firestore, and any missing slot falls back to the latest published project.
const FEATURED_PRESENTATION = {
  "ryvon intelligence": {
    label: "AI PLATFORM / PRODUCT DESIGN",
    image: RyvonArtwork,
    description: "Product design for an AI orchestration platform, bringing complex workflows into a focused interface.",
  },
  "the kundli pro": {
    label: "MOBILE PRODUCT / BRAND & UX",
    image: KundliArtwork,
    description: "Brand identity, user experience and a mobile MVP for a digital astrology platform.",
  },
};

const FEATURED_ORDER = Object.keys(FEATURED_PRESENTATION);
const featuredKey = (project) => project.title.trim().toLowerCase();
const presentationFor = (project) => FEATURED_PRESENTATION[featuredKey(project)];

const AboutWork = () => {
  const { projects, loading, error } = useProjects();
  const highlighted = projects
    .filter(presentationFor)
    .sort((a, b) => FEATURED_ORDER.indexOf(featuredKey(a)) - FEATURED_ORDER.indexOf(featuredKey(b)));
  const featured = highlighted
    .concat(projects.filter((project) => !presentationFor(project)))
    .slice(0, FEATURED_COUNT);

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
        {featured.map((project) => {
          const presentation = presentationFor(project);
          return (
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
                  src={presentation?.image ?? getOptimizedImage(project.image)}
                  alt={project.title}
                  loading="lazy"
                  width="624"
                  height="351"
                />
              </div>
              <p className="about-lower-eyebrow">{presentation?.label ?? project.categoryText.toUpperCase()}</p>
              <div className="about-project-title">
                <h3>{project.title}</h3>
                <img src={ProjectArrow} width="24" height="24" alt="" aria-hidden="true" />
              </div>
              {presentation && <p className="about-project-description">{presentation.description}</p>}
            </a>
          );
        })}
      </div>
      <a className="about-projects-link" href="/works" target="_blank" rel="noopener noreferrer" data-reveal>
        View selected projects&nbsp; &#8599;
      </a>
    </section>
  );
};

export default AboutWork;
