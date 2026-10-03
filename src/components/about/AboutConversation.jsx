import Button from "../Button";
import WhatsappIcon from "../../assets/img/shared/75bd3.svg";

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
          <Button className="about-call-button"
            href="https://calendly.com/strix-ryvon/raj-consultation"
            target="_blank"
            rel="noopener noreferrer"
           arrow>Book a free call</Button>
          <Button className="about-whatsapp"
            href="https://wa.me/919958844094"
            target="_blank"
            rel="noopener noreferrer"
           icon={WhatsappIcon}>Whatsapp</Button>
        </div>
      </div>
      <p className="about-conversation-caption" data-reveal>20 minutes &middot; Your goals, timeline and fit &middot; No obligation</p>
    </section>
  );
};

export default AboutConversation;
