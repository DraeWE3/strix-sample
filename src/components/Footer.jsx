// src/components/Footer.jsx
import React, { useRef } from "react";
import "../style/footer.css";
import Top from "../assets/img/layout/top.webp";
import Footerimg from "../assets/img/layout/footer-video.webp";
import FooterMobile from "../assets/img/layout/footer-mobile.webp";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion as Motion, useInView } from "motion/react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { openConsentSettings } from "../lib/analytics";

gsap.registerPlugin(ScrollTrigger);

const FooterLogo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
    },
  };

  return (
    <Motion.div
      ref={ref}
      className="ft-last flex justify-center gap-2 md:gap-3"
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {["S", "T", "R", "I", "X"].map((char, i) => (
        <Motion.h2 key={i} className="foot-strix" variants={letter}>
          {char}
        </Motion.h2>
      ))}
    </Motion.div>
  );
};

const scrollToTop = () => {
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
  window.scrollTo({ top: 0, behavior });
  document.documentElement.scrollTo({ top: 0, behavior });
  document.body.scrollTo({ top: 0, behavior });
};

const Footer = () => {

  return (
    <div className="footer">

      <div className="ft-link-con">
        <div className="ft-links">
          <p className="hea">Contact</p>
          <Link to="/contact"><p className="ft-num">Get a Quote</p></Link>
          <a href="tel:+919958844094"><p className="ft-num">+91 9958844094</p></a>
          <p className="ft-num">New Delhi, India</p>
        </div>

        <div className="ft-links">
          <p className="hea">Quick Links</p>
          <Link to="/"><p className="ft-num">Home</p></Link>
          <Link to="/works"><p className="ft-num">Projects</p></Link>
          <Link to="/about"><p className="ft-num">About</p></Link>
          <Link to="/blog"><p className="ft-num">Blogs</p></Link>
        </div>

        <div className="ft-links">
          <p className="hea">Services</p>
          <Link to="/mvp"><p className="ft-num">Build MVP</p></Link>
          <Link to="/services/ui-ux-design"><p className="ft-num">UI/UX Design</p></Link>
          <Link to="/services/web-dev"><p className="ft-num">Website</p></Link>
          <Link to="/services/commercials"><p className="ft-num">SaaS Promos</p></Link>
        </div>

        <div className="ft-links">
          <p className="hea">Legal</p>
          <Link to="/term"><p className="ft-num">Terms of Services</p></Link>
          <Link to="/policy"><p className="ft-num">Privacy Policy</p></Link>
          <Link to="/cookies"> <p className="ft-num">Cookie Policy</p></Link>
          <button type="button" className="ft-cookie-btn" onClick={openConsentSettings}><span className="ft-num">Cookie Settings</span></button>
        </div>
      </div>

      <div className="ft-icon">
        <a href="https://www.upwork.com/agencies/1799430219619033088/" target="_blank" rel="noopener noreferrer" aria-label="Upwork">
          <div className="simple-icons--upwork ft-icons" aria-hidden="true"></div>
        </a>
        <a href="mailto:info@strixproduction.com" aria-label="Email">
          <div className="mdi--email ft-icons" aria-hidden="true"></div>
        </a>
        <a href="https://www.linkedin.com/company/strix-production/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <div className="akar-icons--linkedin-v1-fill ft-icons" aria-hidden="true"></div>
        </a>
        <a href="https://www.instagram.com/strix_productions" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <div className="mdi--instagram ft-icons" aria-hidden="true"></div>
        </a>
        <a href="https://x.com/strixproduction" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
          <div className="ri--twitter-x-line ft-icons" aria-hidden="true"></div>
        </a>
        <a href="https://www.behance.net/strixproductions" target="_blank" rel="noopener noreferrer" aria-label="Behance">
          <div className="behance ri--behance-fill ft-icons" aria-hidden="true"></div>
        </a>
      </div>

      <div className="ft-line"></div>

      {/* ✅ Animated STRIX Section */}
      <FooterLogo />

      <div className="ft-bottom">
        <div className="nothing"></div>
        <p className="ft-year">© 2026 – Strix Production All Rights Reserved</p>
        <button type="button" className="scroll-top" onClick={scrollToTop} aria-label="Back to top">
          <p>scroll Top</p> <img src={Top} alt="" width="18" height="18" />
        </button>
      </div>

      <img className="footerImg" src={Footerimg} alt="" width="1440" height="817" loading="lazy" decoding="async" />
      <img className="footerImg-mobile" src={FooterMobile} alt="" width="390" height="950" loading="lazy" decoding="async" />
    </div>
  );
};

export default Footer;
