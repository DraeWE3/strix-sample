import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../style/fonts.css";
import "../style/nav-mega.css";
import CoinVideo from "../assets/img/home/coin-video.webm";
import UiuxIcon from "../assets/img/layout/de61c.svg";
import UiuxTexture from "../assets/img/layout/3fc46.png";
import ProductIcon from "../assets/img/layout/743ca.svg";
import ProductTexture from "../assets/img/layout/b8641.png";
import ThreeDDesignIcon from "../assets/img/layout/dad6f.svg";
import ThreeDDesignTexture from "../assets/img/layout/f12e4.png";
import WebAppIcon from "../assets/img/layout/824e1.svg";
import WarmTexture from "../assets/img/layout/98437.png";
import WebDevIcon from "../assets/img/layout/bc8da.svg";
import WebDevTexture from "../assets/img/layout/29890.png";
import AppDevIcon from "../assets/img/layout/d0d8b.svg";
import AppDevTexture from "../assets/img/layout/12f63.png";
import CommercialsIcon from "../assets/img/layout/cb129.svg";
import ThreeDAnimationIcon from "../assets/img/layout/f9cb5.svg";
import ThreeDAnimationTexture from "../assets/img/layout/714a0.png";
import LongFormIcon from "../assets/img/layout/0913d.svg";
import LongFormTexture from "../assets/img/layout/c9123.png";
import BuildGlowOne from "../assets/img/layout/19e43.svg";
import BuildGlowTwo from "../assets/img/layout/b8011.svg";
import BookRim from "../assets/img/layout/12700.svg";
import BookMask from "../assets/img/layout/7e551.svg";
import BookGlow from "../assets/img/layout/f5ece.svg";
import BookArrow from "../assets/img/layout/69bdd.svg";
import MvpIcon from "../assets/img/layout/4adcd.svg";
import RedesignStar from "../assets/img/layout/a48fa.svg";
import RedesignChart from "../assets/img/layout/52ec0.svg";
import RedesignControls from "../assets/img/layout/33905.svg";
import RedesignPointer from "../assets/img/layout/73e8a.svg";
import ProductionPerson from "../assets/img/layout/63c66.svg";
import TitleArrow from "../assets/img/layout/03b11.svg";
import ActionArrow from "../assets/img/layout/7dc9b.svg";

export const NAV_SERVICES_PANEL_ID = "nav-services-panel";

const serviceGroups = [
  { name: "Design", tone: "design", items: [
    { title: "UI/UX Design", description: "Web & Mobile App Design", href: "/uiux", icon: UiuxIcon, iconKey: "de61c", texture: UiuxTexture },
    { title: "Product Design", description: "Digital Product, SaaS, Dashboards", href: "/product", icon: ProductIcon, iconKey: "743ca", texture: ProductTexture },
    { title: "3D Design", description: "3D Product renders, 3D Real estate", href: "/threed", icon: ThreeDDesignIcon, iconKey: "dad6f", texture: ThreeDDesignTexture },
  ] },
  { name: "Development", tone: "development", items: [
    { title: "Web Applications", description: "Custom AI Development", href: "/webapp", icon: WebAppIcon, iconKey: "824e1", texture: WarmTexture },
    { title: "Website Development", description: "Front-End & Back-End Development", href: "/webdev", icon: WebDevIcon, iconKey: "bc8da", texture: WebDevTexture },
    { title: "Mobile App Development", description: "IOS, Android, Cross-platform", href: "/appdev", icon: AppDevIcon, iconKey: "d0d8b", texture: AppDevTexture },
  ] },
  { name: "Production", tone: "production", items: [
    { title: "Commercials", description: "Product promos, ads, teasers", href: "/commercials", icon: CommercialsIcon, iconKey: "cb129", texture: WarmTexture },
    { title: "3D Animations", description: "Pixar level visuals and rendering", href: "/threed", icon: ThreeDAnimationIcon, iconKey: "f9cb5", texture: ThreeDAnimationTexture },
    { title: "Long Format Videos", description: "Vlogs, Documentaries, Podcasts etc.", href: "/longform", icon: LongFormIcon, iconKey: "0913d", texture: LongFormTexture },
  ] },
];

const solutions = [
  { title: "MVP SPRINT", audience: "For startups & SaaS", description: "Design, build & launch your product in 4 weeks.", action: "Build your MVP", href: "/mvp", icon: "mvp" },
  { title: "PRODUCT REDESIGN", audience: "For existing companies", description: "Redesign your UX, improve conversion, ship faster.", action: "Start a redesign", href: "/contact", icon: "redesign" },
  { title: "PRODUCTION PACK", audience: "For brands", description: "High-impact video, 3D & motion content that converts.", action: "See production work", href: "/works", icon: "production" },
];

