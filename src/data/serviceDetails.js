// Centralized content for every /services/:slug page. All pages render through the same
// ServiceDetailPage template; only the hero (MAIN) and "What we provide" offers change per
// service, plus the proof strip beneath them. Production entries carry the generated template's
// own copy and Figma artwork; design and development entries reuse the existing site's copy and
// imagery and are ready to be refined in place.
import { SHOWREEL_ID } from "../components/showreel";

import CommercialsPoster from "../assets/img/service-pages/figma/8b632.png";
import LongFormatPoster from "../assets/img/service-pages/figma/65435.png";
import ReelsPoster from "../assets/img/service-pages/figma/c2ec4.png";
import MotionPoster from "../assets/img/service-pages/figma/e4b89.png";
import ThreeDAnimationsPoster from "../assets/img/service-pages/figma/4e9ac.png";
import DesignPoster from "../assets/img/service-pages/common/serv.webp";
import UiuxPoster from "../assets/img/service-pages/figma/a265f.png";
import KundliLogo from "../assets/img/service-pages/figma/40416.png";
import AmiloHalosLogo from "../assets/img/service-pages/figma/6ec5f.png";
import ProductPoster from "../assets/img/service-pages/figma/12aa1.png";
import RyvonLogo from "../assets/img/service-pages/figma/29eab.png";
import BrandingPoster from "../assets/img/service-pages/figma/9b8c9.png";
import BrandingHeadingTexture from "../assets/img/service-pages/figma/90b1d.png";
import TdoLogo from "../assets/img/service-pages/figma/34d8a.png";
import ArcovaLogo from "../assets/img/service-pages/figma/deaf8.png";
import GizaLogo from "../assets/img/service-pages/figma/7b9c4.png";
import CreativePoster from "../assets/img/service-pages/figma/0c100.png";
import GameArtPoster from "../assets/img/service-pages/figma/3c589.png";
import GameArtHeadingTexture from "../assets/img/service-pages/figma/09bc8.png";
import MinMariaLogo from "../assets/img/service-pages/figma/min-maria-3510-6616.png";
import ImpactRiverLogo from "../assets/img/service-pages/figma/impact-river-3510-6736.png";
import AbhiwanLogo from "../assets/img/service-pages/figma/dd3ca.png";
import ThreeDPoster from "../assets/img/service-pages/figma/cf59f.png";
import ThreeDHeadingTexture from "../assets/img/service-pages/figma/ed208.png";
import DevelopmentPoster from "../assets/img/service-pages/development/dev-bgg.webp";

import WebAppPoster from "../assets/img/service-pages/figma/3fd0f.png";
import NothingLogo from "../assets/img/service-pages/figma/0c914.png";
import PenguinKartsLogo from "../assets/img/service-pages/figma/5fd6b.png";
import AppDev1 from "../assets/img/service-pages/development/appdev1.png";
import AppDev2 from "../assets/img/service-pages/development/appdev2.png";
import AppDev3 from "../assets/img/service-pages/development/appdev3.png";
import Interactive1 from "../assets/img/service-pages/development/intaweb1.png";
import Interactive2 from "../assets/img/service-pages/development/intaweb2.png";
import Interactive3 from "../assets/img/service-pages/development/intaweb3.png";
import Interactive4 from "../assets/img/service-pages/development/intaweb4.png";
import WebDev1 from "../assets/img/service-pages/development/webdev1.png";
import WebDev2 from "../assets/img/service-pages/development/webdev2.png";
import WebDev3 from "../assets/img/service-pages/common/webdev3.png";
import WebDev4 from "../assets/img/service-pages/common/webdev4.png";
import Software1 from "../assets/img/service-pages/development/softdev1.png";
import Software2 from "../assets/img/service-pages/development/softdev2.png";
import Software3 from "../assets/img/service-pages/development/softdev3.png";

export const SERVICE_ROUTE_BASE = "/services";
export const serviceRoute = (slug) => `${SERVICE_ROUTE_BASE}/${slug}`;

export const serviceCategories = [
  { id: "design", name: "Design", slugs: ["ui-ux-design", "product-design", "branding", "creative-design", "game-art", "3d-design"] },
  { id: "development", name: "Development", slugs: ["web-app", "app-dev", "interactive-web", "web-dev", "software-dev"] },
  { id: "production", name: "Production", slugs: ["commercials", "long-format", "reels-shorts", "motion-graphics", "3d-animations"] },
];

const VIEW_WORK = { showreel: false };
const VIEW_WORK_AND_SHOWREEL = { showreel: true, videoId: SHOWREEL_ID };

