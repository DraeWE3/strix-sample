import { Link } from "react-router-dom";
import { GlassButton } from "./HomeButtons";
import OrbBackground from "../../assets/img/services/4b4d2.svg";
import OrbArrow from "../../assets/img/services/98325.svg";
import CallRim from "../../assets/img/home/6d4be.svg";
import CallMask from "../../assets/img/shared/945b0.svg";
import CallGlow from "../../assets/img/home/677a9.svg";
import ButtonArrow from "../../assets/img/home/e23f5.svg";
import WhatsappRim from "../../assets/img/home/48aa2.svg";
import WhatsappMask from "../../assets/img/shared/c426c.svg";
import WhatsappGlow from "../../assets/img/home/be393.svg";
import WhatsappIcon from "../../assets/img/home/75bd3.svg";

const HomeContact = () => (
  <section className="hl-contact" id="start-project" aria-labelledby="hl-contact-title">
    <h2 id="hl-contact-title" data-reveal><span>Tell us what you’re building.<br />We’ll handle the rest.</span></h2>
    <div className="hl-contact-prompt">
      <div className="hl-contact-copy">
        <p className="hl-contact-kicker">Leave a request</p>
        <p className="hl-contact-statement"><span>We’d love to be challenged by you!<br />Feel free to share your brief with us</span></p>
      </div>
      <Link to="/contact" className="hl-project-orb" aria-label="Let’s start your project">
        <img className="hl-project-orb-bg" src={OrbBackground} alt="" draggable="false" />
        <img className="hl-project-orb-arrow" src={OrbArrow} alt="" draggable="false" />
        <span>Let’s start your project</span>
      </Link>
    </div>
    <div className="hl-contact-actions">
      <p>Connect with us</p>
      <div className="hl-contact-buttons">
        <GlassButton
          href="https://calendly.com/strix-ryvon/raj-consultation"
          className="hl-call-button"
          skin={{ rim: CallRim, mask: CallMask, glow: CallGlow }}
          icon={ButtonArrow}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a free call
        </GlassButton>
        <GlassButton
          href="https://wa.me/919958844094"
          className="hl-whatsapp-button"
          skin={{ rim: WhatsappRim, mask: WhatsappMask, glow: WhatsappGlow }}
          icon={WhatsappIcon}
          iconClassName="hl-whatsapp-icon"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Strix on WhatsApp"
        >
          Whatsapp
        </GlassButton>
      </div>
    </div>
  </section>
);

export default HomeContact;
