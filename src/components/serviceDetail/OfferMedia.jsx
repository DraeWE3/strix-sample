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

const MEDIA = {
  "ui-ux-corporate": UiuxCorporate,
  "ui-ux-mobile": UiuxMobile,
  "ui-ux-landing": UiuxLanding,
  "ui-ux-ecommerce": UiuxEcommerce,
  "product-saas": ProductSaas,
  "product-dashboards": ProductDashboards,
  "product-enterprise": ProductEnterprise,
  "product-user-flows": ProductUserFlows,
};

// Media whose Figma layer sits above the card title rather than beneath it.
export const MEDIA_ABOVE_TITLE = new Set(["product-enterprise", "product-user-flows"]);

const OfferMedia = ({ name }) => {
  const Media = MEDIA[name];
  return Media ? <Media /> : null;
};

export default OfferMedia;
