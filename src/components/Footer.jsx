// src/components/Footer.jsx
import React, { useEffect } from "react";
import "../style/footer.css";
import Cicon from "../assets/img/c-icon.webp";
import Top from "../assets/img/top.webp";
import Footerimg from "../assets/img/footer-video.webp";
import FooterMobile from '../assets/img/footer-mobile.webp'

const Footer = () => {
  useEffect(() => {
    // find the button in the DOM
    const scrollBtn = document.querySelector(".scroll-top");
    if (!scrollBtn) return;

    // named handler so we can remove it in cleanup
    const onScrollTopClick = (e) => {
      // optional: prevent default if inside a link or form
      e?.preventDefault?.();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    scrollBtn.addEventListener("click", onScrollTopClick);

    return () => {
      scrollBtn.removeEventListener("click", onScrollTopClick);
    };
  }, []); // run once on mount

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
            <li className="ft-num"> Ui/UX Design</li>
            <li className="ft-num">Website</li>
            <li className="ft-num">SaaS Promos</li>
          </ul>
        </div>
        <div className="ft-links">
          <p className="hea">Legal</p>
          <p className="ft-num">Terms of Services</p>
          <p className="ft-num">Privacy Policy</p>
          <p className="ft-num">Cookie Policy</p>
        </div>
      </div>

      <div className="ft-icon">
        <div className="behance ri--behance-fill"></div>
        <div className="icon-park-outline--dribble"></div>
        <div className="mdi--instagram "></div>
        <div className="ri--twitter-x-line"></div>
        <div className="akar-icons--linkedin-v1-fill"></div>
        <img src={Cicon} alt="cicon" />
      </div>

      <div className="ft-line"></div>

      <div className="ft-last">
        <h1>STRIX</h1>
      </div>

      <div className="ft-bottom">
        <div className="nothing">
          <p>scroll Top</p> <img src={Top} alt="top" />
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