export const serviceDetails = {
  /* ----------------------------------------------------------------- DESIGN */
  "ui-ux-design": {
    slug: "ui-ux-design",
    category: "design",
    title: "UI/UX Design",
    navLabel: "UI/UX Design",
    seo: {
      title: "UI/UX Design Services for Web & Mobile Apps",
      description: "Strix crafts intuitive and visually compelling UI/UX designs for web and mobile apps, helping businesses improve usability, user retention, and digital impact.",
    },
    hero: {
      ...VIEW_WORK_AND_SHOWREEL,
      poster: UiuxPoster,
      description: "Real outcomes from real products we have shipped.",
    },
    // Figma 925:4701 (offers 3346:5197 / 5218 / 5240 / 5263, proof 3510:6225).
    offers: [
      { title: "Corporate & Business Websites", description: "A website that works as hard as your sales team.", descriptionWidth: 320, media: "ui-ux-corporate" },
      { title: "Mobile Application Design", description: "Apps users open daily — and actually enjoy using.", descriptionWidth: 300, media: "ui-ux-mobile" },
      { title: "Landing Page Designs", description: "Turn first-time visitors into ready-to-buy leads.", descriptionWidth: 465, media: "ui-ux-landing" },
      { title: "E-Commerce Designs", description: "A storefront designed to sell while you sleep.", descriptionWidth: 450, media: "ui-ux-ecommerce" },
    ],
    proof: {
      heading: "Design that moves the numbers.",
      intro: "Every design decision is backed by user behaviour — not personal preference, not trends, not what looked good last year.",
      introWidth: 1129,
      cards: [
        {
          logoImage: { src: KundliLogo, width: 138, height: 68, alt: "The Kundli Pro" },
          stat: "50,000+",
          title: "Downloads delivered",
          description: "App UI/UX redesign that took a dated astrology app to trending on the Play Store.",
          layout: { statLeft: 40.5, titleLeft: 41, ruleLeft: 34, ruleWidth: 230, copyLeft: 7, copyRight: 7 },
        },
        {
          logoImage: { src: AmiloHalosLogo, width: 105, height: 70, alt: "Amilo Halos" },
          stat: "500k+",
          title: "Funds Raised\nin pre-seed",
          description: "Pitch deck and presentation design that helped close their funding round.",
        },
        {
          logo: "structly",
          stat: "3x",
          title: "Faster onboarding",
          description: "SaaS dashboard redesign that reduced time-to-value for new users.",
          layout: { titleLeft: 33, copyLeft: 0, copyRight: 0 },
        },
      ],
    },
  },
  "product-design": {
    slug: "product-design",
    category: "design",
    title: "Product Design",
    navLabel: "Product Design",
    seo: {
      title: "Custom SaaS Product Development Company | SaaS Product Design Agency",
      description: "Custom SaaS product development company and SaaS product design agency delivering innovative, scalable solutions to bring your software ideas to life.",
    },
    hero: {
      ...VIEW_WORK,
      poster: ProductPoster,
      // Figma 3466:5337 fills the 1004 x 503 frame with the 4:3 render (no crop), anchored bottom.
      posterFit: "fill",
      posterPosition: "bottom",
      description: "End-to-end product design built for retention, not just launch day.",
    },
    // Figma 965:5403 (hero 3466:5336, offers 3346:5118 / 5137 / 5128 / 5146, proof 3510:6526).
    offers: [
      { title: "SaaS Interfaces", description: "Complex features, simple enough your users never need support.", descriptionWidth: 373, media: "product-saas" },
      { title: "Dashboards", description: "Every metric your team needs, exactly where they expect it.", descriptionWidth: 348, media: "product-dashboards" },
      { title: "Enterprise Applications", description: "Powerful tools your teams actually want to open.", descriptionWidth: 293, media: "product-enterprise" },
      { title: "User Flows & Wireframes", description: "Map the journey before a single pixel is designed.", descriptionWidth: 262, media: "product-user-flows" },
    ],
    proof: {
      heading: "Products users keep returning to.",
      intro: "Every product design is built component-first — so your developers can implement without a single clarification call.",
      introWidth: 1095,
      cards: [
        {
          // 3510:6532: 207 x 48 frame, image inset 14.4% top at 71.2% height.
          logoImage: { src: RyvonLogo, width: 207, height: 34.18, top: 27.91, alt: "Ryvon AI" },
          stat: "<3 Weeks",
          title: "From Idea to MVP",
          description: "Full AI SaaS product design — from zero architecture to launch-ready in under 21 days.",
          layout: { statLeft: 40.5, titleLeft: 41, ruleLeft: 34, ruleWidth: 230, copyLeft: 7, copyRight: 7 },
        },
        {
          logoImage: { src: KundliLogo, width: 138, height: 68, alt: "The Kundli Pro" },
          stat: "50,000+",
          title: "Downloads",
          description: "Complete product redesign of a mobile app — UX, flows, and design system rebuilt from scratch.",
          layout: { statLeft: 31.5, titleLeft: 32 },
        },
        {
          logo: "structly",
          stat: "3x",
          title: "Increased Retention",
          description: "Project management dashboard designed for clarity — reducing support tickets & improving daily active use.",
          layout: { titleLeft: 33, copyLeft: 0, copyRight: 0 },
        },
      ],
    },
  },
  branding: {
    slug: "branding",
    category: "design",
    title: "Branding",
    navLabel: "Branding",
    seo: {
      title: "Branding & Brand Identity Design Services",
      description: "Strix builds strong, memorable brand identities, guidelines and strategy that express your essence, connect emotionally and drive recognition.",
    },
    hero: {
      ...VIEW_WORK,
      poster: BrandingPoster,
      description: "We design brand systems built to scale with you — not a logo that needs redesigning the moment you grow.",
    },
    // Figma 965:5655 (hero 965:5791, offers 965:5806 / 5824 / 5815 / 5833, proof 3510:6582).
    offers: [
      { title: "Logo Design", description: "A mark that says everything — before you say a word.", descriptionWidth: 527, media: "brand-logo" },
      { title: "Brand Kit & Rebranding", description: "One system your whole team uses without asking twice.", descriptionWidth: 527, media: "brand-kit" },
      { title: "Brand Identity & Visuals", description: "Look the part everywhere your brand shows up.", descriptionWidth: 527, media: "brand-identity" },
      { title: "Packaging Design", description: "Make them reach for yours off the shelf.", descriptionWidth: 415, media: "brand-packaging" },
    ],
    proof: {
      heading: "Brands that get remembered.",
      headingImage: BrandingHeadingTexture,
      intro: "Identity work that earns recognition before a word is spoken.",
      cards: [
        {
          logoImage: { src: TdoLogo, width: 83, height: 83, top: 17, alt: "TDO" },
          title: "Launch Collateral for Web-series",
          description: "Full creative design suite for a youtube web-series launch — thumbnails, banners, and digital ads.",
          layout: { titleLeft: 41, ruleLeft: 34, ruleWidth: 230, copyLeft: 0.5, copyRight: 0.5 },
        },
        {
          // 3510:6595: 192 x 64 frame, image at 2.96% / 94.08% width.
          logoImage: { src: ArcovaLogo, width: 180.63, height: 64, top: 25, offsetX: -0.5, alt: "Arcova Solutions" },
          title: "Full Brand Design in <2 Weeks",
          description: "Brand kit, visual identity, and website design. Repositioned for premium enterprise buyers.",
          layout: { titleLeft: 32 },
        },
        {
          // 3510:6731: 189 x 61 frame, vector inset 1.4% / 0.41% / 0.58% / 0.03%.
          logoImage: { src: GizaLogo, width: 188.16, height: 59.8, top: 19.85, offsetX: -0.86, alt: "Giza Systems" },
          title: "Enterprise Credibility",
          description: "Full brand system for a global technology company. Positioned them for international expansion.",
          layout: { titleLeft: 21.5, copyLeft: 0, copyRight: 0 },
        },
      ],
    },
  },
  "creative-design": {
    slug: "creative-design",
    category: "design",
    title: "Creative Designs",
    navLabel: "Creative Design",
    seo: {
      title: "Creative Design Services — Graphics, Thumbnails & Presentations",
      description: "Strix blends next-gen visuals with strategy, crafting high-impact graphics, thumbnails and presentations that help your brand stand out.",
    },
    hero: {
      ...VIEW_WORK,
      // Figma 965:6044: 1004 x 591 render (117.5% tall) centred in the 1004 x 503 frame.
      poster: CreativePoster,
      description: " Creative work built to perform across every platform and format.",
    },
    // Figma 965:5907 (hero 965:6043, offers 965:6058 / 6076 / 6067 / 6085, proof 3510:6703).
    offers: [
      { title: "Presentations & Pitch Decks", description: "Decks that gets fundings, not just fill the slides.", descriptionWidth: 527, media: "creative-pitch-decks" },
      { title: "Posters, Flyers & Thumbnails", description: "Works that people actually stop to see.", descriptionWidth: 400, media: "creative-posters" },
      { title: "Social Media Designs", description: "Content your audience wants to share, not scroll past.", descriptionWidth: 513, media: "creative-social" },
      { title: "Illustrations, Iconograph, Arts", description: "Visuals that give your brand a voice without words.", descriptionWidth: 500, media: "creative-illustrations" },
    ],
    proof: {
      heading: "Visuals that earn attention.",
      headingImage: BrandingHeadingTexture,
      intro: "Every piece is built from your brand — original artwork, not stock assets with your logo dropped in.",
      introWidth: 951,
      cards: [
        {
          logoImage: { src: TdoLogo, width: 73, height: 73, top: 16, alt: "TDO" },
          title: "Launch Collateral for Web-series",
          description: "Full creative design suite for a youtube web-series launch — thumbnails, banners, and digital ads.",
          layout: { titleLeft: 41, ruleLeft: 34, ruleWidth: 230, copyLeft: 0.5, copyRight: 0.5 },
        },
        {
          logoImage: { src: AmiloHalosLogo, width: 105, height: 70, top: 17, offsetX: -0.5, alt: "Amilo Halos" },
          stat: "500k+",
          title: "Funds Raised\nin pre-seed",
          description: "Pitch deck and presentation design that helped close their funding round.",
        },
        {
          logo: "multiple-clients",
          stat: "10M+",
          title: "Reach and Impressions",
          description: "Social media design systems for brands across fintech, gaming, and consumer apps.",
          layout: { titleLeft: 33, copyLeft: 0, copyRight: 0 },
        },
      ],
    },
  },
  "game-art": {
    slug: "game-art",
    category: "design",
    title: "Game Art",
    navLabel: "Game Art",
    seo: {
      title: "Game Art & Asset Design Services",
      description: "Strix designs game concept art, characters, environments and UI assets that bring worlds to life and keep players immersed.",
    },
    hero: {
      ...VIEW_WORK,
      // Figma 965:6296: image fills the 1004 x 503 frame, anchored to the bottom.
      poster: GameArtPoster,
      posterPosition: "bottom",
      descriptionWidth: 1003,
      description: "From character concepts to production-ready assets — we bring your game world to life in 2D and 3D.",
    },
    // Figma 965:6159 (hero 965:6295, offers 3359:4975 / 4995 / 4985, proof 3510:6610).
    offers: [
      { title: "Gamified Applications", description: "Make your app feel like a game — and users like players.", descriptionWidth: 565, media: "game-gamified" },
      { title: "Gaming UI Screens", description: "Built for split-second decisions and total immersion.", descriptionWidth: 554, media: "game-ui" },
      { title: "Gaming Icons and Assets", description: "Every asset tells the player what they need, instantly.", descriptionWidth: 609, media: "game-icons" },
    ],
    proof: {
      heading: "Game Art that pulls players in.",
      headingImage: GameArtHeadingTexture,
      intro: "Assets delivered in the exact format your engine needs — Unity, Unreal, Godot. Named, organised, and import-ready from day one.",
      cards: [
        {
          // 3510:6616: 199 x 95 node export (Alegreya Sans SC wordmark).
          logoImage: { src: MinMariaLogo, width: 199, height: 95, top: 11, blend: "lighten", alt: "Min & Maria" },
          title: "Full Character Visual Suite",
          description: "2D and 3D character art for a children's animated game — concept to production-ready assets.",
          layout: { titleLeft: 41, titleTop: 193.5, titleLine: 26, ruleLeft: 34, ruleWidth: 230, copyLeft: 7, copyRight: 7 },
        },
        {
          // 3510:6736: 265.6 x 49.8 frame centred 110px above the card middle; its export adds 15px of glow above.
          logoImage: { src: ImpactRiverLogo, width: 265.67, height: 71.67, top: 31.95, offsetX: 0.31, blend: "lighten", alt: "Impact River" },
          title: "Complete Gaming Asset Library",
          description: "Game UI, icons, environments, and collectibles delivered across an entire game universe.",
          layout: { titleLeft: 32, titleTop: 193.5, titleLine: 26 },
        },
        {
          // 3510:6742: 126.36 x 94 frame, image at 7.17% / 87.91% height.
          logoImage: { src: AbhiwanLogo, width: 126.36, height: 82.64, top: 31.74, offsetX: -0.32, alt: "Abhiwan" },
          title: "XR-Ready Assets",
          description: "3D game art and interactive assets for an enterprise XR platform used globally.",
          layout: { titleLeft: 33, titleTop: 193.5, titleLine: 26, copyLeft: 0, copyRight: 0 },
        },
      ],
    },
  },
  "3d-design": {
    slug: "3d-design",
    category: "design",
    title: "3D Design",
    navLabel: "3D Design",
    seo: {
      title: "3D Design, Product Renders & Real Estate Visualization",
      description: "Strix creates photoreal 3D product renders, real estate visualizations and 3D models that show products and spaces before they exist.",
    },
    hero: {
      ...VIEW_WORK,
      // Figma 965:6548: render fills the 1004 x 503 frame, anchored bottom.
      poster: ThreeDPoster,
      posterPosition: "bottom",
      description: "Photorealistic renders, cinematic animations, and immersive 3D experiences — crafted to make your product unforgettable.",
    },
    // Figma 965:6411 (hero 965:6547, offers 3359:4886 / 4906 / 4896, proof 3510:6554).
    offers: [
      { title: "3D Game Environments", description: "Worlds players want to explore — and never leave.", descriptionWidth: 527, media: "3d-environments" },
      { title: "3D Game characters", description: "Characters with enough depth to become someone's favourite.", descriptionWidth: 462, media: "3d-characters" },
      { title: "Product renders", description: "Your product, at its absolute best — before it ships.", descriptionWidth: 471, media: "3d-product-renders" },
    ],
    proof: {
      heading: "3D that sells before it ships.",
      headingImage: ThreeDHeadingTexture,
      intro: "Renders and animations that make products impossible to overlook.",
      // Same Nothing / Penguin Karts / Abhiwan case cards as the 3D Animations page.
      cards: [
        { art: "3d-animations-1", title: "3D Cinematic Product Renders and animation", description: "3D product renders for one of the world's most recognized brands such as Nothing, Wroot & More." },
        { art: "3d-animations-2", title: "3D - Game Environment & Assets", description: "Game Environments, Racing car and other 3D assets delivered for penguin cart racing game." },
        { art: "3d-animations-3", title: "XR Visualisation", description: "3D scene design and spatial visualisation for immersive enterprise training environments." },
      ],
    },
  },

  /* ------------------------------------------------------------ DEVELOPMENT */
  "web-app": {
    slug: "web-app",
    category: "development",
    title: "Web Applications",
    navLabel: "Web App",
    seo: {
      title: "SaaS Web Application Development Services",
      description: "Expert SaaS web application development services to build scalable, secure, and high-performing web apps that accelerate your business growth.",
    },
    hero: {
      ...VIEW_WORK,
      // Figma 965:6802: image cropped at 103.59% x 120.5%, centred in the 1004 x 503 frame.
      poster: WebAppPoster,
      posterCrop: { width: "103.59%", height: "120.5%", left: "-1.79%", top: "-10.25%" },
      description: "We develop scalable, high-performance web apps tailored for business automation, SaaS platforms, and enterprise-level solutions.",
    },
    // Figma 965:6665 (hero 965:6801, offers 965:6843 / 6816 / 6825 / 6834, proof 3511:8326).
    offers: [
      { title: "SaaS MVP Development", description: "Go from validated idea to live product in 4 weeks", descriptionWidth: 311, media: "web-saas-mvp" },
      { title: "Custom AI Development", description: "Your product, made intelligent — built for the way your users actually think.", descriptionWidth: 415, media: "web-custom-ai" },
      { title: "Workflow Automation Tools", description: "Cut the repetitive work. Let your team focus on what actually matters.", descriptionWidth: 420, media: "web-workflow" },
      { title: "Custom Dashboards & Panels", description: "Every metric your team needs, surfaced exactly when they need it.", descriptionWidth: 415, media: "web-dashboards" },
    ],
    proof: {
      heading: "Applications built to last.",
      headingImage: ThreeDHeadingTexture,
      intro: "Web apps that handle real growth — without being rebuilt at scale.",
      introWidth: 821,
      cards: [
        {
          // 3511:8335: 693 x 125 image object-contain in a 180 x 106 box at top 9.
          logoImage: { src: NothingLogo, width: 180, height: 32.47, top: 45.77, offsetX: 0.5, alt: "Nothing" },
          title: "3D Cinematic Product Renders and animation",
          description: "3D product renders for one of the world's most recognized brands such as Nothing, Wroot & More.",
          layout: { titleLeft: 41.5, titleLine: 26, ruleLeft: 34, ruleWidth: 230, copyLeft: 7, copyRight: 7 },
        },
        {
          // 3511:8338: 116 x 70 box, image 105.68% wide at 1.47% (clipped edge is transparent).
          logoImage: { src: PenguinKartsLogo, width: 122.59, height: 70, top: 37, offsetX: 5.49, alt: "Penguin Karts" },
          title: "3D - Game Environment & Assets",
          description: "Game Environments, Racing car and other 3D assets delivered for penguin cart racing game.",
          layout: { titleLeft: 32.5, titleLine: 26 },
        },
        {
          // 3511:8347 "Astra": 126.36 x 94 box, image 87.91% tall at 7.17%.
          logoImage: { src: AbhiwanLogo, width: 126.36, height: 82.64, top: 31.74, offsetX: -0.32, alt: "Abhiwan" },
          title: "XR Visualisation",
          description: "3D scene design and spatial visualisation for immersive enterprise training environments.",
          layout: { titleLeft: 33, titleTop: 193.5, titleLine: 26, copyLeft: 0, copyRight: 0 },
        },
      ],
    },
  },
  "app-dev": {
    slug: "app-dev",
    category: "development",
    title: "App Development",
    navLabel: "App Dev",
    seo: {
      title: "Mobile App Development Services — iOS, Android & Cross-Platform",
      description: "Strix delivers powerful mobile applications with sleek performance, robust backends and cross-platform reach, from idea to app store.",
    },
    hero: {
      ...VIEW_WORK,
      poster: DevelopmentPoster,
      description: "From idea to app store, we deliver powerful mobile applications with sleek performance, robust backend, and cross-platform reach.",
    },
    offers: [
      { title: "Native iOS Apps", description: "Swift-built apps that feel at home on every iPhone and iPad.", descriptionWidth: 442, image: AppDev1 },
      { title: "Native Android Apps", description: "Kotlin apps tuned for the devices your users actually own.", descriptionWidth: 442, image: AppDev2 },
      { title: "Cross-Platform Apps", description: "One codebase, two stores, no compromise on feel.", descriptionWidth: 415, image: AppDev3 },
    ],
    proof: {
      heading: "Apps people keep installed.",
      intro: "Performance, stability and store-ready polish from the first build to the first review.",
      cards: [
        { label: "PERFORMANCE", title: "Fast on real devices", description: "Profiled on the phones your audience uses, not just the simulator." },
        { label: "ROBUST BACKEND", title: "APIs built alongside", description: "Secure, documented services designed with the app, not after it." },
        { label: "STORE READY", title: "Launch without surprises", description: "Review guidelines, assets and release pipelines handled end to end." },
      ],
    },
  },
  "interactive-web": {
    slug: "interactive-web",
    category: "development",
    title: "Interactive Websites",
    navLabel: "Interactive Web",
    seo: {
      title: "Interactive Website & Landing Page Development",
      description: "Strix builds conversion-optimized, animated and gamified web experiences engineered for speed, performance and sign-ups.",
    },
    hero: {
      ...VIEW_WORK,
      poster: DevelopmentPoster,
      description: "We build conversion - optimized landing pages that drive sign-ups, leads, and sales - engineered for speed and performance.",
    },
    offers: [
      { title: "Animated Landing Pages", description: "Motion that guides the eye to the one button that matters.", descriptionWidth: 442, image: Interactive1 },
      { title: "Gamified Web Experiences", description: "Interaction that turns visitors into participants.", descriptionWidth: 415, image: Interactive2 },
      { title: "Interactive Product Showcases", description: "Let people explore the product instead of reading about it.", descriptionWidth: 467, image: Interactive3 },
      { title: "Parallax Scrolling Sites", description: "Depth and pace that make a long page feel short.", descriptionWidth: 415, image: Interactive4 },
    ],
    proof: {
      heading: "Experiences that convert.",
      intro: "Interaction and animation built on a fast, accessible foundation — engineered for speed and performance.",
      cards: [
        { label: "SPEED FIRST", title: "Motion without the weight", description: "GPU-friendly animation and lean bundles keep the page fast on every device." },
        { label: "CONVERSION LED", title: "Every interaction has a job", description: "Scroll, hover and play states are designed around the sign-up, not the spectacle." },
        { label: "ACCESSIBLE", title: "Works for everyone", description: "Reduced-motion, keyboard and screen-reader paths built in from the start." },
      ],
    },
  },
  "web-dev": {
    slug: "web-dev",
    category: "development",
    title: "Website Development",
    navLabel: "Web Dev",
    seo: {
      title: "Website Development Services — Front-End & Back-End",
      description: "Strix develops websites that blend speed, security and scalability, built with clean code and optimized for long-term growth.",
    },
    hero: {
      ...VIEW_WORK,
      poster: DevelopmentPoster,
      description: "We develop websites that blend speed, security, and scalability - built with clean code and optimized for long-term growth.",
    },
    offers: [
      { title: "Corporate Websites", description: "A digital headquarters that looks the part and loads in a blink.", descriptionWidth: 465, image: WebDev1 },
      { title: "Portfolio Websites", description: "Work shown the way it deserves — big, fast and easy to browse.", descriptionWidth: 467, image: WebDev2 },
      { title: "Interactive 3D Websites", description: "WebGL experiences that run smoothly on ordinary laptops.", descriptionWidth: 442, image: WebDev3 },
      { title: "CMS Development", description: "Content your team can update without calling a developer.", descriptionWidth: 442, image: WebDev4 },
    ],
    proof: {
      heading: "Websites built for the long run.",
      intro: "Clean code, solid hosting and a structure that keeps growing with the business.",
      cards: [
        { label: "CLEAN CODE", title: "Maintainable from day one", description: "Readable, documented builds that any developer can pick up later." },
        { label: "SECURE", title: "Hardened by default", description: "Updates, backups and best practices handled before launch, not after an incident." },
        { label: "SEO READY", title: "Found by the right people", description: "Fast loads, semantic markup and metadata set up for search from the start." },
      ],
    },
  },
  "software-dev": {
    slug: "software-dev",
    category: "development",
    title: "Software Development",
    navLabel: "Software Dev",
    seo: {
      title: "Custom Software Development Services for Startups",
      description: "Strix delivers reliable, scalable custom software solutions, from web applications to enterprise platforms, built with modern tech to match your business goals.",
    },
    hero: {
      ...VIEW_WORK,
      poster: DevelopmentPoster,
      description: "We build reliable, scalable custom software — from internal tools to enterprise platforms — engineered around your business goals.",
    },
    offers: [
      { title: "Custom Business Software", description: "Tools shaped around how your team actually works.", descriptionWidth: 415, image: Software1 },
      { title: "API Development", description: "Clean, documented interfaces other systems are happy to talk to.", descriptionWidth: 467, image: Software2 },
      { title: "System Integrations", description: "Your existing tools, finally sharing the same data.", descriptionWidth: 415, image: Software3 },
    ],
    proof: {
      heading: "Software that fits the business.",
      intro: "Modern stacks, dependable delivery and systems built to match your goals rather than the other way round.",
      cards: [
        { label: "RELIABLE", title: "Tested before trusted", description: "Automated tests and staged releases keep production calm." },
        { label: "SCALABLE", title: "Ready for what's next", description: "Architecture that grows with users, data and new requirements." },
        { label: "TRANSPARENT", title: "Clear milestones", description: "Scoped sprints and visible progress from kickoff to handover." },
      ],
    },
  },

  /* -------------------------------------------------------------- PRODUCTION */
  commercials: {
    slug: "commercials",
    category: "production",
    title: "Commercials & Promos",
    navLabel: "Commercials",
    seo: {
      title: "Commercials & Promos Services",
      description: "We produce high-quality commercials that tell compelling stories and position your brand as unforgettable in the marketplace.",
    },
    hero: {
      ...VIEW_WORK_AND_SHOWREEL,
      poster: CommercialsPoster,
      description: "We produce high-quality commercials that tell compelling stories and position your brand as unforgettable in the marketplace.",
    },
    offers: [
      { title: "Product Promos", description: "Show your product at its best — before a single word is spoken.", descriptionWidth: 465, art: "commercials-1" },
      { title: "Launch Teasers", description: "Build anticipation that makes your launch day feel like an event.", descriptionWidth: 442, art: "commercials-2" },
      { title: "SaaS Product Demos", description: "Turn a feature walkthrough into a reason to sign up right now.", descriptionWidth: 467, art: "commercials-3" },
      { title: "Product Ads", description: "Ads that stop the scroll and make people actually want to buy.", descriptionWidth: 490, art: "commercials-4" },
    ],
    proof: {
      heading: "Ads that earn their airtime.",
      intro: "Commercial production that positions brands — not just promotes products.",
      cards: [
        { art: "commercials-1", title: "AI Product Launch Video", description: "SaaS product commercial that generated the first 500 sign-ups before the platform went live." },
        { art: "commercials-2", title: "Brand Commercial", description: "Campaign video for a sustainability brand — produced end-to-end in 2 weeks, used across 4 markets." },
        { art: "commercials-3", title: "XR Visualisation", description: "3D scene design and spatial visualisation for immersive enterprise training environments." },
      ],
    },
  },
  "long-format": {
    slug: "long-format",
    category: "production",
    title: "Long Format Videos",
    navLabel: "Long Format",
    seo: {
      title: "Long Format Videos Services",
      description: "From documentaries to podcasts, we craft long-format content that educates, entertains, and deeply engages audiences.",
    },
    hero: {
      ...VIEW_WORK,
      poster: LongFormatPoster,
      description: "From documentaries to podcasts, we craft long-format content that educates, entertains, and deeply engages audiences.",
    },
    offers: [
      { title: "Vlogs Editing", description: "Raw footage turned into content your audience keeps coming back for.", descriptionWidth: 363, art: "long-format-1" },
      { title: "Content Highlights", description: "The best moments — cut, polished, and ready to travel.", descriptionWidth: 322, art: "long-format-2" },
      { title: "Documentaries & Podcasts", description: "Stories worth telling, produced the way they deserve to be heard.", descriptionWidth: 343, art: "long-format-3" },
      { title: "Explainer & Educational Videos", description: "Complex ideas made so clear, anyone gets it on the first watch.", descriptionWidth: 367, art: "long-format-4" },
    ],
    proof: {
      heading: "Content worth watching in full.",
      intro: "Long-form production that holds attention from the first frame to the last.",
      cards: [
        { label: "STORY FIRST", title: "A clear narrative", description: "Shape interviews, footage and ideas into a story your audience can follow." },
        { label: "EDITED TO ENGAGE", title: "Pacing with purpose", description: "Refine the structure, sound and visual rhythm so every sequence earns its place." },
        { label: "READY TO PUBLISH", title: "A complete finish", description: "Bring editing, colour, audio and final delivery together for your chosen platform." },
      ],
    },
  },
  "reels-shorts": {
    slug: "reels-shorts",
    category: "production",
    title: "Reels & Shorts",
    navLabel: "Reels & Shorts",
    seo: {
      title: "Reels & Shorts Services",
      description: "We create engaging reels and short-form content that’s designed to grab attention and perform on social platforms.",
    },
    hero: {
      ...VIEW_WORK,
      poster: ReelsPoster,
      description: "We create engaging reels and short-form content that’s designed to grab attention and perform on social platforms.",
    },
    offers: [
      { title: "Social Media Reels", description: "Designed for the first second — because that's all you get.", descriptionWidth: 379, art: "reels-shorts-1" },
      { title: "Youtube Shorts", description: "Short enough to watch twice, good enough to share.", descriptionWidth: 364, art: "reels-shorts-2" },
      { title: "Animated Ad Creatives", description: "Motion that sells — without a single second of dead air.", descriptionWidth: 499, art: "reels-shorts-3" },
      { title: "Viral-Ready Cuts", description: "Edited for the algorithm. Built for the audience.", descriptionWidth: 415, art: "reels-shorts-4" },
    ],
    proof: {
      heading: "Seconds that do the work.",
      intro: "Short-form content built for the algorithm and designed for the audience.",
      cards: [
        { label: "HOOK FIRST", title: "Make the opening count", description: "Lead with the moment or message that gives viewers a reason to keep watching." },
        { label: "VERTICAL FIRST", title: "Made for the feed", description: "Frame your content, captions and pacing for mobile viewing and short-form platforms." },
        { label: "ON BRAND", title: "A recognisable style", description: "Keep typography, colour and motion consistent across your short-form content." },
      ],
    },
  },
  "motion-graphics": {
    slug: "motion-graphics",
    category: "production",
    title: "Motion Graphics",
    navLabel: "Motion Graphics",
    seo: {
      title: "Motion Graphics Services",
      description: "We bring static ideas to life with motion graphics that communicate clearly, captivate viewers, and elevate your brand storytelling.",
    },
    hero: {
      ...VIEW_WORK,
      poster: MotionPoster,
      description: "We bring static ideas to life with motion graphics that communicate clearly, captivate viewers, and elevate your brand storytelling.",
    },
    offers: [
      { title: "Explainer Animations", description: "Your product's value, visualised in under 60 seconds.", descriptionWidth: 475, art: "motion-graphics-1" },
      { title: "Text & Title Motion Effects", description: "Words that move — and make people stop to read them.", descriptionWidth: 526, art: "motion-graphics-2" },
      { title: "Logo Animations", description: "A logo that doesn't just sit there — it arrives.", descriptionWidth: 415, art: "motion-graphics-3" },
      { title: "Infographic Videos", description: "Data that people actually watch, understand, and remember.", descriptionWidth: 564, art: "motion-graphics-4" },
    ],
    proof: {
      heading: "Motion that makes ideas land.",
      intro: "Animation that communicates in seconds what words take paragraphs to explain.",
      cards: [
        { label: "CLARITY IN MOTION", title: "Make complex ideas clear", description: "Use animated graphics to explain products, processes and information with clarity." },
        { label: "TIMING + RHYTHM", title: "Movement with purpose", description: "Connect transitions, pacing and sound to guide attention through your message." },
        { label: "BRAND IN MOTION", title: "A consistent visual voice", description: "Extend your identity into titles, explainers and branded motion assets." },
      ],
    },
  },
  "3d-animations": {
    slug: "3d-animations",
    category: "production",
    title: "3D Animations",
    navLabel: "3D Animations",
    seo: {
      title: "3D Animations Services",
      description: "Cinematic 3D animations that make your product, space, or story impossible to ignore.",
    },
    hero: {
      ...VIEW_WORK_AND_SHOWREEL,
      poster: ThreeDAnimationsPoster,
      description: "Cinematic 3D animations that make your product, space, or story impossible to ignore.",
    },
    offers: [
      { title: "Product 3D Animations", description: "See your product from every angle — before it even exists.", descriptionWidth: 527, art: "3d-animations-1" },
      { title: "Architectural Visualization", description: "Walk through the space before the first brick is laid.", descriptionWidth: 468, art: "3d-animations-2" },
      { title: "Character Animations", description: "Characters with motion that makes them feel completely real.", descriptionWidth: 415, art: "3d-animations-3" },
      { title: "CGI Animations", description: "Visuals that couldn't be filmed — built frame by frame.", descriptionWidth: 415, art: "3d-animations-4" },
    ],
    proof: {
      heading: "3D that earns the second look.",
      intro: "Cinematic animation that makes products, characters, and spaces unforgettable.",
      cards: [
        { art: "3d-animations-1", title: "3D Cinematic Product Renders and animation", description: "3D product renders for one of the world's most recognized brands such as Nothing, Wroot & More." },
        { art: "3d-animations-2", title: "3D - Game Environment & Assets", description: "Game Environments, Racing car and other 3D assets delivered for penguin cart racing game." },
        { art: "3d-animations-3", title: "XR Visualisation", description: "3D scene design and spatial visualisation for immersive enterprise training environments." },
      ],
    },
  },
};

export const serviceSlugs = serviceCategories.flatMap((category) => category.slugs);

export const getServiceDetail = (slug) => serviceDetails[slug];

export const getServiceCategory = (id) => serviceCategories.find((category) => category.id === id);

// "Next Service" steps through the category and wraps back to its first entry, like the template's pager.
export const getNextService = (slug) => {
  const category = serviceCategories.find((entry) => entry.slugs.includes(slug));
  const index = category.slugs.indexOf(slug);
  return serviceDetails[category.slugs[(index + 1) % category.slugs.length]];
};
