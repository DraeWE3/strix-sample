import { useCallback, useRef, useState } from "react";
import "../style/fonts.css";
import "../style/services-page.css";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import useScrollReveal from "../animations/useScrollReveal";
import ServicesBackdrops from "../components/services/ServicesBackdrops";
import ServicesHero from "../components/services/ServicesHero";
import ServicesStats from "../components/services/ServicesStats";
import ServicesIntro from "../components/services/ServicesIntro";
import ServicesGallery from "../components/services/ServicesGallery";
import ServicesWhy from "../components/services/ServicesWhy";
import ServicesPortfolio from "../components/services/ServicesPortfolio";
import ServicesContact from "../components/services/ServicesContact";
import ShowreelDialog from "../components/ShowreelDialog";
import serviceGalleries from "../components/services/serviceGalleries";

const REVEAL_OPTIONS = { readyClass: "services-motion-ready", threshold: 0.05, rootMargin: "0px 0px -16px 0px" };

const Services = () => {
  const shellRef = useRef(null);
  const [showreelTrigger, setShowreelTrigger] = useState(null);
  useScrollReveal(shellRef, REVEAL_OPTIONS);

  const openShowreel = useCallback((event) => setShowreelTrigger(event.currentTarget), []);
  const closeShowreel = useCallback(() => setShowreelTrigger(null), []);

  return (
    <div>
      <SEO
        title="Services"
        description="Design, development and production under one roof. Explore Strix Production’s UI/UX design, web development, MVP, motion design and video production services."
        canonical="https://www.strixproduction.com/services"
      />
      <Nav />
      <div className="services-page-shell" ref={shellRef}>
        <ServicesBackdrops />
        <ServicesHero onShowreel={openShowreel} />
        <ServicesStats />
        <ServicesIntro />
        {serviceGalleries.map((gallery) => (
          <ServicesGallery key={gallery.id} gallery={gallery} onShowreel={openShowreel} />
        ))}
        <ServicesWhy />
        <ServicesPortfolio />
        <ServicesContact />
        <ShowreelDialog trigger={showreelTrigger} onClose={closeShowreel} />
      </div>
      <Footer />
    </div>
  );
};

export default Services;
