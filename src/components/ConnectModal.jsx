import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/ConnectModal.css"; // CSS file
import { ButtonI } from "./ButtonI";
import Cicon from "../assets/img/c-icon.webp";
import Logo from '../assets/img/Header-s.webp'
import Shadow1 from "../assets/img/shadow1.webp";
import Shadow2 from "../assets/img/shadow2.webp";

const ConnectModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="backdrop" onClick={onClose}></div>

      {/* 🖥️ Desktop modal */}
      <div className="modal-content desktop-modal">
        <button
          className="close-btn fluent--ios-arrow-24-filled"
          onClick={onClose}
        ></button>
        <div className="nav-left">
          <div>
            <div>●</div>
            <p>Connect With Us</p>
          </div>
          <p className="nav-left-p">
            Working On Something Exciting? Let's Talk.
          </p>
          <ButtonI text="Let's Talk" />
        </div>

        <div className="modal-links">
          <Link to="/" onClick={onClose}>Home</Link>
          <Link to="/cs" onClick={onClose}>Services</Link>
          <Link to="/cs" onClick={onClose}>Projects</Link>
          <Link to="/cs" onClick={onClose}>About</Link>
        </div>
      </div>

      {/* 📱 Mobile modal */}
      <div className="modal-content mobile-modal">
        <img className="shadow1 s-nav" src={Shadow1}/>
        <img className="shadow2 s-nav" src={Shadow2}/>
        <div className="mobile-header">
          <div className="left">
                    <img src={Logo} alt="Strix Logo" />
                    <div className="line"></div>
                    <p>Strix</p>
                  </div>
          <button className="close-btn icon-park-outline--left" onClick={onClose}></button>
        </div>

        <div className="mobile-links">
          <Link to="/" onClick={onClose}>Home</Link>
          <Link to="/cs" onClick={onClose}>About</Link>
          <Link to="/cs" onClick={onClose}>Services</Link>
          <Link to="/cs" onClick={onClose}>Projects</Link>
          <Link to="/cs" onClick={onClose}>Blogs</Link>
        </div>

        <div className="mobile-btn">
          <ButtonI text="Let's Talk" />
        </div>

        <div className="mobile-socials">
          <span className="bxl--upwork"></span>
          <span className="ri--behance-fill"></span>
          <span className="icon-park-outline--dribble"></span>
          <span className="mdi--instagram"></span>
          <span className="ri--twitter-x-line"></span>
          <span className="akar-icons--linkedin-v1-fill"></span>
           <img src={Cicon} className="cion" alt="cicon" />
        </div>
      </div>
    </div>
  );
};

export default ConnectModal;
