import "../style/fonts.css";
import "../style/about.css";
import "../style/projects-page.css";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import useProjects from "../components/projects/useProjects";
import ProjectsHero from "../components/projects/ProjectsHero";
import ProjectsCatalog from "../components/projects/ProjectsCatalog";
import ProjectsCall from "../components/projects/ProjectsCall";
import ProjectsWhatsApp from "../components/projects/ProjectsWhatsApp";

const Project = () => {
  const { projects, loading } = useProjects();

  return (
    <div>
      <SEO
        title="Our Creative Portfolio & Client Work Showcase"
        description="Browse Strix's portfolio of completed projects spanning UI/UX design, web development, software solutions, and commercial video production for global brands."
        canonical="https://www.strixproduction.com/Project"
      />
      <Nav />
      <main className="projects-page">
        <ProjectsHero projects={projects} />
        <ProjectsCatalog projects={projects} loading={loading} />
        <ProjectsCall />
        <ProjectsWhatsApp />
      </main>
      <Footer />
    </div>
  );
};

export default Project;
