import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../style/ConnectModal.css";
import ButtonSmall from "./btn-small";
import Cicon from "../assets/img/c-icon.webp";
import Logo from "../assets/img/Header-s.webp";
import Shadow1 from "../assets/img/shadow1.webp";
import Shadow2 from "../assets/img/shadow2.webp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BuildMVP from "../pages/Cs";
import OurWork from "../pages/Project";
import WhoWeAre from "../pages/About";
import Blog from "../pages/Cs";

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
  exit: { opacity: 0, y: 10 },
};

const ConnectModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="backdrop"
            onClick={onClose}
            variants={backdropVariants}
          />

          {/* 🖥️ Desktop modal */}
          <motion.div className="modal-content desktop-modal" variants={modalVariants}>
            <button
              className="close-btn fluent--ios-arrow-24-filled"
              onClick={onClose}
            ></button>
            <div className="nav-left">
              <motion.div custom={0} variants={itemVariants}>
                <div>●</div>
                <p>Connect With Us</p>
              </motion.div>
              <motion.p custom={1} variants={itemVariants} className="nav-left-p">
                Working On Something Exciting? Let's Talk.
              </motion.p>
              <motion.div custom={2} variants={itemVariants}>
                <ButtonSmall text="Let's Talk" />
              </motion.div>
            </div>

            <div className="modal-links">
  {[
    { text: "Build MVP", path: "/Cs" },
    { text: "Our work", path: "/project" },
    { text: "Who we are", path: "/about" },
    { text: "Blog", path: "/Cs" },
  ].map(({ text, path }, i) => (
    <motion.div key={i} custom={i + 3} variants={itemVariants}>
      <Link to={path} onClick={onClose}>
        {text}
      </Link>
    </motion.div>
  ))}
</div>

          </motion.div>

          {/* 📱 Mobile modal */}
          <motion.div className="modal-content mobile-modal" variants={modalVariants}>
            <img className="shadow1 s-nav" src={Shadow1} />
            <img className="shadow2 s-nav" src={Shadow2} />
            <div className="mobile-header">
              <div className="left">
                <img src={Logo} alt="Strix Logo" />
                <div className="line"></div>
                <p>Strix</p>
              </div>
              <button
                className="close-btn icon-park-outline--left"
                onClick={onClose}
              ></button>
            </div>

          <div className="mobile-links">
  {[
    { text: "Home", path: "/" },
    { text: "About", path: "/about" },
    { text: "Services", path: "/service" },
    { text: "Projects", path: "/project" },
    { text: "Blogs", path: "/Cs" },
  ].map(({ text, path }, i) => (
    <motion.div key={i} custom={i} variants={itemVariants}>
      <Link to={path} onClick={onClose}>
        {text}
      </Link>
    </motion.div>
  ))}
</div>

            <motion.div className="mobile-btn" custom={6} variants={itemVariants}>
              <ButtonSmall text="Let's Talk" />
            </motion.div>

            <motion.div className="mobile-socials" custom={7} variants={itemVariants}>
              <span className="bxl--upwork"></span>
              <span className="ri--behance-fill"></span>
              <span className="icon-park-outline--dribble"></span>
              <span className="mdi--instagram"></span>
              <span className="ri--twitter-x-line"></span>
              <span className="akar-icons--linkedin-v1-fill"></span>
              <img src={Cicon} className="cion" alt="cicon" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectModal;
