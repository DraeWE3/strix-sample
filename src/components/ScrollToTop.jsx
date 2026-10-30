import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "../lib/smoothScroll";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
