import { useRef } from "react";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import useScrollReveal from "../animations/useScrollReveal";
import HomeBackdrops from "../components/home/HomeBackdrops";
import HomeHero from "../components/home/HomeHero";
import HomeClients from "../components/home/HomeClients";
import HomeResults from "../components/home/HomeResults";
import HomeServices from "../components/home/HomeServices";
import HomeMvp from "../components/home/HomeMvp";
import HomeStudio from "../components/home/HomeStudio";
import HomePortfolio from "../components/home/HomePortfolio";
import HomeTestimonials from "../components/home/HomeTestimonials";
import HomeContact from "../components/home/HomeContact";
import "../style/fonts.css";
import "../style/home-page.css";

// Home page — built from Figma "Home page Final" (KjGe2oSAxknynPBHR0XZKu, node 916:4816).
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Strix Production",
  "url": "https://www.strixproduction.com/",
  "logo": "https://raw.githubusercontent.com/DraeWE3/strix-sample/refs/heads/main/src/assets/img/brand/Header%20Logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "8851313109",
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.instagram.com/strix_productions",
    "https://x.com/strixproduction"
  ]
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Strix Production",
  "image": "https://raw.githubusercontent.com/DraeWE3/strix-sample/refs/heads/main/src/assets/img/brand/Header%20Logo.png",
  "@id": "",
  "url": "https://www.strixproduction.com/",
  "telephone": "8851313109",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Sec-62",
    "addressLocality": "Noida",
    "postalCode": "201309",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 28.6229,
    "longitude": 77.3640
  },
  "sameAs": [
    "https://www.instagram.com/strix_productions",
    "https://x.com/strixproduction",
    "https://www.strixproduction.com/"
  ]
};

const Home = () => {
  const shellRef = useRef(null);
  useScrollReveal(shellRef, { readyClass: "home-motion-ready", threshold: 0.02, rootMargin: "0px 0px 25px 0px" });

  return (
    <>
      <SEO
        title="End-to-End SaaS Development Company"
        description="End-to-end SaaS development company delivering full-cycle solutions from concept to launch, helping startups and businesses build scalable, high-performance platforms."
        schemas={[organizationSchema, localBusinessSchema]}
      />
      <Nav />
      <main className="home-page-shell" ref={shellRef}>
        <HomeBackdrops />
        <div className="hh-page-stage">
          <HomeHero />
          <HomeClients />
          <HomeResults />
        </div>
        <div className="hm-middle hh-middle">
          <HomeServices />
          <HomeMvp />
          <HomeStudio />
        </div>
        <div className="hl-sections hh-lower">
          <HomePortfolio />
          <HomeTestimonials />
          <HomeContact />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
