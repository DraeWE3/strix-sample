import UiUxDesign from "../../assets/img/services/b6140.png";
import ProductDesign from "../../assets/img/services/55cc6.png";
import MobileAppDesign from "../../assets/img/services/dc8fe.png";
import CreativeDesign from "../../assets/img/services/7cc2a.png";
import WebsiteDesign from "../../assets/img/pi2.png";
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
import DevelopmentToolB from "../../assets/img/services/2fb27.svg";
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

const SHARED_DESCRIPTION =
  "From concept to launch, we meticulously shape digital products for unparalleled user satisfaction and business impact.";

const serviceGalleries = [
  {
    id: "design",
    title: "Design",
    tagline: "Crafted to captivate and built to perform.",
    cards: [
      { title: "UI / UX Design", description: "Interfaces users love to come back to", image: UiUxDesign, modifier: "design-first" },
      { title: "Product Design", description: SHARED_DESCRIPTION, image: ProductDesign, modifier: "design-product" },
      {
        title: "Mobile app Design",
        description: "Strategically designed mobile experiences that are intuitive, beautiful, and built for your users' on-the-go lifestyle.",
        image: MobileAppDesign,
      },
      {
        title: "Creative Design",
        description: "A team of creative visionaries delivering high-impact graphics, thumbnails, and presentations that leave a lasting impression.",
        image: CreativeDesign,
      },
      {
        title: "Website Design",
        description: "Bespoke websites and landing pages built to be the digital cornerstone of your business.",
        image: WebsiteDesign,
        modifier: "design-website",
      },
      {
        title: "Branding",
        description: "We forge powerful brand identities and comprehensive guidelines that articulate your mission and vision with clarity.",
        image: Branding,
        modifier: "design-branding",
      },
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
      { title: "Web Applications", description: SHARED_DESCRIPTION, image: WebApplications },
      { title: "E-Commerce", description: SHARED_DESCRIPTION, image: ECommerce },
      { title: "Website Development", description: SHARED_DESCRIPTION, image: WebsiteDevelopment, modifier: "development-website" },
      {
        title: "Mobile Applications",
        description: "Beyond beautiful interfaces, we build seamless user journeys that drive engagement and conversion.",
        image: MobileApplications,
        modifier: "development-mobile",
      },
      { title: "Interactive Websites", description: SHARED_DESCRIPTION, image: InteractiveWebsites, modifier: "development-interactive" },
      { title: "Maintenance & Hosting", description: SHARED_DESCRIPTION, image: MaintenanceHosting },
    ],
    tools: [
      { icon: DevelopmentToolWebApp, modifier: "webapp" },
      { icon: DevelopmentToolB },
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
      { title: "3D Animations", description: SHARED_DESCRIPTION, image: ThreeDAnimations, modifier: "production-3d" },
      { title: "Commercials & Promos", description: SHARED_DESCRIPTION, image: CommercialsPromos },
      { title: "Reels & Shorts", description: SHARED_DESCRIPTION, image: ReelsShorts, modifier: "production-reels" },
      { title: "Long Format Content", description: SHARED_DESCRIPTION, image: LongFormatContent, modifier: "production-long" },
      { title: "Motion Graphics", description: SHARED_DESCRIPTION, image: MotionGraphics },
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
