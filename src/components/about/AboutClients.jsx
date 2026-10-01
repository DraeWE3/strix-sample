import TrustPillIcon from "../../assets/img/about/fc732.svg";
import LogoLoop from "../Loop";

const AboutClients = ({ showPill = true }) => {
  return (
    <section className="about-clients" aria-label="Our clients">
      {showPill && (
        <p className="about-client-trust-pill" data-reveal>
          <img src={TrustPillIcon} width="13" height="13" alt="" />
          Trusted by growing companies worldwide
        </p>
      )}
      <LogoLoop />
    </section>
  );
};

export default AboutClients;
