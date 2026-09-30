import { BOOKING_URL } from "./mvpCases";
import OrbBackground from "../../assets/img/services/4b4d2.svg";
import OrbArrow from "../../assets/img/services/98325.svg";
import CallRim from "../../assets/img/shared/6d4be.svg";
import CallGlow from "../../assets/img/shared/677a9.svg";
import ButtonArrow from "../../assets/img/shared/e23f5.svg";
import WhatsappRim from "../../assets/img/shared/48aa2.svg";
import WhatsappGlow from "../../assets/img/shared/be393.svg";
import WhatsappIcon from "../../assets/img/shared/75bd3.svg";

const MvpConnect = () => (
  <section className="mvp-connect" aria-labelledby="mvp-connect-heading">
    <h2 id="mvp-connect-heading" data-reveal>Have an Idea?<br />Let’s turn it into a market-ready MVP</h2>
    <div className="mvp-connect-feature" data-reveal>
      <div className="mvp-connect-copy">
        <p className="mvp-connect-eyebrow">Connect with us</p>
        <p className="mvp-connect-statement">Ideas are easy,<br />Execution wins. Let’s build yours.</p>
      </div>
      <a className="mvp-start-project" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" aria-label="Let's start your project — book a discovery call">
        <span className="mvp-start-circle" aria-hidden="true"><img src={OrbBackground} alt="" loading="lazy" /></span>
        <span className="mvp-start-arrow"><span><img src={OrbArrow} alt="" loading="lazy" /></span></span>
        <span className="mvp-start-label">Let’s start<br />your project</span>
      </a>
    </div>
    <div className="mvp-connect-actions" data-reveal>
      <p>Connect with us</p>
      <div className="mvp-connect-buttons">
        <a className="mvp-contact-pill mvp-contact-pill--call" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          <img className="mvp-pill-border" src={CallRim} alt="" loading="lazy" /><span className="mvp-pill-glow"><img src={CallGlow} alt="" loading="lazy" /></span>
          <span className="mvp-pill-content"><span>Book a free call</span><span className="mvp-pill-arrow"><span><img src={ButtonArrow} alt="" loading="lazy" /></span></span></span>
        </a>
        <a className="mvp-contact-pill mvp-contact-pill--whatsapp" href="https://wa.me/919958844094" target="_blank" rel="noopener noreferrer">
          <img className="mvp-pill-border" src={WhatsappRim} alt="" loading="lazy" /><span className="mvp-pill-glow"><img src={WhatsappGlow} alt="" loading="lazy" /></span>
          <span className="mvp-pill-content"><span>Whatsapp</span><img src={WhatsappIcon} alt="" loading="lazy" /></span>
        </a>
      </div>
    </div>
  </section>
);

export default MvpConnect;
