import { useEffect, useState } from "react";
import useScrollCarousel from "../../animations/useScrollCarousel";

const MOBILE_QUERY = "(max-width: 650px)";

// Card rows that are static layouts on desktop and swipeable carousels on phones.
const useMobileCarousel = () => {
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const update = () => setMobile(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return { mobile, ...useScrollCarousel({ align: "center", enabled: mobile }) };
};

export default useMobileCarousel;
