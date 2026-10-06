import { Link } from "react-router-dom";
import Button from "../Button";
import { BOOKING_URL } from "./mvpCases";
import OrbBackground from "../../assets/img/services/4b4d2.svg";
import OrbArrow from "../../assets/img/services/98325.svg";
import WhatsappIcon from "../../assets/img/shared/75bd3.svg";

const MvpConnect = () => (
  <section className="mvp-connect" aria-labelledby="mvp-connect-heading">
    <h2 id="mvp-connect-heading" data-reveal>Have an Idea?<br />Let’s turn it into a market-ready MVP</h2>
    <div className="mvp-connect-feature" data-reveal>
      <div className="mvp-connect-copy">
        <p className="mvp-connect-eyebrow">Connect with us</p>
        <p className="mvp-connect-statement">Ideas are easy,<br />Execution wins. Let’s build yours.</p>
      </div>
      <Link className="mvp-start-project" to="/contact" aria-label="Let's start your project — contact us">
        <span className="mvp-start-circle" aria-hidden="true"><img src={OrbBackground} alt="" loading="lazy" /></span>
        <span className="mvp-start-arrow"><span><img src={OrbArrow} alt="" loading="lazy" /></span></span>
        <span className="mvp-start-label">Let’s start<br />your project</span>
      </Link>
    </div>
    <div className="mvp-connect-actions" data-reveal>
      <p>Connect with us</p>
      <div className="mvp-connect-buttons">
        <Button className="mvp-contact-pill--call" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" arrow>Book a free call</Button>
        <Button className="mvp-contact-pill--whatsapp" href="https://wa.me/919958844094" target="_blank" rel="noopener noreferrer" icon={WhatsappIcon}>Whatsapp</Button>
      </div>
    </div>
  </section>
);

export default MvpConnect;
