import CorporateSite from "../../assets/img/service-pages/figma/dcf01.png";
import MobileAppA from "../../assets/img/service-pages/figma/9002c.png";
import MobileAppB from "../../assets/img/service-pages/figma/6e3dc.png";
import LandingA from "../../assets/img/service-pages/figma/ef264.png";
import LandingB from "../../assets/img/service-pages/figma/5b4d6.png";
import StoreScreen from "../../assets/img/service-pages/figma/69287.png";
import MacShadow from "../../assets/img/service-pages/figma/71ed9.svg";
import MacBottom from "../../assets/img/service-pages/figma/ede86.svg";
import SaasScreens from "../../assets/img/service-pages/figma/bfa65.png";
import DashboardScreen from "../../assets/img/service-pages/figma/e4e97.png";
import EnterpriseIcon from "../../assets/img/service-pages/figma/019b2.png";
import UserFlowsArt from "../../assets/img/service-pages/figma/a0023.png";
import PitchDeckArt from "../../assets/img/service-pages/figma/29249.png";
import SocialMediaArt from "../../assets/img/service-pages/figma/c9643.png";
import PosterRight from "../../assets/img/service-pages/figma/c5f58.png";
import PosterLeft from "../../assets/img/service-pages/figma/d6a86.png";
import PosterHanger from "../../assets/img/service-pages/figma/ca037.png";
import IllustrationArt from "../../assets/img/service-pages/figma/objects-3350-5958.png";
import ArcovaMark from "../../assets/img/service-pages/figma/d491d.png";
import MeasureArrowUp from "../../assets/img/service-pages/figma/9c2aa.svg";
import MeasureArrowDown from "../../assets/img/service-pages/figma/47277.svg";
import BrandKitArt from "../../assets/img/service-pages/figma/3098d.png";
import TechouseShowcase from "../../assets/img/service-pages/figma/6519c.png";
import PackagingLarge from "../../assets/img/service-pages/figma/77139.png";
import PackagingSmall from "../../assets/img/service-pages/figma/3236e.png";

// Per-card media for offer canvases that carry their own Figma composition instead of the single
// generic image slot. Coordinates are in the canvas's rotated 360 x 528.8 frame, exactly as Figma
// exports them: an outer box positioned in the frame, and an inner layer rotated inside it.
const abs = { position: "absolute" };
const fill = { ...abs, inset: 0, maxWidth: "none", width: "100%", height: "100%", pointerEvents: "none" };

const Layer = ({ box, inner, rotate = "90deg", children }) => (
  <div style={{ ...abs, display: "flex", alignItems: "center", justifyContent: "center", ...box }}>
    <div style={{ flex: "none", transform: `rotate(${rotate})` }}>
      <div style={{ position: "relative", ...inner }}>{children}</div>
    </div>
  </div>
);

const Img = ({ src, style }) => <img alt="" src={src} style={{ ...fill, objectFit: "cover", ...style }} loading="lazy" draggable={false} />;

