import { useState } from "react";
import Button from "../Button";
import PlayIcon from "../../assets/img/home/8e563.svg";
import TopRatedIcon from "../../assets/img/home/05559.png";
import MvpsIcon from "../../assets/img/home/ba708.png";
import FundsIcon from "../../assets/img/home/eaf84.png";
import YearsIcon from "../../assets/img/home/488f4.png";
import { SHOWREEL_ID } from "../showreel";
import SuccessIcon from "../../assets/img/shared/9eacb.png";

const badges = [
  { icon: TopRatedIcon, label: "Top Rated", key: "top-rated", size: [196, 214] },
  { icon: MvpsIcon, label: "10+ MVPs", key: "mvps", size: [1024, 1024] },
  { icon: FundsIcon, label: "$1M+ Funds raised by our clients", key: "funds", size: [1024, 1024] },
  { icon: YearsIcon, label: "3+ Years", key: "years", size: [1024, 1024] },
  { icon: SuccessIcon, label: "100% Job Success", key: "success", size: [306, 318] },
];


const HomeHeroMedia = ({ style }) => {
  const [playing, setPlaying] = useState(false);
  return (
  <div className="hh-hero-media" data-reveal style={style}>
    {playing ? (
      <div className="hh-showreel">
        <iframe
          className="hh-showreel-frame"
          src={`https://www.youtube.com/embed/${SHOWREEL_ID}?autoplay=1&rel=0`}
          title="Strix showreel"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    ) : (
      <button type="button" className="hh-showreel" onClick={() => setPlaying(true)} aria-label="Play the Strix showreel">
        <img className="hh-showreel-poster" src={`https://i.ytimg.com/vi/${SHOWREEL_ID}/maxresdefault.jpg`} alt="Strix showreel" width="1280" height="720" loading="lazy" decoding="async" />
        <img className="hh-showreel-play" src={PlayIcon} alt="" width="51" height="58" />
      </button>
    )}
    <p className="hh-media-copy">
      One studio for every layer of your product — brand, code, and production.
      <br className="hh-desktop-break" /> No separate agencies. No coordination chaos.
    </p>
    <ul className="hh-proof" aria-label="Studio credentials">
      {badges.map(({ icon, label, key, size: [width, height] }) => (
        <li key={key} className={`hh-proof-${key}`}>
          <span className="hh-proof-icon"><img alt="" src={icon} width={width} height={height} loading="lazy" decoding="async" /></span>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  </div>
  );
};

const HomeHero = () => (
  <section className="hh-hero" aria-label="Strix Production — AI product studio">
    <div className="hh-wordmark" aria-hidden="true">STRIX</div>
    <p className="hh-tagline">The AI product studio you need</p>
    <div className="hh-intro" data-reveal>
      <h1>Design, Development, Production - From Start to Ship</h1>
      <p>
        We work with tech &amp; SaaS companies go from idea to market-ready product — without
        <br className="hh-desktop-break" /> the chaos of managing five different vendors.
      </p>
      <div className="hh-actions">
        <Button to="/mvp" arrow>Build MVP</Button>
        <Button to="/works">Explore Work</Button>
      </div>
    </div>
    <HomeHeroMedia />
  </section>
);

export { HomeHeroMedia };
export default HomeHero;
