import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../style/module.css";
import Grad from '../assets/img/pro-gradient.webp'
import Icon1 from '../assets/img/pro-icon1.png'
import Icon2 from '../assets/img/pro-icon2.png'
import Icon3 from '../assets/img/pro-icon3.png'
import Icon4 from '../assets/img/pro-icon4.png'
import Icon5 from '../assets/img/pro-icon5.png'
import Arrow from '../assets/img/arr-left.png'
import ButtonSmall from "./btn-small";

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

const ResearchModal = ({ isOpen, onClose }) => {
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
             <img src={Grad} alt="" className="gradient" />
            <button className="close-btn arr-left" onClick={onClose}><img src={Arrow} alt="" /></button>
            <h1>Production</h1>
            <p className="mcp">Creating engaging video content and motion graphics that tell your story powerfully.</p>
       <div className="mcp-con">
          <div className="mcp-left">
             <div className="table">
              <img src={Icon1} alt="" className="t-icon" />
               <div className="t-txt">
                <h2>Commercials</h2>
                <p>Product promos, ads, teasers</p>
                </div>
            </div>

            <div className="table">
              <img src={Icon2} alt="" className="t-icon" />
               <div className="t-txt">
                <h2>Reels & Shorts</h2>
                <p>Engaging short format content</p>
                </div>
            </div>

          
       </div>
        <div className="mcp-left">

            <div className="table">
              <img src={Icon3} alt="" className="t-icon" />
               <div className="t-txt">
                <h2>Long Format Content</h2>
                <p>Vlogs, Documentaries, Podcasts etc.</p>
                </div>
            </div>


             <div className="table">
              <img src={Icon4} alt="" className="t-icon" />
               <div className="t-txt">
                <h2>Motion Graphics</h2>
                <p>High quality After effects animations</p>
                </div>
            </div>

          

       </div>
       </div>
         <div className="table threed">
              <img src={Icon5} alt="" className="t-icon" />
               <div className="t-txt">
                <h2>3D Animations</h2>
                <p>Pixar level visuals and rendering</p>
                </div>
            </div>

        < ButtonSmall  text="Portfolio" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResearchModal;
