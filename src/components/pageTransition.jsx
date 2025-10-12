import React, { useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import "../style/pageTrans.css";

const PageTransition = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const overlayRef = useRef(null);
  const logoOverlayRef = useRef(null);
  const blocksRef = useRef([]);
  const isTransitioning = useRef(false);
  const revealTimeoutRef = useRef(null);

  // ✅ Scroll to top when the route actually changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname]);

  const handleRouteChange = useCallback(
    (url) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;
      coverPage(url);
    },
    []
  );

  const onAnchorClick = useCallback(
    (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (!href.startsWith("/")) return; // Only handle internal links
      e.preventDefault();

      if (isTransitioning.current) return;
      if (href !== location.pathname) {
        handleRouteChange(href);
      }
    },
    [location.pathname, handleRouteChange]
  );

  const revealPage = useCallback(() => {
    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);

    gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "right" });
    gsap.to(blocksRef.current, {
      scaleX: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.out",
      transformOrigin: "right",
      onComplete: () => {
        isTransitioning.current = false;
        overlayRef.current.style.pointerEvents = "none";
        logoOverlayRef.current.style.pointerEvents = "none";

        // ✅ Ensure scroll is reset after reveal
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      },
    });

    revealTimeoutRef.current = setTimeout(() => {
      gsap.to(blocksRef.current, {
        scaleX: 0,
        duration: 0.2,
        ease: "power2.out",
        transformOrigin: "right",
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;

    overlayRef.current.innerHTML = "";
    blocksRef.current = [];

    for (let i = 0; i < 20; i++) {
      const block = document.createElement("div");
      block.className = "block";
      overlayRef.current.appendChild(block);
      blocksRef.current.push(block);
    }

    gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });

    revealPage();

    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => link.addEventListener("click", onAnchorClick));

    return () => {
      links.forEach((link) => link.removeEventListener("click", onAnchorClick));
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    };
  }, [location, onAnchorClick, revealPage]);

  const coverPage = (url) => {
    overlayRef.current.style.pointerEvents = "auto";
    logoOverlayRef.current.style.pointerEvents = "auto";

    const tl = gsap.timeline({
      onComplete: () => {
        navigate(url);
      },
    });

    tl.to(blocksRef.current, {
      scaleX: 1,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.out",
      transformOrigin: "left",
    })
      .to(logoOverlayRef.current, { opacity: 1, duration: 0.2 }, "-=0.2")
      .to(logoOverlayRef.current, { opacity: 0, duration: 0.25 }, "+=0.5");
  };

  return (
    <>
      <div ref={overlayRef} className="transition-overlay"></div>
      <div ref={logoOverlayRef} className="logo-overlay"></div>
      {children}
    </>
  );
};

export default PageTransition;
