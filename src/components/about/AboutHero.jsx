import { Link } from "react-router-dom";
import EllipseA from "../../assets/img/about/4986b.svg";
import EllipseB from "../../assets/img/about/aa783.svg";
import EllipseC from "../../assets/img/about/83134.svg";
import OrbMonogram from "../../assets/img/about/42f82.svg";
import MvpButtonRim from "../../assets/img/about/917a3.svg";
import MvpLightGlow from "../../assets/img/about/9b392.svg";
import ButtonArrow from "../../assets/img/about/e23f5.svg";
import ExploreButtonRim from "../../assets/img/about/3e10a.svg";
import ExploreLightGlow from "../../assets/img/about/51ad2.svg";

const AboutHero = () => {
  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      <div className="about-hero-orb" aria-hidden="true">
        <div className="about-orb-face">
          <div className="about-orb-beams">
            <i className="about-orb-beam about-masked-beam about-beam-a"></i>
            <i className="about-orb-beam about-masked-beam about-beam-b"></i>
            <i className="about-orb-beam about-masked-beam about-beam-c"></i>
            <i className="about-orb-beam about-masked-beam about-beam-d"></i>
            <i className="about-orb-beam about-masked-beam about-beam-e"></i>
          </div>
          <div className="about-orb-ellipse about-ellipse-a"><img src={EllipseA} alt="" /></div>
          <div className="about-orb-beams">
            <i className="about-orb-beam about-beam-f"></i>
            <i className="about-orb-beam about-beam-g"></i>
            <i className="about-orb-beam about-beam-h"></i>
            <i className="about-orb-beam about-beam-i"></i>
            <i className="about-orb-beam about-beam-j"></i>
          </div>
          <div className="about-orb-ellipse about-ellipse-b"><img src={EllipseB} alt="" /></div>
          <div className="about-orb-ellipse about-ellipse-c"><img src={EllipseC} alt="" /></div>
          <img className="about-orb-monogram" src={OrbMonogram} alt="" />
          <div className="about-orb-inner-light"></div>
        </div>
        <div className="about-orb-neutralize"></div>
      </div>
      <div className="about-hero-copy">
        <h1 id="about-hero-title">Big ideas.<br />Built to launch.</h1>
        <p>
          We are a design, development and production studio for startups, SaaS and technology teams. <br />
          One team to shape your product, build it and bring its story to life.
        </p>
        <div className="about-hero-actions">
          <Link className="glow-button about-mvp-button" to="/contact">
            <span className="about-button-art" aria-hidden="true">
              <img className="about-button-rim" src={MvpButtonRim} alt="" />
              <span className="about-button-light about-mvp-light"><img src={MvpLightGlow} alt="" /></span>
            </span>
            <span className="about-button-label">
              Build MVP <img className="about-button-arrow" src={ButtonArrow} alt="" />
            </span>
          </Link>
          <a className="glow-button about-explore-button" href="#work">
            <span className="about-button-art" aria-hidden="true">
              <img className="about-button-rim" src={ExploreButtonRim} alt="" />
              <span className="about-button-light about-explore-light"><img src={ExploreLightGlow} alt="" /></span>
            </span>
            <span className="about-button-label">Explore Work</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
