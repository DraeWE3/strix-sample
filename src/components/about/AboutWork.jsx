import RyvonProject from "../../assets/img/about/78a5d.png";
import KundliProject from "../../assets/img/about/d5627.png";
import ProjectArrow from "../../assets/img/about/8d76b.svg";

const AboutWork = () => {
  return (
    <section className="about-content-width about-work" id="work" aria-labelledby="about-work-heading">
      <p className="about-lower-eyebrow" data-reveal>03 &mdash; IDEAS IN THE REAL WORLD</p>
      <h2 id="about-work-heading" data-reveal>A little of what<br />we&rsquo;ve helped build.</h2>
      <div className="about-project-grid">
        <a
          className="about-project"
          href="https://strixproduction.agency/work"
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
        >
          <div className="about-project-art">
            <img
              src={RyvonProject}
              alt="Ryvon Intelligence AI orchestration platform — original project artwork"
              loading="lazy"
              width="624"
              height="351"
            />
          </div>
          <p className="about-lower-eyebrow">AI PLATFORM / PRODUCT DESIGN</p>
          <div className="about-project-title">
            <h3>Ryvon Intelligence</h3>
            <img src={ProjectArrow} alt="" aria-hidden="true" />
          </div>
          <p className="about-project-description">
            Product design for an AI orchestration platform, bringing complex workflows into a focused interface.
          </p>
        </a>
        <a
          className="about-project"
          href="https://strixproduction.agency/work"
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
        >
          <div className="about-project-art">
            <img
              src={KundliProject}
              alt="The Kundli Pro mobile astrology platform — original project artwork"
              loading="lazy"
              width="624"
              height="351"
            />
          </div>
          <p className="about-lower-eyebrow">MOBILE PRODUCT / BRAND &amp; UX</p>
          <div className="about-project-title">
            <h3>The Kundli Pro</h3>
            <img src={ProjectArrow} alt="" aria-hidden="true" />
          </div>
          <p className="about-project-description">
            Brand identity, user experience and a mobile MVP for a digital astrology platform.
          </p>
        </a>
      </div>
      <a className="about-projects-link" href="https://strixproduction.agency/work" target="_blank" rel="noopener noreferrer" data-reveal>
        View selected projects&nbsp; &#8599;
      </a>
    </section>
  );
};

export default AboutWork;
