import { mvpCases } from "./mvpCases";
import CaseGlowImage from "../../assets/img/home/c8da3.svg";
import CaseActionArrow from "../../assets/img/home/ad547.svg";
import KundliLogo from "../../assets/img/home/40416.png";
import RyvonLogo from "../../assets/img/home/29eab.png";
import ExploreRim from "../../assets/img/shared/3e10a.svg";
import ExploreGlow from "../../assets/img/shared/51ad2.svg";
import ExploreMask from "../../assets/img/shared/81e7e.svg";

const CaseGlows = () => (
  <div className="mvp-case__glows" aria-hidden="true">
    <span className="mvp-case__glow mvp-case__glow--first"><span><img src={CaseGlowImage} alt="" /></span></span>
    <span className="mvp-case__glow mvp-case__glow--last"><span><img src={CaseGlowImage} alt="" /></span></span>
  </div>
);

const CasePreview = ({ id, alt, category, onOpen }) => (
  <div className="mvp-case__visual">
    <button className="mvp-case__preview" type="button" aria-haspopup="dialog" aria-label={`View ${mvpCases[id].title} case study`} onClick={() => onOpen(id)}>
      <img className="mvp-case__image" src={mvpCases[id].image} alt={alt} width="407" height="229" loading="lazy" />
      <span className="mvp-case__action"><span>View Case Study</span><img src={CaseActionArrow} alt="" aria-hidden="true" /></span>
    </button>
    <p className="mvp-case__category"><span aria-hidden="true">•</span> {category}</p>
  </div>
);

const MvpSuccess = ({ onOpen }) => (
  <section className="mvp-success" aria-labelledby="mvp-success-title">
    <h2 className="mvp-success__title" id="mvp-success-title" data-reveal>Our Successful MVPs</h2>
    <article className="mvp-case mvp-case--kundli" aria-label="The Kundli Pro mobile MVP" data-reveal>
      <CaseGlows />
      <div className="mvp-case__content">
        <div className="mvp-case__info">
          <h3 className="mvp-case__logo mvp-case__logo--kundli"><img src={KundliLogo} alt="The Kundli Pro" loading="lazy" /></h3>
          <p className="mvp-case__description">{mvpCases.kundli.description}</p>
          <div className="mvp-case__metrics">
            <div><strong>50,000+</strong><p>Downloads on<br />Google play store</p></div>
            <div><strong>⭐4.0</strong><p>Avg user rating<br />with 100+ reviews</p></div>
          </div>
        </div>
        <CasePreview id="kundli" alt="The Kundli Pro astrology application displayed on a phone" category="Mobile MVP" onOpen={onOpen} />
      </div>
    </article>
    <article className="mvp-case mvp-case--ryvon" aria-label="Ryvon AI SaaS platform" data-reveal>
      <CaseGlows />
      <div className="mvp-case__content">
        <div className="mvp-case__info">
          <h3 className="mvp-case__logo mvp-case__logo--ryvon"><img src={RyvonLogo} alt="Ryvon AI" loading="lazy" /></h3>
          <p className="mvp-case__description"><strong>Ryvon</strong> is one platform for document chat, audio transcription, and workflow automation.</p>
          <div className="mvp-case__metrics">
            <div><strong>&lt;3 Weeks</strong><p>From Idea to<br />launch ready</p></div>
            <div><strong>$1M+</strong><p>Pre-seed<br />Valuation</p></div>
          </div>
        </div>
        <CasePreview id="ryvon" alt="Ryvon AI workspace and chat interface on desktop and mobile screens" category="AI SaaS Platform" onOpen={onOpen} />
      </div>
    </article>
    <a className="mvp-explore" href="#more-mvps">
      <img className="mvp-explore__rim" src={ExploreRim} alt="" aria-hidden="true" />
      <span className="mvp-explore__mask" aria-hidden="true"><img src={ExploreGlow} alt="" /></span>
      <span className="mvp-explore__label">Explore Cases</span>
    </a>
  </section>
);

export default MvpSuccess;
