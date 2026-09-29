import TrustPillIcon from "../../assets/img/about/fc732.svg";
import RyvonLogo from "../../assets/img/about/7bf71.svg";
import StructlyIcon from "../../assets/img/about/f5e1c.svg";
import AxisSymbol from "../../assets/img/about/b398e.png";
import AxisWordmark from "../../assets/img/about/510e6.png";
import RunloopLogo from "../../assets/img/about/510c7.svg";
import WurkzenLogo from "../../assets/img/about/eeca3.svg";

const AboutClients = () => {
  return (
    <section className="about-clients" aria-label="Our clients">
      <p className="about-client-trust-pill" data-reveal>
        <img src={TrustPillIcon} width="13" height="13" alt="" />
        Trusted by growing companies worldwide
      </p>
      <div className="about-client-wall-viewport">
        <div
          className="about-client-wall-track"
          aria-label="Ryvon, Structly, Axis Bank, Runloop, Würkzen, Locovo and Abhiwan"
        >
          <div className="about-client-logo">
            <img src={RyvonLogo} width="177.23" height="25" alt="Ryvon" />
          </div>
          <div className="about-client-logo about-client-structly">
            <span className="about-client-building">
              <img src={StructlyIcon} width="25.0833" height="25.0832" alt="" />
            </span>
            <span>Structly</span>
          </div>
          <div className="about-client-logo about-client-axis" role="img" aria-label="Axis Bank">
            <img className="about-client-axis-symbol" src={AxisSymbol} width="31" height="28" alt="" />
            <img className="about-client-axis-wordmark" src={AxisWordmark} width="119" height="28" alt="" />
          </div>
          <div className="about-client-logo">
            <img className="about-client-runloop" src={RunloopLogo} width="172.001" height="28" alt="Runloop" />
          </div>
          <div className="about-client-logo">
            <img className="about-client-wurkzen" src={WurkzenLogo} width="145" height="28.0018" alt="Würkzen" />
          </div>
          <div className="about-client-logo about-client-locovo">LOCOVO</div>
          <div className="about-client-logo about-client-abhiwan" role="img" aria-label="Abhiwan">
            <span className="about-client-abhiwan-shape"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutClients;
