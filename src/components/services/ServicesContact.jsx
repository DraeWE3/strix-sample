import Button from "../Button";
import { Link } from "react-router-dom";
import OrbBackground from "../../assets/img/services/4b4d2.svg";
import OrbArrow from "../../assets/img/services/98325.svg";
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
          <Button className="services-call-button"
            href="https://calendly.com/strix-ryvon/raj-consultation"
            target="_blank"
            rel="noopener noreferrer"
           arrow>Book a free call</Button>
          <Button className="services-whatsapp-button"
            href="https://wa.me/919958844094"
            target="_blank"
            rel="noopener noreferrer"
           icon={WhatsappIcon}>Whatsapp</Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesContact;
