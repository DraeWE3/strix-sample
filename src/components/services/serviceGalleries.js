import UiUxDesign from "../../assets/img/services/b6140.png";
import ProductDesign from "../../assets/img/services/55cc6.png";
import GameArt from "../../assets/img/services/dc8fe.png";
import CreativeDesign from "../../assets/img/services/7cc2a.png";
import ThreeDDesign from "../../assets/img/service-pages/production/3d1.png";
import Branding from "../../assets/img/services/08efb.png";
import WebApplications from "../../assets/img/services/3cf02.png";
import WebsiteDevelopment from "../../assets/img/services/c8cc8.png";
import MobileApplications from "../../assets/img/services/44b36.png";
import InteractiveWebsites from "../../assets/img/services/25150.png";
import SaasDevelopment from "../../assets/img/service-pages/development/softdev1.png";
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

const serviceGalleries = [
  {
    id: "design",
    title: "Design",
    tagline: "Crafted to captivate and built to perform.",
    cards: [
      { title: "UI / UX Design", href: "/services/ui-ux-design", description: "Interfaces users love to come back to.", image: UiUxDesign, modifier: "design-first" },
      { title: "Product Design", href: "/services/product-design", description: "Products built around real users.", image: ProductDesign, modifier: "design-product" },
      { title: "Game Art", href: "/services/game-art", description: "Worlds players want to explore.", image: GameArt },
      { title: "Creative Design", href: "/services/creative-design", description: "Visuals that make people pause.", image: CreativeDesign },
      { title: "3D Design", href: "/services/3d-design", description: "Ideas made tangible in 3D.", image: ThreeDDesign },
      { title: "Branding", href: "/services/branding", description: "Brands people recognise and remember.", image: Branding, modifier: "design-branding" },
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
    cards: [
      { title: "Web Applications", href: "/services/web-app", description: "Tools that simplify complex workflows.", image: WebApplications },
      { title: "Website Development", href: "/services/web-dev", description: "Fast websites, built to convert.", image: WebsiteDevelopment, modifier: "development-website" },
      { title: "Mobile Applications", href: "/services/app-dev", description: "Apps that make life easier.", image: MobileApplications, modifier: "development-mobile" },
      { title: "Interactive Websites", href: "/services/interactive-web", description: "Websites that invite exploration.", image: InteractiveWebsites, modifier: "development-interactive" },
      { title: "SaaS Development", href: "/services/software-dev", description: "Software built to grow with you.", image: SaasDevelopment },
    ],
    tools: [
      { icon: DevelopmentToolWebApp, modifier: "webapp" },
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
    cards: [
      { title: "3D Animations", href: "/services/3d-animations", description: "Every angle, brought to life.", image: ThreeDAnimations, modifier: "production-3d" },
      { title: "Commercials & Promos", href: "/services/commercials", description: "Make your product worth watching.", image: CommercialsPromos },
      { title: "Reels & Shorts", href: "/services/reels-shorts", description: "Short videos. Lasting impressions.", image: ReelsShorts, modifier: "production-reels" },
      { title: "Long Format Content", href: "/services/long-format", description: "Stories worth watching to the end.", image: LongFormatContent, modifier: "production-long" },
      { title: "Motion Graphics", href: "/services/motion-graphics", description: "Complex ideas, made clear.", image: MotionGraphics },
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
