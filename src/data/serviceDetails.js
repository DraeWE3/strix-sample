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
import DevelopmentPoster from "../assets/img/service-pages/development/dev-bgg.webp";

import Ui1 from "../assets/img/service-pages/design/ui1.png";
import Ui2 from "../assets/img/service-pages/design/ui2.png";
import Ui3 from "../assets/img/service-pages/design/ui3.png";
import Ui4 from "../assets/img/service-pages/design/ui4.png";
import ProductCard1 from "../assets/img/service-pages/design/ui-card1.png";
import ProductCard2 from "../assets/img/service-pages/design/ui-card2.png";
import Brand1 from "../assets/img/service-pages/design/brand1.png";
import Brand2 from "../assets/img/service-pages/design/brand2.png";
import Brand3 from "../assets/img/service-pages/design/brand3.png";
import Brand4 from "../assets/img/service-pages/design/brand4.png";
import Creative1 from "../assets/img/service-pages/design/cdesign1.png";
import Creative2 from "../assets/img/service-pages/design/cdesign2.png";
import Creative3 from "../assets/img/service-pages/design/cdesign3.png";
import Creative4 from "../assets/img/service-pages/design/cdesign4.png";
import ThreeD1 from "../assets/img/service-pages/production/3d1.png";
import ThreeD2 from "../assets/img/service-pages/production/3d2.png";
import ThreeD3 from "../assets/img/service-pages/production/3d3.png";
import ThreeD4 from "../assets/img/service-pages/production/3d4.png";
import WebApp1 from "../assets/img/service-pages/development/webapp.png";
import WebApp2 from "../assets/img/service-pages/development/webapp2.png";
import WebApp3 from "../assets/img/service-pages/development/webapp3.png";
import WebApp4 from "../assets/img/service-pages/development/webapp4.png";
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
      poster: DesignPoster,
      description: "Real outcomes from real products we have shipped.",
    },
    offers: [
      { title: "SaaS Interfaces", description: "Screens your users understand on the first visit — and keep paying for.", descriptionWidth: 465, image: Ui1 },
      { title: "Dashboards", description: "Dense data, calm layout. Every metric where the eye expects it.", descriptionWidth: 442, image: Ui2 },
      { title: "Enterprise Applications", description: "Complex workflows designed so teams stop needing a manual.", descriptionWidth: 467, image: Ui3 },
      { title: "User Flows & Wireframes", description: "The thinking before the pixels — mapped, tested and agreed.", descriptionWidth: 490, image: Ui4 },
    ],
    proof: {
      heading: "Interfaces people come back to.",
      intro: "UI/UX that combines research, strategy and sleek execution — designs that actually perform.",
      cards: [
        { label: "RESEARCH FIRST", title: "Decisions backed by users", description: "Interviews, audits and flows come before a single screen is drawn." },
        { label: "SYSTEMATIC", title: "A design system, not just screens", description: "Components, tokens and states built so the product scales without drift." },
        { label: "BUILT TO SHIP", title: "Handoff developers love", description: "Specs, prototypes and assets ready for engineering from day one." },
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
      ...VIEW_WORK_AND_SHOWREEL,
      poster: DesignPoster,
      description: "End-to-end product design built for retention, not just launch day.",
    },
    offers: [
      { title: "Build Your Own MVP", description: "Core features first — launched early, tested fast, improved with real data.", descriptionWidth: 490, image: ProductCard1 },
      { title: "Hardware + Digital Interfaces", description: "Where the device ends and the app begins, designed as one experience.", descriptionWidth: 499, image: ProductCard2 },
      { title: "Product Concept Development", description: "From a rough idea to a product people can see, click and believe in.", descriptionWidth: 490, image: Ui3 },
      { title: "Interactive Product Mockups", description: "Clickable prototypes that sell the vision before the build.", descriptionWidth: 442, image: Ui4 },
    ],
    proof: {
      heading: "Products built to grow.",
      intro: "Strategy, design and development move together — faster output, better results, less confusion at every step.",
      cards: [
        { label: "ONE FLOW", title: "Idea to build, same team", description: "No handoff gaps and no mixed direction between design, code and production." },
        { label: "LAUNCH EARLY", title: "MVP thinking", description: "Only core features go first, keeping time short and costs under control." },
        { label: "SCALE READY", title: "Structure that lasts", description: "Flexible foundations so adding features later never means rebuilding." },
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
      poster: DesignPoster,
      description: "We design brand systems built to scale with you — not a logo that needs redesigning the moment you grow.",
    },
    offers: [
      { title: "Brand Identity & Guidelines", description: "A logo is the start. The system around it is what people remember.", descriptionWidth: 490, image: Brand1 },
      { title: "Graphic Design", description: "Visuals that carry the brand into every post, deck and print run.", descriptionWidth: 465, image: Brand2 },
      { title: "Brand Strategy & Consulting", description: "Positioning, voice and promise — decided before the design begins.", descriptionWidth: 490, image: Brand3 },
      { title: "Packaging Design", description: "Shelf presence that makes the product the obvious pick.", descriptionWidth: 415, image: Brand4 },
    ],
    proof: {
      heading: "Brands that actually stand out.",
      intro: "Research, strategy and sleek execution — helping startups and enterprises create brands with staying power.",
      cards: [
        { label: "STRATEGY LED", title: "Meaning before marks", description: "Audience, market and positioning shape every visual choice." },
        { label: "CONSISTENT", title: "One voice everywhere", description: "Guidelines that keep the brand recognisable across every touchpoint." },
        { label: "BUILT TO LAST", title: "Identity that scales", description: "Systems flexible enough to grow with new products and markets." },
      ],
    },
  },
  "creative-design": {
    slug: "creative-design",
    category: "design",
    title: "Creative Design",
    navLabel: "Creative Design",
    seo: {
      title: "Creative Design Services — Graphics, Thumbnails & Presentations",
      description: "Strix blends next-gen visuals with strategy, crafting high-impact graphics, thumbnails and presentations that help your brand stand out.",
    },
    hero: {
      ...VIEW_WORK,
      poster: DesignPoster,
      description: " Creative work built to perform across every platform and format.",
    },
    offers: [
      { title: "Social Media Creatives", description: "Scroll-stopping visuals sized and styled for every platform.", descriptionWidth: 465, image: Creative1 },
      { title: "Thumbnails & Banners", description: "The first frame people judge your content by — designed to win the click.", descriptionWidth: 499, image: Creative2 },
      { title: "Pitch Decks & Presentations", description: "Slides that make the story land in the room and in the inbox.", descriptionWidth: 467, image: Creative3 },
      { title: "Marketing Collateral", description: "Brochures, one-pagers and ads that look like one brand.", descriptionWidth: 442, image: Creative4 },
    ],
    proof: {
      heading: "Creative that earns attention.",
      intro: "Research, strategy and sleek execution — helping startups and enterprises create designs that actually perform.",
      cards: [
        { label: "CONCEPT FIRST", title: "An idea behind every visual", description: "Each creative starts from a message, not a template." },
        { label: "ON BRAND", title: "Recognisable at a glance", description: "Typography, colour and layout stay consistent across every format." },
        { label: "FAST TURNAROUND", title: "Campaign-ready delivery", description: "Assets exported for every channel, sized and ready to post." },
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
      poster: DesignPoster,
      description: "From character concepts to production-ready assets — we bring your game world to life in 2D and 3D.",
    },
    offers: [
      { title: "Concept Art", description: "The look of the world, decided before a single asset is built.", descriptionWidth: 442 },
      { title: "Character Design", description: "Characters with personality players recognise from the silhouette alone.", descriptionWidth: 499 },
      { title: "Environment Art", description: "Spaces that tell the story before the dialogue does.", descriptionWidth: 415 },
      { title: "Game UI & Icons", description: "Menus, HUDs and icons that stay out of the way of the fun.", descriptionWidth: 442 },
    ],
    proof: {
      heading: "Game Art that pulls players in.",
      intro: "Assets delivered in the exact format your engine needs – Unity, Unreal, Godot. Named, organised, and import-ready from day one.",
      cards: [
        { logo: "min-maria", label: "Min & Maria", title: "Full Character Visual Suite", description: "2D and 3D character art for a children's animated game – concept to production-ready assets." },
        { logo: "impact-river", label: "Impact River", title: "Complete Gaming Asset Library", description: "Game UI, icons, environments, and collectibles delivered across an entire game universe." },
        { logo: "arhiwar", label: "Arhiwar", title: "XR-Ready Assets", description: "3D game art and interactive assets for an enterprise XR platform used globally." },
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
      poster: DesignPoster,
      description: "Photorealistic renders, cinematic animations, and immersive 3D experiences — crafted to make your product unforgettable.",
    },
    offers: [
      { title: "3D Product Renders", description: "Studio-quality product shots — without the studio.", descriptionWidth: 415, image: ThreeD1 },
      { title: "3D Real Estate Visualization", description: "Walk clients through the space before the first brick is laid.", descriptionWidth: 468, image: ThreeD2 },
      { title: "3D Modeling & Texturing", description: "Accurate models with materials that read as real.", descriptionWidth: 415, image: ThreeD3 },
      { title: "Packaging & Product Mockups", description: "See the final pack on the shelf before it goes to print.", descriptionWidth: 467, image: ThreeD4 },
    ],
    proof: {
      heading: "3D that earns the second look.",
      intro: "Visualization that makes products, spaces and ideas feel real before they are built.",
      cards: [
        { label: "PHOTOREAL", title: "Materials that read as real", description: "Lighting, textures and reflections tuned until the render passes for a photo." },
        { label: "ACCURATE", title: "Built to spec", description: "Models follow drawings and dimensions so what you see is what gets made." },
        { label: "REUSABLE", title: "One model, every angle", description: "Scenes set up so new views, colours and variants render in hours, not weeks." },
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
      poster: DevelopmentPoster,
      description: "We develop scalable, high-performance web apps tailored for business automation, SaaS platforms, and enterprise-level solutions.",
    },
    offers: [
      { title: "SaaS Platforms", description: "Multi-tenant products built to onboard the first user and the ten-thousandth.", descriptionWidth: 499, image: WebApp1 },
      { title: "Custom Dashboards & Panels", description: "Admin and analytics panels that make the data easy to act on.", descriptionWidth: 467, image: WebApp2 },
      { title: "Workflow Automation Tools", description: "Internal tools that remove the spreadsheet from the process.", descriptionWidth: 465, image: WebApp3 },
      { title: "Real-Time Web Applications", description: "Live updates, chat and collaboration that feel instant.", descriptionWidth: 442, image: WebApp4 },
    ],
    proof: {
      heading: "Apps that launch early and stay ready.",
      intro: "Clear plan, simple flow and clean code that works from the first release — and keeps up as demand grows.",
      cards: [
        { label: "ONE PROCESS", title: "Design and code together", description: "The layout feels easy and the system behind it stays stable." },
        { label: "GROWTH SAFE", title: "Built to handle more", description: "More users, more data and new features without rebuilding from zero." },
        { label: "TESTED IN USE", title: "Smooth from day one", description: "Weak flows and extra steps are fixed early so the product loads fast and stays reliable." },
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
