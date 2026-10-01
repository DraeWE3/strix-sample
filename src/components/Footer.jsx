// src/components/Footer.jsx
import React, { useEffect, useRef } from "react";
import "../style/footer.css";
import Cicon from "../assets/img/shared/c-icon.webp";
import Top from "../assets/img/layout/top.webp";
import Footerimg from "../assets/img/layout/footer-video.webp";
import FooterMobile from "../assets/img/layout/footer-mobile.webp";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { Link } from "react-router-dom";

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
    <motion.div
      ref={ref}
      className="ft-last flex justify-center gap-2 md:gap-3"
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {["S", "T", "R", "I", "X"].map((char, i) => (
        <motion.h2 key={i} className="foot-strix" variants={letter}>
          {char}
        </motion.h2>
      ))}
    </motion.div>
  );
};

const Footer = () => {
  useEffect(() => {
    const scrollBtn = document.querySelector(".scroll-top");
    if (!scrollBtn) return;

    const onScrollTopClick = (e) => {
      e?.preventDefault?.();
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
      document.body.scrollTo({ top: 0, behavior: "smooth" });
    };

    scrollBtn.addEventListener("click", onScrollTopClick);
    return () => scrollBtn.removeEventListener("click", onScrollTopClick);
  }, []);

  return (
    <div className="footer">

      <div className="ft-link-con">
        <div className="ft-links">
          <p className="hea">Contact</p>
          <Link to="/contact"><p className="ft-num">Get a Quote</p></Link>
          <p className="ft-num">+91 995884094</p>
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
          <ul>
            <li className="ft-num"><Link to="/mvp">Build MVP</Link></li>
            <li className="ft-num"><Link to="/uiux">UI/UX Design</Link></li>
            <li className="ft-num"><Link to="/webdesign">Website</Link></li>
            <li className="ft-num"><Link to="/commercials">SaaS Promos</Link></li>
          </ul>
        </div>

        <div className="ft-links">
          <p className="hea">Legal</p>
          <Link to="/term"><p className="ft-num">Terms of Services</p></Link>
          <Link to="/policy"><p className="ft-num">Privacy Policy</p></Link>
          <Link to="/cookies"> <p className="ft-num">Cookie Policy</p></Link>
        </div>
      </div>

      <div className="ft-icon">
        <a href="https://www.upwork.com/agencies/1799430219619033088/" target="_blank" rel="noopener noreferrer">
          <div className="simple-icons--upwork ft-icons"></div>
        </a>
        <a href="mailto:info@strixproduction.com">
          <div className="mdi--email ft-icons"></div>
        </a>
        <a href="https://www.linkedin.com/company/strix-production/" target="_blank" rel="noopener noreferrer">
          <div className="akar-icons--linkedin-v1-fill ft-icons"></div>
        </a>
        <a href="https://www.instagram.com/strix_productions" target="_blank">
          <div className="mdi--instagram ft-icons"></div>
        </a>
        <a href="https://x.com/strixproduction" target="_blank">
          <div className="ri--twitter-x-line ft-icons"></div>
        </a>
        <a href="https://www.behance.net/strixproductions" target="_blank">
          <div className="behance ri--behance-fill ft-icons"></div>
        </a>
      </div>

      <div className="ft-line"></div>

      {/* ✅ Animated STRIX Section */}
      <FooterLogo />

      <div className="ft-bottom">
        <div className="nothing">
          <Link to='/Url'><p>dot</p></Link>
        </div>
        <p className="ft-year">© 2026 – Strix Production All Rights Reserved</p>
        <div className="scroll-top">
          <p>scroll Top</p> <img src={Top} alt="top" />
        </div>
      </div>

      <img className="footerImg" src={Footerimg} alt="footer" />
      <img className="footerImg-mobile" src={FooterMobile} alt="footer" />
    </div>
  );
};

export default Footer;
