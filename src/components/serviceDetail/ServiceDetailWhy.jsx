import ServiceOrbit from "./ServiceOrbit";
import UnifiedGlow from "../../assets/img/service-pages/figma/add2e.svg";
import VerifiedGlow from "../../assets/img/service-pages/figma/d8459.svg";
import CardGlow from "../../assets/img/service-pages/figma/88df4.svg";
import BadgeOutline from "../../assets/img/service-pages/figma/f4db8.svg";
import BadgeInner from "../../assets/img/service-pages/figma/e8352.png";
import BadgeStroke from "../../assets/img/service-pages/figma/1535b.svg";
import BadgeWordmark from "../../assets/img/service-pages/figma/85dbf.svg";
import BadgeIcon from "../../assets/img/service-pages/figma/6a177.png";
import BadgeRibbon from "../../assets/img/service-pages/figma/1d034.svg";
import BadgeStar from "../../assets/img/service-pages/figma/a7690.svg";
import BadgeLabel from "../../assets/img/service-pages/figma/ba7b3.svg";
import Crown from "../../assets/img/service-pages/figma/9eacb.png";
import RatingArrow from "../../assets/img/service-pages/figma/bb3c7.svg";

const ServiceDetailWhy = () => (
  <section className="ds-why" aria-labelledby="ds-why-heading">
    <ServiceOrbit className="ds-why-orbit" />
    <h2 data-reveal id="ds-why-heading">Why Choose us ?</h2>
    <div className="ds-why-unified ds-why-card" data-reveal>
      <img className="ds-why-glow" src={UnifiedGlow} alt="" loading="lazy" />
      <h3>Design + Development + Production</h3>
      <p>No briefing three agencies and chasing handoffs.<br />Everything ships from one studio.</p>
    </div>
    <div className="ds-why-grid">
      <div className="ds-why-card ds-why-verified">
        <img className="ds-why-glow" src={VerifiedGlow} alt="" loading="lazy" />
        <a
          className="ds-why-badges"
          href="https://www.upwork.com/agencies/1799430219619033088/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Top Rated, 100% Job Success. View Strix Production on Upwork (opens a new tab)"
        >
          <span className="ds-upwork-badge" aria-hidden="true">
            <span className="ds-badge-outline"><img src={BadgeOutline} alt="" loading="lazy" /></span>
            <img className="ds-badge-inner" src={BadgeInner} alt="" loading="lazy" />
            <img className="ds-badge-stroke" src={BadgeStroke} alt="" loading="lazy" />
            <img className="ds-badge-wordmark" src={BadgeWordmark} alt="" loading="lazy" />
            <img className="ds-badge-icon" src={BadgeIcon} alt="" loading="lazy" />
            <img className="ds-badge-ribbon" src={BadgeRibbon} alt="" loading="lazy" />
            <span className="ds-badge-ribbon-label">
              <span className="ds-badge-star"><img src={BadgeStar} alt="" loading="lazy" /></span>
              <span className="ds-badge-label"><img src={BadgeLabel} alt="" loading="lazy" /></span>
            </span>
          </span>
          <span className="ds-job-success">
            <span className="ds-crown"><img src={Crown} alt="" loading="lazy" /></span>
            <span>100% Job<br />Success</span>
          </span>
        </a>
        <p className="ds-why-card-caption">Every project. Every client. Third-party verified — not a claim we make ourselves.</p>
      </div>
      <a
        className="ds-why-card ds-why-rating"
        href="https://clutch.co/profile/strix-production"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="5.0 out of 5 average rating on Clutch and Upwork. View Strix on Clutch (opens a new tab)"
      >
        <img className="ds-why-glow" src={CardGlow} alt="" loading="lazy" />
        <h3>5.0</h3>
        <span className="ds-rating-stars" aria-hidden="true">⭐⭐⭐⭐⭐</span>
        <p className="ds-why-card-caption">Average rating on<br />Clutch.co &amp; Upwork</p>
        <img className="ds-why-rating-arrow" src={RatingArrow} alt="" loading="lazy" />
      </a>
      <div className="ds-why-card ds-why-projects">
        <img className="ds-why-glow" src={CardGlow} alt="" loading="lazy" />
        <h3>100 +<br />Projects</h3>
        <p className="ds-why-card-caption">Successfully completed<br />in various niches</p>
      </div>
    </div>
  </section>
);

export default ServiceDetailWhy;