// Image cropped inside its layer box, with Figma's percentage offsets.
const Crop = ({ src, crop }) => (
  <div style={{ ...abs, inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    <img alt="" src={src} style={{ ...abs, maxWidth: "none", ...crop }} loading="lazy" draggable={false} />
  </div>
);

const deviceShadow = (y, blur) => `0px ${y}px ${blur}px 0px rgba(0,0,0,0.8)`;

// 3346:5203 — Corporate & Business Websites
const UiuxCorporate = () => (
  <Layer box={{ height: "301px", left: "73.27px", top: "112.26px", width: "247.394px" }} inner={{ height: "247.394px", width: "301px", borderRadius: "10px" }}>
    <div style={{ ...abs, inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: "10px" }}>
      <img alt="" src={CorporateSite} style={{ ...abs, height: "443.77%", left: 0, maxWidth: "none", top: "-1.95%", width: "100%" }} loading="lazy" draggable={false} />
    </div>
  </Layer>
);

// 3346:5224 + 3346:5225 — Mobile Application Design
const UiuxMobile = () => (
  <>
    <Layer box={{ height: "254.025px", left: "calc(50% + 24.64px)", top: "193.26px", width: "264.724px", transform: "translateX(-50%)" }} inner={{ height: "154.523px", width: "215.175px" }} rotate="37.84deg">
      <Img src={MobileAppA} />
    </Layer>
    <Layer box={{ height: "97px", left: "75.66px", top: "154.26px", width: "240px" }} inner={{ height: "240px", width: "97px", boxShadow: deviceShadow(19, 26.6) }}>
      <Img src={MobileAppB} />
    </Layer>
  </>
);

// 3346:5246 + 3346:5247 — Landing Page Designs
const UiuxLanding = () => (
  <>
    <Layer box={{ height: "205.725px", left: "100.7px", top: "52.4px", width: "155.901px" }} inner={{ height: "155.901px", width: "205.725px", boxShadow: deviceShadow(8.818, 13.468) }}>
      <Img src={LandingA} />
    </Layer>
    <Layer box={{ height: "226.92px", left: "79px", top: "249.42px", width: "225px" }} inner={{ height: "225px", width: "226.92px", boxShadow: deviceShadow(8.818, 13.468) }}>
      <Img src={LandingB} />
    </Layer>
  </>
);

// 3346:5270 "Device - Macbook Air" + 3346:5283 screen — E-Commerce Designs
const UiuxEcommerce = () => (
  <>
    <Layer box={{ height: "320.423px", left: "85px", top: "104.01px", width: "3.541px" }} inner={{ height: "3.541px", width: "320.423px" }}>
      <div style={{ ...abs, inset: "-440% -4.86%" }}>
        <img alt="" src={MacShadow} className="figma-svg" style={{ display: "block", maxWidth: "none", width: "100%", height: "100%" }} loading="lazy" draggable={false} />
      </div>
    </Layer>
    <Layer box={{ height: "288.912px", left: "93.85px", top: "120.3px", width: "196.149px" }} inner={{ height: "196.149px", width: "288.912px", background: "#000", border: "0.708px solid #4a5568", borderRadius: "9.914px 9.914px 1.416px 1.416px" }} />
    <Layer box={{ height: "285.371px", left: "101.29px", top: "122.07px", width: "186.943px" }} inner={{ height: "186.943px", width: "285.371px", background: "#000", borderRadius: "7.789px 7.789px 0 0" }} />
    <Layer box={{ height: "269.439px", left: "109.08px", top: "129.5px", width: "169.24px" }} inner={{ height: "169.24px", width: "269.439px", background: "#fff" }} />
    <div style={{ ...abs, display: "flex", height: "28px", alignItems: "center", justifyContent: "center", left: "98.93px", top: "250.24px", width: "4px", transform: "translateX(-50%)", fontFamily: "Inter, sans-serif" }}>
      <p style={{ flex: "none", transform: "rotate(90deg)", fontWeight: 500, lineHeight: 0.9, margin: 0, color: "#a0aec0", fontSize: "4.603px", textAlign: "center", whiteSpace: "nowrap" }}>Macbook Air</p>
    </div>
    <Layer box={{ height: "356.891px", left: "88.89px", top: "85.6px", width: "6.374px" }} inner={{ height: "6.374px", width: "356.891px" }}>
      <img alt="" src={MacBottom} className="figma-svg" style={{ ...abs, display: "block", inset: 0, maxWidth: "none", width: "100%", height: "100%" }} loading="lazy" draggable={false} />
    </Layer>
    <Layer box={{ height: "269.439px", left: "109.08px", top: "129.5px", width: "169.24px" }} inner={{ height: "169.24px", width: "269.439px" }}>
      <Img src={StoreScreen} style={{ objectFit: "contain" }} />
    </Layer>
  </>
);

// 3346:5123 "1212 2" — SaaS Interfaces
const ProductSaas = () => (
  <Layer box={{ height: "458.651px", left: "calc(50% + 13.18px)", top: "31.75px", width: "404.08px", transform: "translateX(-50%)" }} inner={{ height: "295.013px", width: "383.28px" }} rotate="109.08deg">
    <Img src={SaasScreens} />
  </Layer>
);

// 3346:5142 — Dashboards
const ProductDashboards = () => (
  <Layer
    box={{ height: "349px", left: "calc(50% + 21.5px)", top: "89.06px", width: "203px", transform: "translateX(-50%)" }}
    inner={{ height: "203px", width: "349px", borderRadius: "10px", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25), 0px 2px 24.5px 0px rgba(255,255,255,0.25)" }}
  >
    <div style={{ ...abs, inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: "10px" }}>
      <img alt="" src={DashboardScreen} style={{ ...abs, height: "162.57%", left: "-11.46%", maxWidth: "none", top: "-37.97%", width: "127.6%" }} loading="lazy" draggable={false} />
    </div>
  </Layer>
);

// 3346:5134 — Enterprise Applications (stacked above the title in Figma)
const ProductEnterprise = () => (
  <Layer box={{ height: "293.438px", left: "76.66px", top: "116.62px", width: "244px", mixBlendMode: "difference" }} inner={{ height: "244px", width: "293.438px" }}>
    <Img src={EnterpriseIcon} />
  </Layer>
);

// 3346:5152 — User Flows & Wireframes (stacked above the title in Figma)
const ProductUserFlows = () => (
  <Layer box={{ height: "365px", left: "76.66px", top: "81.06px", width: "242px", mixBlendMode: "lighten" }} inner={{ height: "242px", width: "365px" }}>
    <Img src={UserFlowsArt} />
  </Layer>
);

// 3119:4623 "Measure" — a dimension line: rule, arrow, label, arrow, rule.
const MEASURE_LINE = { background: "#fff", height: "1.277px", flexShrink: 0 };
const MeasureArrow = ({ src, inset }) => (
  <div style={{ flex: "1 0 0", minHeight: "1px", position: "relative", width: 0 }}>
    <div style={{ ...abs, inset }}>
      <img alt="" src={src} className="figma-svg" style={{ display: "block", maxWidth: "none", width: "100%", height: "100%" }} loading="lazy" draggable={false} />
    </div>
  </div>
);
const Measure = ({ height, label, labelStyle }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height, flexShrink: 0, width: "61.291px" }}>
    <div style={{ ...MEASURE_LINE, width: "100%" }} />
    <div style={{ display: "flex", flex: "1 0 0", flexDirection: "column", gap: "2.554px", alignItems: "center", minHeight: "1px", width: "100%" }}>
      <MeasureArrow src={MeasureArrowUp} inset="-1.71% -4.7px 0 -4.7px" />
      <div style={{ flexShrink: 0, fontFamily: "Outfit, Epilogue, sans-serif", lineHeight: "normal", color: "#fff", textAlign: "center", textTransform: "uppercase", whiteSpace: "nowrap", ...labelStyle }}>{label}</div>
      <MeasureArrow src={MeasureArrowDown} inset="0 -4.7px -1.71% -4.7px" />
    </div>
    <div style={{ ...MEASURE_LINE, width: "61.291px" }} />
  </div>
);
const GUIDE = "1.277px solid #fff";
const SMALL_LABEL = { fontSize: "9.78px" };

// 3119:4619 "Logo" — Arcova mark with its clear-space construction guides — Logo Design
const BrandLogo = () => (
  <Layer box={{ height: "277px", left: "67.21px", top: "125.26px", width: "258.378px", mixBlendMode: "lighten" }} inner={{ height: "258.378px", width: "277px", overflow: "clip", backgroundImage: "radial-gradient(ellipse 138.5px 129.19px at 50% 50%, rgb(1,5,80) 0%, rgb(1,3,40) 50%, rgb(0,1,20) 75%, rgb(0,1,10) 87.5%, #000 100%)" }}>
    <div style={{ ...abs, display: "flex", flexDirection: "column", alignItems: "flex-start", left: "calc(50% + 0.65px)", top: "calc(50% + 0.65px)", transform: "translate(-50%, -50%)" }}>
      <div style={{ display: "flex", gap: "5.108px", alignItems: "flex-start", height: "76.614px", padding: "0 8.938px", position: "relative", width: "100%", borderLeft: GUIDE, borderRight: GUIDE, borderTop: GUIDE }}>
        <Measure height="76.614px" label="a / 3" labelStyle={SMALL_LABEL} />
        <div style={{ ...abs, left: "calc(50% - 0.15px)", top: "calc(50% - 0.83px)", transform: "translate(-50%, -50%)", fontFamily: "Outfit, Epilogue, sans-serif", fontSize: "5.108px", lineHeight: "normal", letterSpacing: "5.1076px", color: "#0f0f0f", opacity: 0.6, textTransform: "uppercase", whiteSpace: "nowrap" }}>whitespace (A/3)</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <div style={{ alignSelf: "stretch", width: "76.614px", borderLeft: GUIDE, flexShrink: 0 }} />
        <div style={{ height: "120.513px", position: "relative", width: "127.69px", flexShrink: 0 }}>
          <Crop src={ArcovaMark} crop={{ height: "138.96%", left: "-16.16%", top: "-19.48%", width: "131.15%" }} />
        </div>
        <div style={{ alignSelf: "stretch", display: "flex", alignItems: "center", justifyContent: "center", width: "76.614px", borderRight: GUIDE, flexShrink: 0 }}>
          <Measure height="120.667px" label="a" labelStyle={{ fontSize: "30.65px", letterSpacing: "30.65px" }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", height: "76.614px", padding: "0 8.938px", width: "100%", borderLeft: GUIDE, borderRight: GUIDE, borderBottom: GUIDE }}>
        <Measure height="76.614px" label="a / 3" labelStyle={SMALL_LABEL} />
      </div>
    </div>
  </Layer>
);

// 3125:4523 — Brand Kit & Rebranding
const BrandKit = () => (
  <Layer box={{ height: "318px", left: "73.66px", top: "104.26px", width: "271px" }} inner={{ height: "271px", width: "318px" }}>
    <Img src={BrandKitArt} />
  </Layer>
);

// 3122:4547 "Event Showcase 1" — Brand Identity & Visuals
const BrandIdentity = () => (
  <Layer box={{ height: "308px", left: "58.66px", top: "109.26px", width: "274px" }} inner={{ height: "274px", width: "308px" }}>
    <Crop src={TechouseShowcase} crop={{ height: "124.51%", left: "5.66%", top: "-4.44%", width: "88.68%" }} />
  </Layer>
);

// 3125:4525 — Packaging Design (two bag mockups)
const BrandPackaging = () => (
  <>
    <Layer box={{ height: "244.97px", left: "75px", top: "205.88px", width: "225px" }} inner={{ height: "225px", width: "244.97px" }}>
      <Crop src={PackagingLarge} crop={{ height: "123.84%", left: "-0.21%", top: "-11.89%", width: "113.75%" }} />
    </Layer>
    <Layer box={{ height: "194px", left: "85px", top: "79.4px", width: "179px" }} inner={{ height: "179px", width: "194px" }}>
      <Crop src={PackagingSmall} crop={{ height: "108.31%", left: 0, top: "-4.18%", width: "99.94%" }} />
    </Layer>
  </>
);

// 965:6063 — Presentations & Pitch Decks
const CreativePitchDecks = () => (
  <Layer box={{ height: "402px", left: "calc(50% + 0.5px)", top: "63.26px", width: "225px", transform: "translateX(-50%)", mixBlendMode: "lighten" }} inner={{ height: "225px", width: "402px", borderRadius: "10px" }}>
    <div style={{ ...abs, inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: "10px" }}>
      <img alt="" src={PitchDeckArt} style={{ ...abs, height: "100%", left: "0.25%", maxWidth: "none", top: 0, width: "99.5%" }} loading="lazy" draggable={false} />
      <div style={{ ...abs, inset: 0, backgroundImage: "linear-gradient(180.3221455141308deg, rgba(0, 0, 0, 0) 58.805%, rgb(0, 0, 0) 99.503%)" }} />
    </div>
  </Layer>
);

// 965:6072 — Social Media Designs
const CreativeSocial = () => (
  <Layer box={{ height: "453px", left: "calc(50% + 29px)", top: "37.26px", width: "264px", transform: "translateX(-50%)", mixBlendMode: "lighten" }} inner={{ height: "264px", width: "453px" }}>
    <div style={{ ...abs, inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <img alt="" src={SocialMediaArt} style={{ ...abs, height: "114.37%", left: 0, maxWidth: "none", top: "-4.91%", width: "100%" }} loading="lazy" draggable={false} />
    </div>
  </Layer>
);

// 3130:4546 — Posters, Flyers & Thumbnails: two hanging posters, each with its clip hanger above.
const posterSlot = (left, extra) => ({ ...abs, height: "174.306px", left, top: "76.7px", width: "117.566px", transform: "translateX(-50%)", ...extra });
const hangerSlot = (left, from, to) => ({ ...abs, height: "79.82px", left, top: 0, width: "133.193px", transform: "translateX(-50%)", mixBlendMode: "lighten", gradient: `linear-gradient(to top, rgba(0,0,0,0) ${from}, #000 ${to})` });
const Hanger = ({ slot }) => {
  const { gradient, ...style } = slot;
  return (
    <div style={style}>
      <div style={{ ...abs, inset: 0, pointerEvents: "none" }}>
        <img alt="" src={PosterHanger} style={{ ...fill, objectPosition: "bottom" }} loading="lazy" draggable={false} />
        <div style={{ ...abs, inset: 0, backgroundImage: gradient }} />
      </div>
    </div>
  );
};
const CreativePosters = () => (
  // The rotated layer isolates its children, so the hangers' lighten blend is lifted to the group
  // (the posters are dark, so lightening them against the near-black canvas is a visual no-op).
  <Layer box={{ height: "274.08px", left: "calc(50% + 23.5px)", top: "127.06px", width: "251px", transform: "translateX(-50%)", mixBlendMode: "lighten" }} inner={{ height: "251px", width: "274.08px" }}>
    <div style={posterSlot("calc(50% + 70.32px)")}><img alt="" src={PosterRight} style={{ ...fill, objectPosition: "bottom" }} loading="lazy" draggable={false} /></div>
    <div style={posterSlot("calc(50% - 70.56px)")}><img alt="" src={PosterLeft} style={{ ...fill, objectPosition: "bottom" }} loading="lazy" draggable={false} /></div>
    <Hanger slot={hangerSlot("calc(50% - 70.44px)", "67.429%", "85.595%")} />
    <Hanger slot={hangerSlot("calc(50% + 70.44px)", "37.361%", "79.331%")} />
  </Layer>
);

// 3350:5958 "OBJECTS" — Illustrations, Iconograph, Arts. The vector illustration is the node's
// Figma export (on black), so lighten drops its backdrop over the card glow.
const CreativeIllustrations = () => (
  <Layer box={{ height: "219.81px", left: "calc(50% + 26.5px)", top: "153.16px", width: "248.999px", transform: "translateX(-50%)", mixBlendMode: "lighten" }} inner={{ height: "248.999px", width: "219.81px" }} rotate="90deg">
    <Img src={IllustrationArt} style={{ objectFit: "fill" }} />
  </Layer>
);

const MEDIA = {
  "ui-ux-corporate": UiuxCorporate,
  "ui-ux-mobile": UiuxMobile,
  "ui-ux-landing": UiuxLanding,
  "ui-ux-ecommerce": UiuxEcommerce,
  "product-saas": ProductSaas,
  "product-dashboards": ProductDashboards,
  "product-enterprise": ProductEnterprise,
  "product-user-flows": ProductUserFlows,
  "brand-logo": BrandLogo,
  "brand-kit": BrandKit,
  "brand-identity": BrandIdentity,
  "brand-packaging": BrandPackaging,
  "creative-pitch-decks": CreativePitchDecks,
  "creative-social": CreativeSocial,
  "creative-posters": CreativePosters,
  "creative-illustrations": CreativeIllustrations,
};

// Media whose Figma layer sits above the card title rather than beneath it.
export const MEDIA_ABOVE_TITLE = new Set(["product-enterprise", "product-user-flows", "brand-logo", "brand-kit", "brand-identity", "brand-packaging"]);

const OfferMedia = ({ name }) => {
  const Media = MEDIA[name];
  return Media ? <Media /> : null;
};

export default OfferMedia;
