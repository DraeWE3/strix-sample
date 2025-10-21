// src/components/Footer.jsx
import React, { useEffect } from "react";
import "../style/footer.css";
import Cicon from "../assets/img/c-icon.webp";
import Top from "../assets/img/top.webp";
import Footerimg from "../assets/img/footer-video.webp";
import FooterMobile from '../assets/img/footer-mobile.webp'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

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


     useEffect(() => { 

       const ftLastContainers = document.querySelectorAll('.ft-last');
    
    ftLastContainers.forEach((container) => {
      const footStrix = container.querySelectorAll('.foot-strix');
      
      gsap.fromTo(footStrix,
        {
          x: 100,
          opacity: 0
        },
        {
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          opacity: 1,
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
    
 
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
        <a href="https://www.behance.net/strixproductions"><div className="behance ri--behance-fill ft-icons"></div></a>
        <a href="https://dribbble.com/StrixProduction"><div className="icon-park-outline--dribble ft-icons"></div></a>
         <a href="https://www.instagram.com/strix_productions"><div className="mdi--instagram ft-icons "></div></a>
        <a href="https://x.com/strixproduction"><div className="ri--twitter-x-line ft-icons" ></div></a>
        <div className="akar-icons--linkedin-v1-fill ft-icons"></div>
         <a href="https://clutch.co/profile/strix-production"><img src={Cicon} alt="cicon" /></a>
      </div>

      <div className="ft-line"></div>

      <div className="ft-last">
        <h1 className="foot-strix foot-strix1">S</h1>
        <h1 className="foot-strix">T</h1>
        <h1 className="foot-strix">R</h1>
        <h1 className="foot-strix">I</h1>
        <h1 className="foot-strix">X</h1>
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
