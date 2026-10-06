import { useEffect, useRef } from "react";
import "../../style/fonts.css";
import "../../style/service-detail.css";
import Nav from "../Navbar";
import Footer from "../Footer";
import SEO from "../SEO";
import useScrollReveal from "../../animations/useScrollReveal";
import ServiceDetailBackdrops from "./ServiceDetailBackdrops";
import ServiceDetailPager from "./ServiceDetailPager";
import ServiceDetailHero from "./ServiceDetailHero";
import ServiceDetailProvide from "./ServiceDetailProvide";
import ServiceDetailProof from "./ServiceDetailProof";
import ServiceDetailWhy from "./ServiceDetailWhy";
import ServiceDetailRelated from "./ServiceDetailRelated";
import ServiceDetailContact from "./ServiceDetailContact";
import { getServiceCategory, getNextService, serviceRoute } from "../../data/serviceDetails";

const REVEAL_OPTIONS = { readyClass: "svc-motion-ready", threshold: 0.08, rootMargin: "0px 0px -20px 0px" };

// Shared layout for every /services/:slug page: existing Nav + generated template sections + existing Footer.
const ServiceDetailPage = ({ service }) => {
  const shellRef = useRef(null);
  useScrollReveal(shellRef, REVEAL_OPTIONS);

  useEffect(() => {
    const shell = shellRef.current;
    const onClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || !shell.contains(link)) return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      history.replaceState(null, "", link.hash);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
    };
    shell.addEventListener("click", onClick);
    return () => shell.removeEventListener("click", onClick);
  }, []);

  const category = getServiceCategory(service.category);
  const next = getNextService(service.slug);

  return (
    <div>
      <SEO title={service.seo.title} description={service.seo.description} canonical={`https://www.strixproduction.com${serviceRoute(service.slug)}`} />
      <Nav />
      <div
        className="service-detail-shell"
        ref={shellRef}
        data-service={service.slug}
        data-cta-mode={service.ctaMode || "attention"}
        style={service.hero.descriptionWidth ? { "--hero-description-width": `${service.hero.descriptionWidth}px` } : undefined}
      >
        <ServiceDetailBackdrops />
        <ServiceDetailPager nextHref={serviceRoute(next.slug)} />
        <main id="main-content" className="service-detail-main">
          <ServiceDetailHero title={service.title} hero={service.hero} />
          <ServiceDetailProvide offers={service.offers} categoryName={category.name} />
          <ServiceDetailProof proof={service.proof} />
          <ServiceDetailWhy />
          <ServiceDetailRelated />
          <ServiceDetailContact />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
