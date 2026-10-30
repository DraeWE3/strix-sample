import React, { useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import "../style/pageTrans.css";
import { scrollToTop } from "../lib/smoothScroll";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Resolves an anchor click to an in-app path, or null when the browser should handle it. */
const internalTarget = (event, anchor) => {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const target = anchor.getAttribute("target");
  if (target && target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;
  if ((anchor.getAttribute("rel") || "").split(/\s+/).includes("external")) return null;

  const href = anchor.getAttribute("href");
  if (href === null) return null;
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;

  const samePage = url.pathname === window.location.pathname && url.search === window.location.search;
  if (samePage && url.hash) return null;
  return { path: `${url.pathname}${url.search}${url.hash}`, samePage };
};

const setPointerEvents = (refs, interactive) => {
  refs.forEach((ref) => {
    if (ref.current) ref.current.style.pointerEvents = interactive ? "auto" : "none";
  });
};

const PageTransition = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageKey = `${location.pathname}${location.search}`;

  const overlayRef = useRef(null);
  const logoOverlayRef = useRef(null);
  const blocksRef = useRef([]);
  const isTransitioning = useRef(false);
  const revealTimeoutRef = useRef(null);
  const coverTimelineRef = useRef(null);
  const fallbackRef = useRef(null);

  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  const revealPage = useCallback(() => {
    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);

    if (!blocksRef.current.length) return;

    if (prefersReducedMotion()) {
      gsap.set(blocksRef.current, { scaleX: 0 });
      isTransitioning.current = false;
      setPointerEvents([overlayRef, logoOverlayRef], false);
      return;
    }

    gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "right" });

    gsap.to(blocksRef.current, {
      scaleX: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.out",
      transformOrigin: "right",
      onStart: scrollToTop,
      onComplete: () => {
        isTransitioning.current = false;
        setPointerEvents([overlayRef, logoOverlayRef], false);
      },
    });

    revealTimeoutRef.current = setTimeout(() => {
      if (!blocksRef.current.length) return;

      gsap.to(blocksRef.current, {
        scaleX: 0,
        duration: 0.2,
        ease: "power2.out",
        transformOrigin: "right",
      });
    }, 1000);
  }, []);

  const coverPage = useCallback(
    (url) => {
      scrollToTop();
      setPointerEvents([overlayRef, logoOverlayRef], true);

      const tl = gsap.timeline({
        onStart: scrollToTop,
        onComplete: () => {
          navigate(url);
          scrollToTop();
          // If no new page commits (e.g. the navigation was superseded), don't stay covered.
          clearTimeout(fallbackRef.current);
          fallbackRef.current = setTimeout(() => {
            if (isTransitioning.current) revealPage();
          }, 4000);
        },
      });
      coverTimelineRef.current = tl;

      if (blocksRef.current.length) {
        tl.to(blocksRef.current, {
          scaleX: 1,
          duration: 0.4,
          stagger: 0.02,
          ease: "power2.out",
          transformOrigin: "left",
        });
      }

      if (logoOverlayRef.current) {
        tl.to(logoOverlayRef.current, { opacity: 1, duration: 0.2 }, "-=0.2")
          .to(logoOverlayRef.current, { opacity: 0, duration: 0.25 }, "+=0.5");
      }
    },
    [navigate, revealPage]
  );

  // Back/forward during a transition cancels it instead of leaving the page covered.
  useEffect(() => {
    const onPopState = () => {
      if (!isTransitioning.current) return;
      coverTimelineRef.current?.kill();
      if (logoOverlayRef.current) gsap.to(logoOverlayRef.current, { opacity: 0, duration: 0.2 });
      revealPage();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [revealPage]);

  const handleRouteChange = useCallback(
    (url) => {
      if (isTransitioning.current) return;
      if (prefersReducedMotion()) {
        navigate(url);
        return;
      }
      isTransitioning.current = true;
      coverPage(url);
    },
    [coverPage, navigate]
  );

  const handleRouteChangeRef = useRef(handleRouteChange);
  useEffect(() => {
    handleRouteChangeRef.current = handleRouteChange;
  }, [handleRouteChange]);

  // One document-level listener. During capture it attaches a target-phase listener to the
  // clicked anchor, which runs after ancestor capture handlers (e.g. drag-click suppression)
  // but before React's root handler, so <Link> sees defaultPrevented and doesn't navigate too.
  useEffect(() => {
    const onAnchorClick = (event) => {
      const anchor = event.currentTarget;
      anchor.removeEventListener("click", onAnchorClick);
      const resolved = internalTarget(event, anchor);
      if (!resolved) return;
      event.preventDefault();
      if (isTransitioning.current || resolved.samePage) return;
      handleRouteChangeRef.current(resolved.path);
    };

    const onDocumentClick = (event) => {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (anchor) anchor.addEventListener("click", onAnchorClick);
    };

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
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

    clearTimeout(fallbackRef.current);
    revealPage();

    return () => {
      if (revealTimeoutRef.current)
        clearTimeout(revealTimeoutRef.current);
    };
  }, [pageKey, revealPage]);

  return (
    <>
      <div ref={overlayRef} className="transition-overlay"></div>
      <div ref={logoOverlayRef} className="logo-overlay"></div>
      {children}
    </>
  );
};

export default PageTransition;
