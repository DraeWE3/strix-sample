import CallButtonRim from "../../assets/img/about/6d4be.svg";
import CallLightGlow from "../../assets/img/about/677a9.svg";
import ButtonArrow from "../../assets/img/about/e23f5.svg";
import WhatsappButtonRim from "../../assets/img/about/48aa2.svg";
import WhatsappLightGlow from "../../assets/img/about/be393.svg";
import WhatsappIcon from "../../assets/img/about/75bd3.svg";

const AboutConversation = () => {
  return (
    <section className="about-content-width about-conversation" id="start-a-conversation" aria-labelledby="about-conversation-heading">
      <h2 id="about-conversation-heading" data-reveal>Let&rsquo;s build<br />what&rsquo;s next.</h2>
      <p className="about-conversation-description" data-reveal>
        Have an idea, a product to improve or a launch ahead? <br />
        Tell us where you want to go. We&rsquo;ll help define the next step.
      </p>
      <div className="about-connect" data-reveal>
        <p>Connect with us</p>
        <div className="about-connect-actions">
          <a
            className="glow-button about-call-button"
            href="https://calendly.com/strix-ryvon/raj-consultation"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="about-button-art" aria-hidden="true">
              <img className="about-button-rim" src={CallButtonRim} alt="" />
              <span className="about-button-light about-call-light"><img src={CallLightGlow} alt="" /></span>
            </span>
            <span className="about-button-label">
              Book a free call <img className="about-button-arrow" src={ButtonArrow} alt="" />
            </span>
          </a>
          <a
            className="glow-button about-whatsapp"
            href="https://wa.me/919958844094"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="about-button-art" aria-hidden="true">
              <img className="about-button-rim" src={WhatsappButtonRim} alt="" />
              <span className="about-button-light about-whatsapp-light"><img src={WhatsappLightGlow} alt="" /></span>
            </span>
            <span className="about-button-label">
              Whatsapp <img className="about-whatsapp-icon" src={WhatsappIcon} alt="" />
            </span>
          </a>
        </div>
      </div>
      <p className="about-conversation-caption" data-reveal>20 minutes &middot; Your goals, timeline and fit &middot; No obligation</p>
    </section>
  );
};

export default AboutConversation;
