import TopGlow from "../../assets/img/mvp/1617b.svg";
import SideGlow from "../../assets/img/services/a190f.svg";
import MiddleGlow from "../../assets/img/services/5adc7.svg";
import LongGlow from "../../assets/img/mvp/e4c77.svg";

const MvpBackdrops = () => (
  <div className="mvp-atmosphere" aria-hidden="true">
    <div className="mvp-hero-arch"><div className="mvp-hero-arch__haze"></div><div className="mvp-hero-arch__rim"></div></div>
    <img className="mvp-ambient-top--left" src={TopGlow} alt="" />
    <img className="mvp-ambient-top--right" src={TopGlow} alt="" />
    <img className="mvp-ambient-first--left" src={SideGlow} alt="" />
    <img className="mvp-ambient-first--right" src={SideGlow} alt="" />
    <img className="mvp-ambient-middle--left" src={SideGlow} alt="" />
    <img className="mvp-ambient-middle--right" src={MiddleGlow} alt="" />
    <img className="mvp-ambient-long--right" src={LongGlow} alt="" />
    <img className="mvp-ambient-long--left" src={LongGlow} alt="" />
  </div>
);

export default MvpBackdrops;
