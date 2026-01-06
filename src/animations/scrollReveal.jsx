import { useEffect } from "react";
import { animate } from "framer-motion";

export default function ScrollAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll(".scrollReveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            const el = entry.target;
            el.dataset.animated = "true";

            animate(
              el,
              { opacity: 1, y: 0, filter: "blur(0px)" },
              { duration: 0.9, ease: "easeOut" }
            );
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    elements.forEach((el) => {
      el.style.opacity = 0;
      el.style.transform = "translateY(80px)";
      el.style.filter = "blur(14px)";
      el.style.willChange = "transform, opacity, filter";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}