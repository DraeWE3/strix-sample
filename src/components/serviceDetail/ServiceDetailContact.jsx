import { Link } from "react-router-dom";
import OrbBackground from "../../assets/img/service-pages/figma/4b4d2.svg";
import OrbArrow from "../../assets/img/service-pages/figma/98325.svg";
import AppointmentRim from "../../assets/img/service-pages/figma/277a9.svg";
import AppointmentLight from "../../assets/img/service-pages/figma/ff487.svg";
import AppointmentArrow from "../../assets/img/service-pages/figma/e23f5.svg";

export const BOOKING_URL = "https://calendly.com/strix-ryvon/raj-consultation";

// Both closing sections ship; data-cta-mode on the shell decides which one is visible.
const ServiceDetailContact = () => (
  <>
    <section className="ds-project-contact" id="start-project" aria-labelledby="ds-project-contact-heading">
      <h2 data-reveal id="ds-project-contact-heading">Have a project that deserves attention ?</h2>
      <div className="ds-contact-prompt">
        <div className="ds-contact-copy">
          <p className="ds-contact-kicker">Leave a request</p>
          <p className="ds-contact-statement">We’d love to be challenged by you!<br />Feel free to share your brief with us</p>
        </div>
        <Link className="ds-project-orb" to="/contact" aria-label="Let’s start your project">
          <img className="ds-project-orb-bg" src={OrbBackground} alt="" loading="lazy" />
          <img className="ds-project-orb-arrow" src={OrbArrow} alt="" loading="lazy" />
          <span>Let’s start your project</span>
        </Link>
      </div>
      <a className="ds-lower-button ds-appointment" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
        <span className="ds-button-art" aria-hidden="true">
          <img className="ds-button-rim" src={AppointmentRim} alt="" loading="lazy" />
          <span className="ds-button-light"><img src={AppointmentLight} alt="" loading="lazy" /></span>
        </span>
        <span className="ds-button-label">Book Appointment<img className="ds-button-arrow" src={AppointmentArrow} alt="" loading="lazy" /></span>
      </a>
    </section>
    <section className="ds-call-contact" aria-labelledby="ds-call-contact-heading">
      <h2 data-reveal id="ds-call-contact-heading">Join 100+ Experts Taking Their Brand to the Next Level</h2>
      <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a call</a>
    </section>
  </>
);

export default ServiceDetailContact;
