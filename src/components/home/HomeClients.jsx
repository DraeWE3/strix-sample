import TrustIcon from "../../assets/img/about/fc732.svg";
import RyvonLogo from "../../assets/img/home/7bf71.svg";
import StructlyIcon from "../../assets/img/home/7e4c3.svg";
import AxisSymbol from "../../assets/img/about/b398e.png";
import AxisWordmark from "../../assets/img/about/510e6.png";
import RunloopLogo from "../../assets/img/home/2114e.svg";
import RunloopMask from "../../assets/img/about/d6469.svg";
import WurkzenLogo from "../../assets/img/home/611b3.svg";
import AbhiwanMaskA from "../../assets/img/about/6a440.svg";
import AbhiwanMaskB from "../../assets/img/about/643ac.svg";
import AbhiwanMaskC from "../../assets/img/about/b4f02.svg";

const abhiwanMask = [AbhiwanMaskA, AbhiwanMaskB, AbhiwanMaskC, AbhiwanMaskC].map((src) => `url("${src}")`).join(",");

const HomeClients = () => (
  <section className="hh-clients" aria-label="Selected clients" data-reveal>
    <p className="hh-clients-label"><img alt="" src={TrustIcon} />Trusted by growing companies worldwide</p>
    <div className="hh-client-scroll" tabIndex={0} aria-label="Client logos — scroll horizontally to see all clients">
      <div className="hh-client-track">
        <img className="hh-logo-ryvon" src={RyvonLogo} alt="Ryvon" />
        <span className="hh-logo-structly"><img src={StructlyIcon} alt="" />Structly</span>
        <span className="hh-logo-axis"><img src={AxisSymbol} alt="" /><img src={AxisWordmark} alt="Axis Bank" /></span>
        <span className="hh-logo-runloop" style={{ maskImage: `url("${RunloopMask}")` }}><img src={RunloopLogo} alt="Runloop" /></span>
        <img className="hh-logo-wurkzen" src={WurkzenLogo} alt="Würkzen" />
        <span className="hh-logo-locovo">LOCOVO</span>
        <span className="hh-logo-abhiwan" role="img" aria-label="Abhiwan"><span style={{ maskImage: abhiwanMask }} /></span>
      </div>
    </div>
  </section>
);

export default HomeClients;
