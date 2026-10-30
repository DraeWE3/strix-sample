import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initSmoothScroll, syncSmoothScroll } from "../lib/smoothScroll";

/** Mounts site-wide smooth scrolling and re-targets it when a route change swaps the scroll container. */
const SmoothScroll = () => {
  const { pathname } = useLocation();

  useEffect(() => initSmoothScroll(), []);

  useEffect(() => {
    syncSmoothScroll();
  }, [pathname]);

  return null;
};

export default SmoothScroll;
