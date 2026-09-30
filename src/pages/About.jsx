import { useRef } from "react";
import "../style/fonts.css";
import "../style/about.css";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import useScrollReveal from "../animations/useScrollReveal";
import AboutBackdrops from "../components/about/AboutBackdrops";
import AboutHero from "../components/about/AboutHero";
import AboutClients from "../components/about/AboutClients";
import AboutProof from "../components/about/AboutProof";
import AboutCapabilities from "../components/about/AboutCapabilities";
import AboutTeam from "../components/about/AboutTeam";
import AboutProcess from "../components/about/AboutProcess";
import AboutWork from "../components/about/AboutWork";
import AboutReviews from "../components/about/AboutReviews";
import AboutFAQ from "../components/about/AboutFAQ";
import AboutConversation from "../components/about/AboutConversation";

const About = () => {
  const shellRef = useRef(null);
  useScrollReveal(shellRef);

  return (
    <div>
      <SEO
        title="About Us"
        description="Meet Strix Production: a design, development and production studio for startups, SaaS and technology teams. Explore our people, process and selected work."
        canonical="https://www.strixproduction.com/about"
      />
      <Nav />
      <div className="about-page-shell" ref={shellRef}>
        <AboutBackdrops />
        <AboutHero />
        <AboutClients />
        <AboutProof />
        <AboutCapabilities />
        <AboutTeam />
        <AboutProcess />
        <AboutWork />
        <AboutReviews />
        <AboutFAQ />
        <AboutConversation />
      </div>
      <Footer />
    </div>
  );
};

export default About;
