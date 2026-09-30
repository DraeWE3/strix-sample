import { BOOKING_URL } from "./mvpCases";
import HeroImage from "../../assets/img/mvp/62554.png";
import StartGlow from "../../assets/img/mvp/c8924.svg";
import LabelLineLeft from "../../assets/img/services/db93d.svg";
import LabelLineRight from "../../assets/img/services/9c4d7.svg";
import StatGlow from "../../assets/img/services/1d4b1.svg";

const stats = [
  { key: "one", value: "<4 Week", label: "to build your MVP" },
  { key: "two", value: "10+", label: "MVPs launched successfully" },
  { key: "three", value: "3x", label: "Faster Product Validation" },
  { key: "four", value: "95%", label: "SaaS and Startup Focused" },
];

const MvpHero = () => (
  <section className="mvp-hero" aria-labelledby="mvp-title">
    <h1 id="mvp-title" className="mvp-hero__title">Design, build, and launch<br className="mvp-hero__break" /> your MVP in 4 weeks</h1>
    <div className="mvp-hero__showcase">
      <img src={HeroImage} alt="FlowFunds banking product shown on a laptop, with its account dashboard and website" fetchPriority="high" width="1004" height="503" />
    </div>
    <p className="mvp-hero__intro">One brief. Complete product — UI, development, and launch assets.</p>
    <a className="mvp-start-button" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
      <span className="mvp-start-button__lights" aria-hidden="true"></span>
      <span className="mvp-start-button__surface" aria-hidden="true"></span>
      <img className="mvp-start-button__glow" src={StartGlow} alt="" aria-hidden="true" />
      <span className="mvp-start-button__label">Start your MVP</span>
    </a>
    <div className="mvp-stats" aria-labelledby="mvp-stats-title">
      <div className="mvp-stats__heading">
        <span className="mvp-stats__arrow" aria-hidden="true"><span><img src={LabelLineLeft} alt="" /></span></span>
        <h2 id="mvp-stats-title">Our Stats</h2>
        <span className="mvp-stats__arrow mvp-stats__arrow--right" aria-hidden="true"><span><img src={LabelLineRight} alt="" /></span></span>
      </div>
      <div className="mvp-stats__grid">
        {stats.map(({ key, value, label }) => (
          <div key={key} className={`mvp-stat mvp-stat--${key}`} data-reveal>
            <span className="mvp-stat__glow" aria-hidden="true"><span><img src={StatGlow} alt="" /></span></span>
            <p className="mvp-stat__number">{value}</p>
            <p className="mvp-stat__label">{label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MvpHero;
