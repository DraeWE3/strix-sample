import "../style/fonts.css";
import "../style/about.css";
import "../style/projects-page.css";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { pageMeta } from "../data/pageMeta";
import { useProjects } from "../lib/projects";
import ProjectsHero from "../components/projects/ProjectsHero";
import ProjectsCatalog from "../components/projects/ProjectsCatalog";
import ProjectsCall from "../components/projects/ProjectsCall";
import ProjectsWhatsApp from "../components/projects/ProjectsWhatsApp";

const Project = () => {
  const { projects, loading, error } = useProjects();

  return (
    <div>
      <SEO
        {...pageMeta['/works']}
        canonical="https://www.strixproduction.com/works"
      />
      <Nav />
      <main className="projects-page">
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
