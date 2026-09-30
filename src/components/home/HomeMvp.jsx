import { Link } from "react-router-dom";
import { MiddleButton } from "./HomeButtons";
import useMobileCarousel from "./useMobileCarousel";
import PhaseImage from "../../assets/img/home/cd596.png";
import CopyTexture from "../../assets/img/home/09427.png";
import BuildRim from "../../assets/img/home/917a3-mvp.svg";
import BuildMask from "../../assets/img/about/f4a96.svg";
import BuildGlow from "../../assets/img/home/9b392-mvp.svg";
import ButtonArrow from "../../assets/img/home/e23f5-mvp.svg";
import CasesRim from "../../assets/img/home/3e10a-mvp.svg";
import CasesMask from "../../assets/img/shared/81e7e.svg";
import CasesGlow from "../../assets/img/home/51ad2-mvp.svg";
import CaseGlowFirst from "../../assets/img/home/c8da3.svg";
import CaseGlowLast from "../../assets/img/home/1b34e.svg";
import CaseActionArrow from "../../assets/img/home/ad547.svg";
import KundliLogo from "../../assets/img/home/40416.png";
import KundliPreview from "../../assets/img/home/ffd8f.png";
import PlayStoreIcon from "../../assets/img/home/09993.png";
import RyvonLogo from "../../assets/img/home/29eab.png";
import RyvonPreview from "../../assets/img/home/7d95c.png";

const phases = ["Research", "Development", "Design"];

const CaseGlow = () => (
  <div className="hm-case-glows" aria-hidden="true">
    <span className="hm-case-glow hm-case-glow-first"><span><img src={CaseGlowFirst} alt="" /></span></span>
    <span className="hm-case-glow hm-case-glow-last"><span><img src={CaseGlowLast} alt="" /></span></span>
  </div>
);

const CaseVisual = ({ image, alt, category, name }) => (
  <div className="hm-case-visual">
    <Link to="/Project" className="hm-case-preview" aria-label={`Explore ${name} and other case studies`}>
      <img className="hm-case-image" src={image} alt={alt} loading="lazy" />
      <span className="hm-case-action"><span>View Case Study</span><img src={CaseActionArrow} alt="" aria-hidden="true" /></span>
    </Link>
    <p className="hm-case-category"><span aria-hidden="true">•</span> {category}</p>
  </div>
);

const MvpCases = () => (
  <div className="hm-cases">
    <h3 className="hm-cases-title" data-reveal>Our Successful MVPs</h3>
    <article className="hm-case hm-case-kundli" data-reveal aria-label="The Kundli Pro mobile MVP">
      <CaseGlow />
      <div className="hm-case-content">
        <div className="hm-case-info">
          <div className="hm-case-logo hm-kundli-logo"><img src={KundliLogo} alt="The Kundli Pro" loading="lazy" /></div>
          <p className="hm-case-description">The Kundli Pro is a Vedic astrology software used to create detailed birth charts, predict future events, and analyze horoscopes.</p>
          <div className="hm-kundli-metrics">
            <div className="hm-kundli-metric">
              <p>50k+Downloads</p>
              <div className="hm-play-store-badge">
                <span className="hm-play-store-icon"><img src={PlayStoreIcon} alt="" aria-hidden="true" /></span>
                <span><small>Google</small><strong>Play Store</strong></span>
              </div>
            </div>
            <div className="hm-kundli-metric">
              <p>4.0 <span aria-label="star">⭐</span> - Ratings</p>
              <div className="hm-reviews-badge"><span>100+</span><strong>User Reviews</strong></div>
            </div>
          </div>
        </div>
        <CaseVisual name="The Kundli Pro" image={KundliPreview} alt="The Kundli Pro mobile astrology application" category="Mobile MVP" />
      </div>
    </article>
    <article className="hm-case hm-case-ryvon" data-reveal aria-label="Ryvon AI SaaS platform">
      <CaseGlow />
      <div className="hm-case-content">
        <div className="hm-case-info">
          <div className="hm-case-logo hm-ryvon-logo"><img src={RyvonLogo} alt="Ryvon AI" loading="lazy" /></div>
          <p className="hm-case-description"><strong>Ryvon</strong> is one platform for document chat, audio transcription, and workflow automation.</p>
          <div className="hm-ryvon-metrics">
            <div><strong>&lt;3 Weeks</strong><p>From Idea to<br />launch ready</p></div>
            <div><strong>$1M+</strong><p>Pre-seed<br />Valuation</p></div>
          </div>
        </div>
        <CaseVisual name="Ryvon AI" image={RyvonPreview} alt="Ryvon AI document chat and workflow automation interface" category="AI SaaS Platform" />
      </div>
    </article>
    <MiddleButton href="/Project" skin={{ rim: CasesRim, mask: CasesMask, glow: CasesGlow }}>Explore Cases</MiddleButton>
  </div>
);

const HomeMvp = () => {
  const { mobile, viewportRef, settledIndex, isDragging } = useMobileCarousel();

  return (
    <section className="hm-mvp" aria-labelledby="hm-mvp-title">
      <h2 id="hm-mvp-title" className="hm-section-heading" data-reveal><span>From Idea to Market<br />in 4 Weeks</span></h2>
      <div className={`hm-mvp-intro${isDragging ? " is-dragging" : ""}`}>
        <div
          ref={viewportRef}
          className={`hm-mvp-stack${mobile ? " carousel-viewport" : ""}`}
          tabIndex={mobile ? 0 : undefined}
          role={mobile ? "region" : undefined}
          aria-label={mobile ? "Our MVP process. Use arrow keys or drag to browse." : "Our MVP process"}
          data-reveal
        >
          {phases.map((phase, index) => (
            <Link
              to="/mvp"
              key={phase}
              className={`hm-mvp-phase hm-mvp-phase-${index + 1}${mobile ? " carousel-slide" : ""}`}
              aria-label={`Learn about MVP ${phase.toLowerCase()}`}
            >
              <img src={PhaseImage} alt="" loading="lazy" />
              <h3>MVP<br />{phase}</h3>
            </Link>
          ))}
        </div>
        {mobile && <p className="visually-hidden" aria-live="polite" aria-atomic="true">{`MVP process: ${settledIndex + 1} of ${phases.length}`}</p>}
        <p className="hm-body-copy" data-reveal style={{ backgroundImage: `url("${CopyTexture}")` }}>
          We don’t just design and develop - we help founders validate and launch market-ready MVPs with speed, clarity, and impact.
        </p>
        <MiddleButton href="/mvp" kind="build" skin={{ rim: BuildRim, mask: BuildMask, glow: BuildGlow }} arrow={ButtonArrow}>Build MVP</MiddleButton>
      </div>
      <MvpCases />
    </section>
  );
};

export { MvpCases };
export default HomeMvp;
