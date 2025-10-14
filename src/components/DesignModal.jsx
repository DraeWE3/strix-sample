import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../style/module.css";
import Grad from '../assets/img/design-gradient.webp'
import Icon1 from '../assets/img/design-icon1.png'
import Icon2 from '../assets/img/design-icon2.png'
import Icon3 from '../assets/img/design-icon3.png'
import Icon4 from '../assets/img/design-icon4.png'
import Icon5 from '../assets/img/design-icon5.png'
import Icon6 from '../assets/img/design-icon6.png'
import Arrow from '../assets/img/arr-left.png'
import ButtonSmall from "./btn-small";
import Mgrad from "../assets/img/design-grad-mobile.webp"

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

const DesignModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
  style={{ zIndex: 999999999999 }}
  className="modal"
  initial="hidden"
  animate="visible"
  exit="exit"
>
          <motion.div className="backdrop" onClick={onClose} variants={backdropVariants} />
          <motion.div className="modal-content2" variants={modalVariants}>
             <img src={Grad} alt="" className="gradient" />
             <img src={Mgrad} alt="" className="mgradient" />
            <button className="close-btnmode arr-left" onClick={onClose}><img src={Arrow} alt="" /></button>
            <h1>Design</h1>
            <p className="mcp">Crafting intuitive, eye-catching designs for web, apps, and brands that stand out.</p>
       <div className="mcp-con">
          <div className="mcp-left">
             <Link to='/uiux'>
             <div className="table">
              <img src={Icon1} alt="" className="t-icon" />
               <div className="t-txt">
                <h2>UI/UX Design</h2>
                <p>Web & Mobile App Design</p>
                </div>
            </div></Link>

            <div className="table">
              <img src={Icon2} alt="" className="t-icon" />
               <div className="t-txt">
                <h2>Product Design</h2>
                <p>Digital Product, User Experience</p>
                </div>
            </div>

            <div className="table">
              <img src={Icon3} alt="" className="t-icon" />
               <div className="t-txt">
                <h2>Mobile App Design</h2>
                <p>User-Friendly Applications</p>
                </div>
            </div>
       </div>
        <div className="mcp-left">
             <div className="table">
              <img src={Icon4} alt="" className="t-icon" />
               <div className="t-txt">
                <h2>Branding</h2>
                <p>Identity, Strategy, Guidelines</p>
                </div>
            </div>

            <div className="table">
              <img src={Icon5} alt="" className="t-icon" />
               <div className="t-txt">
                <h2>Creative Design</h2>
                <p>Graphics, Thumbnails, Presentations</p>
                </div>
            </div>

            <div className="table">
              <img src={Icon6} alt="" className="t-icon" />
               <div className="t-txt">
                <h2>Website Design</h2>
                <p>Custom Websites, Landing page</p>
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

export default DesignModal;
