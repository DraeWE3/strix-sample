import GlowTop from "../../assets/img/service-pages/figma/73bb6.svg";
import GlowSide from "../../assets/img/service-pages/figma/a190f.svg";
import GlowRight from "../../assets/img/service-pages/figma/72dc1.svg";

const ServiceDetailBackdrops = () => (
  <div className="service-background" aria-hidden="true">
    <img className="service-glow service-glow--top-left" src={GlowTop} alt="" />
    <img className="service-glow service-glow--top-right" src={GlowTop} alt="" />
    <img className="service-glow service-glow--provide-left" src={GlowSide} alt="" />
    <img className="service-glow service-glow--provide-right" src={GlowSide} alt="" />
    <img className="service-glow service-glow--left" src={GlowSide} alt="" />
    <span className="service-glow--right"><img src={GlowRight} alt="" /></span>
    <img className="service-glow service-glow--left2" src={GlowSide} alt="" />
    <span className="service-glow--right2"><img src={GlowRight} alt="" /></span>
  </div>
);

export default ServiceDetailBackdrops;
