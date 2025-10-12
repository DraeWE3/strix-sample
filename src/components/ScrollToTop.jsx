import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll smoothly to the top whenever the route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // "instant" can be replaced with "auto" or "smooth"
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
