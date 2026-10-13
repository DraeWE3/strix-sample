import UiUxDesign from "../../assets/img/services/b6140.png";
import ProductDesign from "../../assets/img/services/55cc6.png";
import MobileAppDesign from "../../assets/img/services/dc8fe.png";
import CreativeDesign from "../../assets/img/services/7cc2a.png";
import WebsiteDesign from "../../assets/img/service-pages/figma/75289.png";
import Branding from "../../assets/img/services/08efb.png";
import WebApplications from "../../assets/img/services/3cf02.png";
import ECommerce from "../../assets/img/services/a9a10.png";
import WebsiteDevelopment from "../../assets/img/services/c8cc8.png";
import MobileApplications from "../../assets/img/services/44b36.png";
import InteractiveWebsites from "../../assets/img/services/25150.png";
import MaintenanceHosting from "../../assets/img/services/e5c6d.png";
import ThreeDAnimations from "../../assets/img/services/10a37.png";
import CommercialsPromos from "../../assets/img/services/19321.png";
import ReelsShorts from "../../assets/img/services/add27.png";
import LongFormatContent from "../../assets/img/services/924c4.png";
import MotionGraphics from "../../assets/img/services/a1d1f.png";
import DesignToolA from "../../assets/img/services/82de0.svg";
import DesignToolB from "../../assets/img/services/d6dd7.svg";
import DesignToolC from "../../assets/img/services/f6436.svg";
import DesignToolD from "../../assets/img/services/f0b78.svg";
import DesignToolE from "../../assets/img/services/00bed.svg";
import DesignToolPhone from "../../assets/img/services/55084.svg";
import DevelopmentToolWebApp from "../../assets/img/services/81146.svg";
import DevelopmentToolCart from "../../assets/img/services/2fb27.svg";
import DevelopmentToolWebDev from "../../assets/img/services/75de1.svg";
import DevelopmentToolD from "../../assets/img/services/a7db1.svg";
import DevelopmentToolInteractive from "../../assets/img/services/5e100.svg";
import DevelopmentToolHosting from "../../assets/img/services/d3748.svg";
import ProductionToolTarget from "../../assets/img/services/7d0dc.svg";
import ProductionToolB from "../../assets/img/services/33a94.svg";
import ProductionToolVideoBody from "../../assets/img/services/279f1.svg";
import ProductionToolVideoFrame from "../../assets/img/services/effc9.svg";
import ProductionToolD from "../../assets/img/services/e25ea.svg";
import ProductionToolE from "../../assets/img/services/6c12e.svg";

// Copy, order and description boxes follow Figma 1044:9976 (Design 1111:9143, Development 1118:7517, Production 1118:7440).
// `desc` overrides the gallery's description box: { top, width, size, line, tracking } in px.
const PLACEHOLDER = "From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.";

const serviceGalleries = [
  {
    id: "design",
    title: "Design",
    tagline: "Crafted to captivate and built to perform.",
    desc: { top: 381, size: 15, line: 26, tracking: 0.75 },
    cards: [
      { title: "UI / UX Design", href: "/services/ui-ux-design", description: "Interfaces users love to come back to", image: UiUxDesign, modifier: "design-first", desc: { top: 454, width: 441, size: 20, tracking: 1 } },
      { title: "Product Design", href: "/services/product-design", description: PLACEHOLDER, image: ProductDesign, modifier: "design-product", desc: { width: 579, line: 30, tracking: 0 } },
      { title: "Mobile app Design", href: "/appdesign", description: "Strategically designed mobile experiences that are intuitive, beautiful, and built for your users' on-the-go lifestyle.", image: MobileAppDesign, desc: { width: 559 } },
      { title: "Creative Design", href: "/services/creative-design", description: "A team of creative visionaries delivering high-impact graphics, thumbnails, and presentations that leave a lasting impression.", image: CreativeDesign, desc: { width: 559 } },
      { title: "Website Design", href: "/webdesign", description: "Bespoke websites and landing pages built to be the digital cornerstone of your business.", image: WebsiteDesign, modifier: "design-website", desc: { width: 413 } },
      { title: "Branding", href: "/services/branding", description: "We forge powerful brand identities and comprehensive guidelines that articulate your mission and vision with clarity.", image: Branding, desc: { width: 505 } },
    ],
    tools: [
      { icon: DesignToolA },
      { icon: DesignToolB },
      { icon: DesignToolC },
      { icon: DesignToolD },
      { icon: DesignToolE },
      { icon: DesignToolPhone, modifier: "phone" },
    ],
  },
  {
    id: "development",
    title: "Development",
    tagline: "Engineered to scale and built to last.",
    desc: { top: 429.375, width: 491, size: 15, line: 30, tracking: 0 },
    cards: [
      { title: "Web Applications", href: "/services/web-app", description: PLACEHOLDER, image: WebApplications },
      { title: "E-Commerce", href: "/ecommerce", description: PLACEHOLDER, image: ECommerce },
      { title: "Website Development", href: "/services/web-dev", description: PLACEHOLDER, image: WebsiteDevelopment, modifier: "development-website" },
      { title: "Mobile Applications", href: "/services/app-dev", description: "Beyond beautiful interfaces, we build seamless user journeys that drive engagement and conversion.", image: MobileApplications, modifier: "development-mobile", desc: { top: 430.375, width: 579, line: 26, tracking: 0.75 } },
      { title: "Interactive Websites", href: "/services/interactive-web", description: PLACEHOLDER, image: InteractiveWebsites, modifier: "development-interactive" },
      { title: "Maintenance & Hosting", href: "/services/software-dev", description: PLACEHOLDER, image: MaintenanceHosting },
    ],
    tools: [
      { icon: DevelopmentToolWebApp, modifier: "webapp" },
      { icon: DevelopmentToolCart },
      { icon: DevelopmentToolWebDev, modifier: "webdev" },
      { icon: DevelopmentToolD },
      { icon: DevelopmentToolInteractive, modifier: "interactive" },
      { icon: DevelopmentToolHosting, modifier: "hosting" },
    ],
  },
  {
    id: "production",
    title: "Production",
    tagline: "Content that earns attention and drives action.",
    desc: { top: 430.75, width: 531, size: 15, line: 26, tracking: 0.75 },
    cards: [
      { title: "3D Animations", href: "/services/3d-animations", description: PLACEHOLDER, image: ThreeDAnimations, modifier: "production-3d", desc: { width: 533 } },
      { title: "Commercials & Promos", href: "/services/commercials", description: PLACEHOLDER, image: CommercialsPromos },
      { title: "Reels & Shorts", href: "/services/reels-shorts", description: PLACEHOLDER, image: ReelsShorts, modifier: "production-reels", desc: { width: 579 } },
      { title: "Long Format Content", href: "/services/long-format", description: PLACEHOLDER, image: LongFormatContent, modifier: "production-long" },
      { title: "Motion Graphics", href: "/services/motion-graphics", description: PLACEHOLDER, image: MotionGraphics },
    ],
    tools: [
      { icon: ProductionToolTarget, modifier: "target" },
      { icon: ProductionToolB },
      { icon: ProductionToolVideoBody, frame: ProductionToolVideoFrame, modifier: "video" },
      { icon: ProductionToolD },
      { icon: ProductionToolE },
    ],
  },
];

export default serviceGalleries;
