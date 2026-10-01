import GlowLeft from "../../assets/img/projects/6c527.svg";
import GlowRight from "../../assets/img/projects/fcdd3.svg";
import Circle from "../../assets/img/projects/a9b34.svg";

const ProjectsCall = () => (
  <section className="projects-call" aria-labelledby="projects-call-heading">
    <div className="projects-call-art" aria-hidden="true">
      <div className="projects-call-glow projects-call-glow--left"><div><img src={GlowLeft} alt="" loading="lazy" /></div></div>
      <div className="projects-call-glow projects-call-glow--right"><div><img src={GlowRight} alt="" loading="lazy" /></div></div>
      <div className="projects-call-circle"><img src={Circle} alt="" loading="lazy" /></div>
    </div>
    <div className="projects-call-message">
      <h2 id="projects-call-heading">Turn Your Vision Into an&nbsp;Experience That Lasts</h2>
      <p>You have a story worth sharing — we help you tell it in a way that’s impossible to ignore.</p>
    </div>
    <a className="projects-call-link" href="https://calendly.com/strix-ryvon/raj-consultation" target="_blank" rel="noopener noreferrer"><span>Book a call</span></a>
  </section>
);

export default ProjectsCall;
