import StarIcon from "../../assets/img/about/109c5.svg";
import BadgeOutline from "../../assets/img/about/04f16.svg";
import BadgeInner from "../../assets/img/about/6766a.png";
import BadgeStroke from "../../assets/img/about/82ce2.svg";
import BadgeWordmark from "../../assets/img/about/0c88d.svg";
import BadgeRibbon from "../../assets/img/about/92b79.svg";
import BadgeStar from "../../assets/img/about/1fe78.svg";
import BadgeLabel from "../../assets/img/about/5353e.svg";
import CrownIcon from "../../assets/img/about/9eacb.png";
import TopRatedArrow from "../../assets/img/about/8d76b.svg";
import AgencyArrow from "../../assets/img/about/d3029.svg";

const AboutProof = () => {
  return (
    <section className="about-content-width about-proof-metrics" aria-label="Projects, experience and Upwork results">
      <div className="about-proof-metric-grid">
        <article className="about-proof-metric-card" data-reveal>
          <p className="about-proof-value">200+</p>
          <h2 className="about-proof-label">Projects delivered</h2>
          <p className="about-proof-caption">Across design, development <br />and production</p>
        </article>
        <article className="about-proof-metric-card" data-reveal>
          <p className="about-proof-value">100%</p>
          <h2 className="about-proof-label">Job Success</h2>
          <p className="about-proof-caption">Founder + agency profiles <br />on Upwork</p>
        </article>
        <article className="about-proof-metric-card" data-reveal>
          <p className="about-proof-value">3+</p>
          <h2 className="about-proof-label">Years of experience</h2>
          <p className="about-proof-caption">Building products and <br />brand experiences</p>
        </article>
        <article className="about-proof-metric-card" data-reveal>
          <p className="about-proof-value">5.0/5</p>
          <h2 className="about-proof-label">Client rating</h2>
          <p className="about-proof-caption">11 reviews on the founder&rsquo;s <br />Upwork profile</p>
          <div className="about-proof-stars" role="img" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <img key={i} src={StarIcon} width="19" height="19" alt="" />
            ))}
          </div>
        </article>
      </div>
      <div className="about-proof-profile-grid">
        <a
          className="about-proof-profile-card"
          href="https://www.upwork.com/freelancers/rajnandan"
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
          aria-label="View Rajnandan S.&rsquo;s Top Rated Upwork profile"
        >
          <div className="about-proof-top-rated-badge" aria-hidden="true">
            <img className="about-proof-badge-outline" src={BadgeOutline} width="74.6163" height="90.789" alt="" />
            <img className="about-proof-badge-inner" src={BadgeInner} width="66.629" height="76.937" alt="" />
            <img className="about-proof-badge-stroke" src={BadgeStroke} width="81.1161" height="93.6648" alt="" />
            <img className="about-proof-badge-wordmark" src={BadgeWordmark} width="53.3264" height="15.6723" alt="" />
            <img className="about-proof-badge-ribbon" src={BadgeRibbon} width="93.6265" height="17.3005" alt="" />
            <span className="about-proof-badge-ribbon-label">
              <span className="about-proof-badge-star"><img src={BadgeStar} width="15.7954" height="15.7952" alt="" /></span>
              <span className="about-proof-badge-label"><img src={BadgeLabel} width="48.1083" height="12.0674" alt="" /></span>
            </span>
            <span className="about-proof-crown about-proof-crown-small"><img src={CrownIcon} alt="" /></span>
          </div>
          <div className="about-proof-profile-identity">
            <p className="about-proof-profile-status">TOP RATED</p>
            <p className="about-proof-profile-name">Rajnandan S.</p>
            <p className="about-proof-profile-detail">100% Job Success &middot; 5.0/5</p>
          </div>
          <img className="about-proof-profile-arrow" src={TopRatedArrow} width="24" height="24" alt="" />
        </a>
        <a
          className="about-proof-profile-card"
          href="https://www.upwork.com/agencies/1799430219619033088/"
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
          aria-label="View Strix Production&rsquo;s Upwork agency profile"
        >
          <div className="about-proof-success-badge" aria-hidden="true">
            <span className="about-proof-crown about-proof-crown-large"><img src={CrownIcon} alt="" /></span>
            <p>100% Job<br />Success</p>
          </div>
          <div className="about-proof-profile-identity">
            <p className="about-proof-profile-status">100% JOB SUCCESS</p>
            <p className="about-proof-profile-name">Strix Production</p>
            <p className="about-proof-profile-detail">Agency profile on Upwork</p>
          </div>
          <img className="about-proof-profile-arrow" src={AgencyArrow} width="24" height="24" alt="" />
        </a>
      </div>
    </section>
  );
};

export default AboutProof;
