import "../style/fonts.css";
import "../style/about.css";
import "../style/projects-page.css";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { useProjects } from "../lib/projects";
import ProjectsHero from "../components/projects/ProjectsHero";
import ProjectsCatalog from "../components/projects/ProjectsCatalog";
import ProjectsCall from "../components/projects/ProjectsCall";
import ProjectsWhatsApp from "../components/projects/ProjectsWhatsApp";
import HeroGlow from "../assets/img/projects/73bb6.svg";
import OrbGlow from "../assets/img/projects/a190f.svg";
import OrbGlowSoft from "../assets/img/projects/1ffa1.svg";
import EllipseGlow from "../assets/img/projects/72dc1.svg";

const ProjectsBackground = () => (
  <div className="projects-bg" aria-hidden="true">
    <img className="projects-bg__hero projects-bg__hero--left" src={HeroGlow} alt="" />
    <img className="projects-bg__hero projects-bg__hero--right" src={HeroGlow} alt="" />
    <img className="projects-bg__orb projects-bg__orb--a1" src={OrbGlow} alt="" />
    <img className="projects-bg__orb projects-bg__orb--a2" src={OrbGlow} alt="" />
    <img className="projects-bg__orb projects-bg__orb--b1" src={OrbGlow} alt="" />
    <img className="projects-bg__orb projects-bg__orb--b2" src={OrbGlow} alt="" />
    <img className="projects-bg__orb projects-bg__orb--c1" src={OrbGlowSoft} alt="" />
    <img className="projects-bg__ellipse" src={EllipseGlow} alt="" />
  </div>
);

const Project = () => {
  const { projects, loading, error } = useProjects();

  return (
    <div>
      <SEO
        title="Our Creative Portfolio & Client Work Showcase"
        description="Browse Strix's portfolio of completed projects spanning UI/UX design, web development, software solutions, and commercial video production for global brands."
        canonical="https://www.strixproduction.com/Project"
      />
      <Nav />
      <main className="projects-page">
        <ProjectsBackground />
        <ProjectsHero projects={projects} loading={loading} error={error} />
        <ProjectsCatalog projects={projects} loading={loading} error={error} />
        <ProjectsCall />
        <ProjectsWhatsApp />
      </main>
      <Footer />
    </div>
  );
};

export default Project;
