// src/components/Footer.jsx
import React, { useEffect, useRef } from "react";
import "../style/footer.css";
import Cicon from "../assets/img/c-icon.webp";
import Top from "../assets/img/top.webp";
import Footerimg from "../assets/img/footer-video.webp";
import FooterMobile from "../assets/img/footer-mobile.webp";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

// ✅ Animated STRIX letters
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
        <motion.h1 key={i} className="foot-strix" variants={letter}>
          {char}
        </motion.h1>
      ))}
    </motion.div>
  );
};

// ✅ Main Footer Component
const Footer = () => {
  useEffect(() => {
    const scrollBtn = document.querySelector(".scroll-top");
    if (!scrollBtn) return;

    const onScrollTopClick = (e) => {
      e?.preventDefault?.();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    scrollBtn.addEventListener("click", onScrollTopClick);
    return () => scrollBtn.removeEventListener("click", onScrollTopClick);
  }, []);

  return (
    <div className="footer">
      <p className="footer-pp">Is there a fascinating project brewing in your mind?</p>

      <div className="quote">
        <div className="quote1">
          <p>Get quote</p>
          <div className="email-card">info@strixproduction.com</div>
        </div>
        <div className="quote1">
          <p>Get quote</p>
          <div className="email-card">info@strixproduction.com</div>
        </div>
      </div>

      <div className="ft-link-con">
        <div className="ft-links">
          <p className="hea">Contact</p>
          <p className="ft-num">+91 995884094</p>
          <p className="ft-num">+91 8851313109</p>
          <p className="ft-num">Sec-62, Noida</p>
          <p className="ft-num">New Delhi, India</p>
        </div>

        <div className="ft-links">
          <p className="hea">Quick Links</p>
          <p className="ft-num">Home</p>
          <p className="ft-num">Projects</p>
          <p className="ft-num">About</p>
          <p className="ft-num">Blogs</p>
        </div>

        <div className="ft-links">
          <p className="hea">Services</p>
          <ul>
            <li className="ft-num">Build MVP</li>
            <li className="ft-num">UI/UX Design</li>
            <li className="ft-num">Website</li>
            <li className="ft-num">SaaS Promos</li>
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
        <a href="https://www.behance.net/strixproductions">
          <div className="behance ri--behance-fill ft-icons"></div>
        </a>
        <a href="https://dribbble.com/StrixProduction">
          <div className="icon-park-outline--dribble ft-icons"></div>
        </a>
        <a href="https://www.instagram.com/strix_productions">
          <div className="mdi--instagram ft-icons"></div>
        </a>
        <a href="https://x.com/strixproduction">
          <div className="ri--twitter-x-line ft-icons"></div>
        </a>
        <div className="akar-icons--linkedin-v1-fill ft-icons"></div>
        <a href="https://clutch.co/profile/strix-production">
          <img src={Cicon} alt="cicon" />
        </a>
      </div>

      <div className="ft-line"></div>

      {/* ✅ Animated STRIX Section */}
      <FooterLogo />

      <div className="ft-bottom">
        <div className="nothing">
          <Link to='/Url'><p>dot</p></Link>
        </div>
        <p className="ft-year">© 2025 – Strix Production All Rights Reserved</p>
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
