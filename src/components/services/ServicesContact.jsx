import { Link } from "react-router-dom";
import OrbBackground from "../../assets/img/services/4b4d2.svg";
import OrbArrow from "../../assets/img/services/98325.svg";
import CallButtonRim from "../../assets/img/shared/6d4be.svg";
import CallLightGlow from "../../assets/img/shared/677a9.svg";
import ButtonArrow from "../../assets/img/shared/e23f5.svg";
import WhatsappButtonRim from "../../assets/img/shared/48aa2.svg";
import WhatsappLightGlow from "../../assets/img/shared/be393.svg";
import WhatsappIcon from "../../assets/img/shared/75bd3.svg";

const ServicesContact = () => {
  return (
    <section className="services-contact" id="contact" aria-labelledby="services-contact-title">
      <h2 id="services-contact-title" data-reveal>Have a project in mind?</h2>
      <div className="services-contact-prompt" data-reveal>
        <div className="services-contact-copy">
          <p className="services-contact-kicker">Connect with us</p>
          <p className="services-contact-statement">Book a free 20-minute call.</p>
        </div>
        <Link className="services-project-orb" to="/contact" aria-label="Let’s start your project">
          <img className="services-project-orb-bg" src={OrbBackground} alt="" />
          <img className="services-project-orb-arrow" src={OrbArrow} alt="" />
          <span>Let&rsquo;s start your project</span>
        </Link>
      </div>
      <div className="services-contact-actions" data-reveal>
        <p>Connect with us</p>
        <div className="services-contact-buttons">
          <a
            className="glow-button lower-glow-button services-call-button"
            href="https://calendly.com/strix-ryvon/raj-consultation"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="lower-button-art" aria-hidden="true">
              <img className="lower-button-rim" src={CallButtonRim} alt="" />
              <span className="lower-button-light services-call-light"><img src={CallLightGlow} alt="" /></span>
            </span>
            <span className="lower-button-label">Book a free call <img className="lower-button-arrow" src={ButtonArrow} alt="" /></span>
          </a>
          <a
            className="glow-button lower-glow-button services-whatsapp-button"
            href="https://wa.me/919958844094"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="lower-button-art" aria-hidden="true">
              <img className="lower-button-rim" src={WhatsappButtonRim} alt="" />
              <span className="lower-button-light services-whatsapp-light"><img src={WhatsappLightGlow} alt="" /></span>
            </span>
            <span className="lower-button-label">Whatsapp <img className="lower-whatsapp-icon" src={WhatsappIcon} alt="" /></span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesContact;
