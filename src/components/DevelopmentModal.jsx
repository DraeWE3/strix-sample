import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../style/module.css";
import Grad from '../assets/img/dev-gradient.webp'
import Icon1 from '../assets/img/dev-icon1.png'
import Icon2 from '../assets/img/dev-icon2.png'
import Icon3 from '../assets/img/dev-icon3.png'
import Icon4 from '../assets/img/dev-icon4.png'
import Icon5 from '../assets/img/dev-icon5.png'
import Icon6 from '../assets/img/dev-icon6.png'
import Arrow from '../assets/img/arr-left.png'
import ButtonSmall from "./btn-small";
import Mgrad from '../assets/img/dev-grad-mobile.webp'

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const DevelopmentModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  return (
       <AnimatePresence>
          {isOpen && (
            <motion.div className="modal" initial="hidden" animate="visible" exit="exit">
              <motion.div className="backdrop" onClick={onClose} variants={backdropVariants} />
              <motion.div className="modal-content2" variants={modalVariants}>
                  <img src={Grad} className="gradient" alt=""/>
                  <img src={Mgrad} alt="" className="mgradient" />
                <button className="close-btnmode " onClick={onClose}><img src={Arrow} alt="" /></button>
                <h1>Development</h1>
                <p className="mcp">Building fast, functional, and scalable digital experiences across platforms.</p>
           <div className="mcp-con">
              <div className="mcp-left">
                 <div className="table">
                  <img src={Icon1} alt="" className="t-icon" />
                   <div className="t-txt">
                    <h2>Web Applications</h2>
                    <p>Site builder solutions</p>
                    </div>
                </div>
    
                <div className="table">
                  <img src={Icon2} alt="" className="t-icon" />
                   <div className="t-txt">
                    <h2>Interactive Websites</h2>
                    <p>Real-time interactions</p>
                    </div>
                </div>
    
                <div className="table">
                  <img src={Icon3} alt="" className="t-icon" />
                   <div className="t-txt">
                    <h2>Website Development</h2>
                    <p>Front-End & Back-End Development</p>
                    </div>
                </div>
           </div>
            <div className="mcp-left">
                 <div className="table">
                  <img src={Icon4} alt="" className="t-icon" />
                   <div className="t-txt">
                    <h2>Mobile App Development</h2>
                    <p>IOS. Android, Cross-platform</p>
                    </div>
                </div>
    
                <div className="table">
                  <img src={Icon5} alt="" className="t-icon" />
                   <div className="t-txt">
                    <h2>E-Commerce</h2>
                    <p>Custom e-commerce platforms</p>
                    </div>
                </div>
    
                <div className="table">
                  <img src={Icon6} alt="" className="t-icon" />
                   <div className="t-txt">
                    <h2>Maintenance & Hosting</h2>
                    <p>Performance optimization, Setup</p>
                    </div>
                </div>
           </div>
           </div>
           < ButtonSmall  text="Portfolio" />
          
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
  );
};

export default DevelopmentModal;
