import '../style/nav.css'
import Logo from '../assets/img/Header-s.webp'
import { Link } from "react-router-dom";
import React, { useState } from "react";
import ConnectModal from './ConnectModal';


const Nav = () => {
  // ✅ Hooks must be at the top, before return
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="container">
      <div className="nav animate-nav">
        <div className="left">
          <img src={Logo} alt="Strix Logo" />
          <div className="line"></div>
          <p>Strix</p>
        </div>

        <div className="mid">
          <div><Link className="nav-link" to="/">Home</Link></div>
          <div><Link className="nav-link" to="/cs">Services</Link></div>
          <div><Link className="nav-link" to="/cs">Projects</Link></div>
        </div>

           <button className="hamburger" onClick={openModal}>
          <div className="line top"></div>
          <div className="line bottom"></div>
        </button>
      </div>

      {/* ✅ Modal controlled by state */}
      <ConnectModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Nav;
