import TopGlowCenter from "../../assets/img/home/1f05b.svg";
import TopGlowSide from "../../assets/img/services/f56d7-9984.svg";
import HeroSideGlow from "../../assets/img/home/a190f.svg";
import ServicesGlow from "../../assets/img/home/f91ac.svg";
import MvpGlow from "../../assets/img/home/a190f-mvp-glow.svg";
import MvpGlowRotated from "../../assets/img/home/72dc1.svg";

// Glow positions are authored against the 1440px Figma frame.
const glows = [
  { src: TopGlowCenter, x: 115.625, y: -786.5, width: 1307, height: 1307.5, inset: "-9.56%", centered: true },
  { src: TopGlowSide, x: -168, y: -512, width: 627, inset: "-32.3%", fromCenter: true },
  { src: TopGlowSide, x: 980.5, y: -538, width: 627, inset: "-32.3%", fromCenter: true },
  { src: HeroSideGlow, x: 1241, y: 796, width: 1254, inset: "-32.3%" },
  { src: HeroSideGlow, x: -1056, y: 848, width: 1254, inset: "-32.3%" },
  { src: ServicesGlow, x: -509, y: 3610, width: 627, inset: "-36.27%" },
  { src: ServicesGlow, x: 1321, y: 3584, width: 627, inset: "-36.27%" },
  { src: MvpGlow, x: -1050, y: 6134, width: 1254, inset: "-32.3%" },
  { src: MvpGlowRotated, x: 1035, y: 6049, width: 1046, height: 564, inset: "-71.81% -38.72%", rotate: true },
];

const HomeBackdrops = () => (
  <div className="hh-background" aria-hidden="true">
    <div className="hh-glow-core" />
    {glows.map(({ src, x, y, width, height = width, inset, rotate, centered, fromCenter }) => (
      <div key={`${x}-${y}`} className={`hh-glow${rotate ? " hh-glow-rotated" : ""}`} style={{ left: centered ? `calc(50% - ${width / 2}px)` : fromCenter ? `calc(50% + ${x - 720}px)` : x, top: y, width, height }}>
        <div style={{ inset }}><img alt="" src={src} /></div>
      </div>
    ))}
  </div>
);

export default HomeBackdrops;
