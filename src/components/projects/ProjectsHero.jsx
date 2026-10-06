import Button from "../Button";
import ProjectsFeatured from "./ProjectsFeatured";
import AboutClients from "../about/AboutClients";
import UpworkLogo from "../../assets/img/projects/1c94a.svg";
import GoodFirmsLogo from "../../assets/img/projects/f95e5.svg";
import Divider from "../../assets/img/projects/5c8e0.svg";
import Star1 from "../../assets/img/projects/2bdf5.svg";
import Star2 from "../../assets/img/projects/ed9b0.svg";
import Star3 from "../../assets/img/projects/e9981.svg";
import Star4 from "../../assets/img/projects/995e5.svg";
import Star5 from "../../assets/img/projects/6f667.svg";
import { upworkProfiles } from "../../data/reviews";

const STARS = [Star1, Star2, Star3, Star4, Star5];

const Stars = () => (
  <span className="review-stars" aria-hidden="true">
    {STARS.map((star) => <img key={star} src={star} alt="" />)}
  </span>
);

const scrollToCatalog = () => {
  document.getElementById("projects-catalog")?.scrollIntoView({ behavior: "smooth" });
};

const ProjectsHero = ({ projects, loading, error }) => (
  <section className="projects-hero" aria-labelledby="page-title">
    <div className="hero-arch-wrap" aria-hidden="true">
      <div className="hero-arch-art"><div className="hero-arch-haze"></div><div className="hero-arch"></div></div>
    </div>
    <h1 id="page-title">Projects</h1>
    <p className="hero-intro">Real work. Real outcomes. Across design, development, and production.</p>
    <ProjectsFeatured projects={projects} loading={loading} error={error}>
      <Button className="explore-button" onClick={scrollToCatalog}>Explore Projects</Button>
      <div className="proof-row" aria-label="Strix project experience and reviews">
        <a className="review-logo" href={upworkProfiles.freelancer} target="_blank" rel="noopener noreferrer" aria-label="Read Strix founder's five-star Upwork reviews">
          <img src={UpworkLogo} alt="Upwork" />
          <Stars />
        </a>
        <img className="proof-divider" src={Divider} alt="" />
        <div className="project-stat"><strong>200+</strong><span>Projects Delivered</span></div>
        <img className="proof-divider" src={Divider} alt="" />
        <div className="review-logo goodfirms" aria-label="GoodFirms, five stars">
          <img src={GoodFirmsLogo} alt="GoodFirms" />
          <Stars />
        </div>
      </div>
    </ProjectsFeatured>
    <AboutClients showPill={false} />
  </section>
);

export default ProjectsHero;
