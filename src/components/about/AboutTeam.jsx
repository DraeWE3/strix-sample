import RajPortrait from "../../assets/img/about/4e4fa.png";
import RajAtmosphere from "../../assets/img/about/c7126.svg";
import RajLinkedin from "../../assets/img/about/52917.svg";
import RajGoogle from "../../assets/img/about/5874c.svg";
import RajEmail from "../../assets/img/about/c3170.svg";
import RojaswiPortrait from "../../assets/img/about/7d964.png";
import RojaswiAtmosphere from "../../assets/img/about/5870d.svg";
import MemberLinkedin from "../../assets/img/about/5f9b4.svg";
import MemberEmail from "../../assets/img/about/60d8b.svg";
import AshminPortrait from "../../assets/img/about/62e0e.png";
import AshminAtmosphere from "../../assets/img/about/45d28.svg";

const AboutTeam = () => {
  return (
    <section className="about-team-section" aria-labelledby="about-team-title">
      <div className="about-team-heading" data-reveal>
        <h2 id="about-team-title">Good work starts <br />with good people.</h2>
        <p>Creative direction, product thinking and motion craft. Meet the people bringing different perspectives to the same table.</p>
      </div>
      <div className="about-team-grid">
        <article className="about-member-card about-member-raj" data-reveal>
          <div className="about-member-discipline">
            <p>01 / CREATIVE DIRECTION</p>
            <span aria-hidden="true">&#8599;</span>
          </div>
          <div className="about-member-portrait">
            <img src={RajPortrait} width="341.2" height="341.2" alt="Rajnandan Soni" />
          </div>
          <div className="about-member-identity">
            <h3>Rajnandan</h3>
            <p>Founder &amp; Creative Director</p>
          </div>
          <div className="about-member-links">
            <a className="about-member-link about-exported-link" href="https://www.linkedin.com/in/rajnandan-soni/" target="_blank" rel="noopener noreferrer" aria-label="Rajnandan on LinkedIn">
              <img src={RajLinkedin} alt="" />
            </a>
            <a className="about-member-link" href="https://share.google/aimode/t4ueuL3GOZlNme5lE" target="_blank" rel="noopener noreferrer" aria-label="Rajnandan on Google">
              <img src={RajGoogle} alt="" />
            </a>
            <a className="about-member-link about-exported-link" href="mailto:info@strixproduction.com?subject=Message%20for%20Rajnandan" aria-label="Email Strix about working with Rajnandan">
              <img src={RajEmail} alt="" />
            </a>
          </div>
          <div className="about-member-atmosphere about-raj-atmosphere" aria-hidden="true">
            <img src={RajAtmosphere} alt="" />
          </div>
        </article>

        <article className="about-member-card about-member-rojaswi" data-reveal>
          <div className="about-member-discipline">
            <p>02 / AI &amp; PRODUCT</p>
            <span aria-hidden="true">&#8599;</span>
          </div>
          <div className="about-member-portrait about-rojaswi-portrait">
            <img src={RojaswiPortrait} alt="Rojaswi" />
          </div>
          <div className="about-member-identity">
            <h3>Rojaswi</h3>
            <p>AI Product Manager</p>
          </div>
          <div className="about-member-links">
            <button className="about-member-link" type="button" disabled aria-label="Rojaswi on LinkedIn">
              <img src={MemberLinkedin} alt="" />
            </button>
            <a className="about-member-link" href="mailto:info@strixproduction.com?subject=Message%20for%20Rojaswi" aria-label="Email Strix about working with Rojaswi">
              <img src={MemberEmail} alt="" />
            </a>
          </div>
          <div className="about-member-atmosphere about-rojaswi-atmosphere" aria-hidden="true">
            <img src={RojaswiAtmosphere} alt="" />
          </div>
        </article>

        <article className="about-member-card about-member-ashmin" data-reveal>
          <div className="about-member-discipline">
            <p>03 / MOTION DESIGN</p>
            <span aria-hidden="true">&#8599;</span>
          </div>
          <div className="about-member-portrait">
            <img src={AshminPortrait} width="341.2" height="341.2" alt="Ashmin" />
          </div>
          <div className="about-member-identity">
            <h3>Ashmin</h3>
            <p>Production Head</p>
          </div>
          <div className="about-member-links">
            <button className="about-member-link" type="button" disabled aria-label="Ashmin on LinkedIn">
              <img src={MemberLinkedin} alt="" />
            </button>
            <a className="about-member-link" href="mailto:info@strixproduction.com?subject=Message%20for%20Ashmin" aria-label="Email Strix about working with Ashmin">
              <img src={MemberEmail} alt="" />
            </a>
          </div>
          <div className="about-member-atmosphere about-ashmin-atmosphere" aria-hidden="true">
            <img src={AshminAtmosphere} alt="" />
          </div>
        </article>
      </div>

      <div className="about-team-statement">
        <p>Different disciplines. One shared vision.</p>
        <span>CREATIVE / TECHNOLOGY / MOTION</span>
      </div>

      <div className="about-team-values" data-reveal>
        <div className="about-capability-divider"></div>
        <h3>What we bring to the table.</h3>
        <div className="about-values-grid">
          <article>
            <h4>Growth</h4>
            <p>Stay curious. Keep improving the work and the way we work.</p>
          </article>
          <article>
            <h4>People</h4>
            <p>Listen closely, share context and create space for different perspectives.</p>
          </article>
          <article>
            <h4>Awareness</h4>
            <p>Understand the people, purpose and impact behind each decision.</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;
