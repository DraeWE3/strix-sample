import { SHOWREEL_ID } from "../showreel";
import HeroPoster from "../../assets/img/services/40d71.png";
import ButtonRim from "../../assets/img/shared/3e10a.svg";
import ButtonGlow from "../../assets/img/shared/51ad2.svg";
import ButtonArrow from "../../assets/img/shared/e23f5.svg";

const ServicesHero = ({ playing, onShowreel }) => {
  return (
    <section className="services-hero" aria-labelledby="services-hero-heading">
      <div className="orbit hero-orbit" aria-hidden="true"><div className="orbit-glow"></div><div className="orbit-ring"></div></div>
      <h1 id="services-hero-heading" data-reveal>Design. Build. Launch.<br />All under one roof.</h1>
      <div className="hero-media">
        {playing ? (
          <div className="hero-poster hero-poster--playing">
            <iframe
              className="hero-showreel-frame"
              src={`https://www.youtube.com/embed/${SHOWREEL_ID}?autoplay=1&rel=0`}
              title="Strix showreel"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        ) : (
          <button className="hero-poster" type="button" aria-label="Play showreel" onClick={onShowreel}>
            <img src={HeroPoster} alt="A selection of Strix Production design and development work" fetchPriority="high" />
            <span className="poster-play" aria-hidden="true">Play showreel &#8599;</span>
          </button>
        )}
        <p data-reveal>
          One studio for every layer of your product &mdash; brand, code, and production. No separate agencies. No coordination chaos.
        </p>
        <a className="glow-button showreel-button" href={`https://www.youtube.com/watch?v=${SHOWREEL_ID}`} target="_blank" rel="noopener noreferrer" data-reveal>
          <span className="button-art" aria-hidden="true">
            <img className="button-rim" src={ButtonRim} alt="" />
            <span className="button-light showreel-light"><img src={ButtonGlow} alt="" /></span>
          </span>
          <span className="button-label">Showreel <img className="button-arrow" src={ButtonArrow} alt="" /></span>
        </a>
      </div>
    </section>
  );
};

export default ServicesHero;
