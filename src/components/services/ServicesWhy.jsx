import CardGlow from "../../assets/img/services/88df4.svg";
import BadgeOutline from "../../assets/img/services/f4db8.svg";
import BadgeInner from "../../assets/img/services/e8352.png";
import BadgeStroke from "../../assets/img/services/1535b.svg";
import BadgeWordmark from "../../assets/img/services/85dbf.svg";
import BadgeIcon from "../../assets/img/services/6a177.png";
import BadgeRibbon from "../../assets/img/services/1d034.svg";
import BadgeStar from "../../assets/img/services/a7690.svg";
import BadgeLabel from "../../assets/img/services/aff7f.svg";
import Crown from "../../assets/img/shared/9eacb.png";

const ServicesWhy = () => {
  return (
    <section className="why-strix" aria-labelledby="services-why-heading">
      <div className="orbit why-orbit" aria-hidden="true"><div className="orbit-glow"></div><div className="orbit-ring"></div></div>
      <h2 id="services-why-heading" data-reveal><span className="why-heading-lines">Why<br /><strong>STRIX</strong>?</span></h2>
      <p className="why-description" data-reveal>
        We combine design, development, and production under one roof &mdash; so your product ships faster and looks better doing it.
      </p>
      <div className="why-unified why-card" data-reveal>
        <img className="why-glow" src={CardGlow} alt="" />
        <h3>Design + Development + Production</h3>
        <p>No briefing three agencies and chasing handoffs.<br />Everything ships from one studio.</p>
      </div>
      <div className="why-grid">
        <div className="why-card why-verified" data-reveal>
          <img className="why-glow" src={CardGlow} alt="" />
          <a
            className="why-badges"
            href="https://www.upwork.com/agencies/1799430219619033088/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Top Rated, 100% Job Success. View Strix Production on Upwork (opens a new tab)"
          >
            <span className="upwork-badge" aria-hidden="true">
              <span className="badge-outline"><img src={BadgeOutline} alt="" /></span>
              <img className="badge-inner" src={BadgeInner} alt="" />
              <img className="badge-stroke" src={BadgeStroke} alt="" />
              <img className="badge-wordmark" src={BadgeWordmark} alt="" />
              <img className="badge-icon" src={BadgeIcon} alt="" />
              <img className="badge-ribbon" src={BadgeRibbon} alt="" />
              <span className="badge-ribbon-label">
                <span className="badge-star"><img src={BadgeStar} alt="" /></span>
                <span className="badge-label"><img src={BadgeLabel} alt="" /></span>
              </span>
            </span>
            <span className="job-success">
              <span className="crown"><img src={Crown} alt="" /></span>
              <span>100% Job<br />Success</span>
            </span>
          </a>
          <p className="why-card-caption">Every project. Every client. Third-party verified &mdash; not a claim we make ourselves.</p>
        </div>
        <div className="why-card why-fixed" data-reveal>
          <img className="why-glow" src={CardGlow} alt="" />
          <h3><span>Fixed price.</span><span>Fixed Scope.</span></h3>
        </div>
        <div className="why-card why-projects" data-reveal>
          <img className="why-glow" src={CardGlow} alt="" />
          <h3>100 +<br />Projects</h3>
          <p className="why-card-caption">Successfully completed<br />in various niches</p>
        </div>
      </div>
    </section>
  );
};

export default ServicesWhy;