const SolutionIcon = ({ type }) => (
  <span className={`nav-mega__solution-icon nav-mega__solution-icon--${type}`} aria-hidden="true">
    {type === "mvp" && <img className="nav-mega__mvp-icon" src={MvpIcon} alt="" />}
    {type === "redesign" && (
      <>
        <img className="nav-mega__redesign-star" src={RedesignStar} alt="" />
        <span className="nav-mega__redesign-window" />
        <img className="nav-mega__redesign-chart" src={RedesignChart} alt="" />
        <img className="nav-mega__redesign-controls" src={RedesignControls} alt="" />
        <img className="nav-mega__redesign-pointer" src={RedesignPointer} alt="" />
      </>
    )}
    {type === "production" && (
      <>
        <span className="nav-mega__bar nav-mega__bar--one" />
        <span className="nav-mega__bar nav-mega__bar--two" />
        <span className="nav-mega__bar nav-mega__bar--three" />
        <img className="nav-mega__production-person" src={ProductionPerson} alt="" />
      </>
    )}
  </span>
);

const NavServicesPanel = ({ onNavigate, onPointerEnter, onPointerLeave }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => {
      if (motionPreference.matches) videoRef.current.pause();
      else videoRef.current.play().catch(() => {});
    };
    applyPreference();
    motionPreference.addEventListener("change", applyPreference);
    return () => motionPreference.removeEventListener("change", applyPreference);
  }, []);

  return (
    <div
      className="nav-mega"
      id={NAV_SERVICES_PANEL_ID}
      role="region"
      aria-label="Services"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <p className="nav-mega__eyebrow"><span aria-hidden="true" />Services</p>
      <div className="nav-mega__body">
        <div className="nav-mega__top">
          {serviceGroups.map((group) => (
            <section className={`nav-mega__group nav-mega__group--${group.tone}`} key={group.name} aria-label={group.name}>
              <h3><span aria-hidden="true">▪</span>{group.name}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item.title}>
                    <Link className="nav-mega__service" to={item.href} onClick={onNavigate}>
                      <span className={`nav-mega__service-icon nav-mega__service-icon--${item.iconKey}`} aria-hidden="true"><img src={item.icon} alt="" /></span>
                      <span className="nav-mega__service-copy">
                        <span className="nav-mega__service-title" style={{ backgroundImage: `url("${item.texture}")` }}>{item.title}</span>
                        <span className="nav-mega__service-description">{item.description}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <aside className="nav-mega__build">
            <img className="nav-mega__build-glow nav-mega__build-glow--one" src={BuildGlowOne} alt="" />
            <img className="nav-mega__build-glow nav-mega__build-glow--two" src={BuildGlowTwo} alt="" />
            <p className="nav-mega__build-eyebrow">Ready to build</p>
            <h3>Let’s build something powerful.</h3>
            <video ref={videoRef} className="nav-mega__coin" src={CoinVideo} muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
            <div className="nav-mega__book">
              <p>Book a free call and let’s bring<br />your vision to life.</p>
              <Link to="/contact" className="nav-mega__book-button" onClick={onNavigate}>
                <img className="nav-mega__book-rim" src={BookRim} alt="" />
                <span className="nav-mega__book-glow-mask" aria-hidden="true" style={{ maskImage: `url("${BookMask}")`, WebkitMaskImage: `url("${BookMask}")` }}>
                  <img src={BookGlow} alt="" />
                </span>
                <span>Book a free call</span>
                <span className="nav-mega__book-arrow" aria-hidden="true"><img src={BookArrow} alt="" /></span>
              </Link>
            </div>
            <p className="nav-mega__build-proof">100% JSS · 5.0 ★ · 200+ Projects</p>
          </aside>
        </div>
        <Link to="/services" className="nav-mega__explore" onClick={onNavigate}>↓ Explore all services</Link>
        <div className="nav-mega__solutions">
          <p className="nav-mega__eyebrow"><span aria-hidden="true" />Solutions</p>
          <div className="nav-mega__solution-grid">
            {solutions.map((solution) => (
              <Link className="nav-mega__solution" to={solution.href} onClick={onNavigate} key={solution.title}>
                <SolutionIcon type={solution.icon} />
                <span className="nav-mega__solution-copy">
                  <span className="nav-mega__solution-title">{solution.title}<img src={TitleArrow} alt="" /></span>
                  <span className="nav-mega__solution-audience">{solution.audience}</span>
                  <span className="nav-mega__solution-description">{solution.description}</span>
                  <span className="nav-mega__solution-action">{solution.action}<img src={ActionArrow} alt="" /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavServicesPanel;
