import '../style/nav.css'
import Logo from '../assets/img/layout/Header-s.webp'
import { Link } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ConnectModal from './ConnectModal';
import NavServicesPanel, { NAV_SERVICES_PANEL_ID } from './NavServicesPanel';

const PANEL_QUERY = "(hover: hover) and (min-width: 771px)";
const PANEL_FOCUS_SELECTOR = `#${NAV_SERVICES_PANEL_ID} a`;

const Nav = () => {
  // ✅ Hooks must be at the top, before return
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const navRef = useRef(null);
  const servicesLinkRef = useRef(null);
  const closeTimer = useRef(null);

  const clearCloseTimer = useCallback(() => window.clearTimeout(closeTimer.current), []);
  const closeServices = useCallback(() => { clearCloseTimer(); setServicesOpen(false); }, [clearCloseTimer]);

  const openModal = () => { closeServices(); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  // The Services link still navigates to /services; the panel is a desktop enhancement.
  const openServicesOnHover = (event) => {
    if (event.pointerType !== "mouse" || !window.matchMedia(PANEL_QUERY).matches) return;
    clearCloseTimer();
    setServicesOpen(true);
  };
  // A short delay lets the pointer cross the gap between the navbar and the panel.
  const scheduleCloseServices = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => {
      if (!document.activeElement?.closest(`#${NAV_SERVICES_PANEL_ID}`)) setServicesOpen(false);
    }, 180);
  };
  const enterServicesPanel = (event) => {
    if (!window.matchMedia(PANEL_QUERY).matches) return;
    if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey && servicesOpen)) {
      event.preventDefault();
      clearCloseTimer();
      setServicesOpen(true);
      window.requestAnimationFrame(() => document.querySelector(PANEL_FOCUS_SELECTOR)?.focus());
    }
  };

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  useEffect(() => {
    if (!servicesOpen) return;
    const closeOutside = (event) => { if (!navRef.current?.contains(event.target)) closeServices(); };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      closeServices();
      servicesLinkRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [servicesOpen, closeServices]);

  return (
    <div
      className="containerNav"
      ref={navRef}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeServices(); }}
    >
      <div className="nav animate-nav">
        <Link to="/" className="left" onPointerEnter={closeServices}>
          <img src={Logo} alt="Strix Logo" />
          <div className="linenav"></div>
          <p>Strix</p>
        </Link>

        <div className="mid">
          <div><Link className="nav-link link-button" to="/" onPointerEnter={closeServices}>Home</Link></div>
          <div><Link className="nav-link link-button" to="/about" onPointerEnter={closeServices}>About</Link></div>
          <div>
            <Link
              ref={servicesLinkRef}
              className="nav-link link-button"
              to="/services"
              aria-expanded={servicesOpen}
              aria-controls={servicesOpen ? NAV_SERVICES_PANEL_ID : undefined}
              onPointerEnter={openServicesOnHover}
              onPointerLeave={scheduleCloseServices}
              onKeyDown={enterServicesPanel}
              onClick={closeServices}
            >
              Services
            </Link>
          </div>
          <div><Link className="nav-link link-button" to="/Project" onPointerEnter={closeServices}>Projects</Link></div>
        </div>

        <button className="hamburger" onClick={openModal} onPointerEnter={closeServices}>
          <div className="linenav top"></div>
          <div className="linenav bottom"></div>
        </button>
      </div>

      {servicesOpen && (
        <NavServicesPanel onNavigate={closeServices} onPointerEnter={clearCloseTimer} onPointerLeave={scheduleCloseServices} />
      )}

      {/* ✅ Modal controlled by state */}
      <ConnectModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Nav;
