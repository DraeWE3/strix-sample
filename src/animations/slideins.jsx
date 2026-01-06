// className="slideInTopLeft"
// className="slideInBottomLeft"
// className="slideInTopRight"
// className="slideInBottomRight"
// className="scrollReveal"
// className="slideinLoad"
// className="slideInLeft"
// className="slideInRight"
// className="stagger1"

import { useEffect } from "react";
import { animate } from "framer-motion";

export default function ScrollSlideAnimations() {
  useEffect(() => {
    const animationConfigs = {
      slideInTopLeft: {
        initial: { opacity: 0, x: -80, y: -80, filter: "blur(14px)" },
        animate: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
      },
      slideInBottomLeft: {
        initial: { opacity: 0, x: -80, y: 80, filter: "blur(14px)" },
        animate: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
      },
      slideInTopRight: {
        initial: { opacity: 0, x: 80, y: -80, filter: "blur(14px)" },
        animate: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
      },
      slideInBottomRight: {
        initial: { opacity: 0, x: 80, y: 80, filter: "blur(14px)" },
        animate: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
      },
      slideInLeft: {
        initial: { opacity: 0, x: -80, y: 0, filter: "blur(14px)" },
        animate: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
      },
      slideInRight: {
        initial: { opacity: 0, x: 80, y: 0, filter: "blur(14px)" },
        animate: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            const el = entry.target;
            el.dataset.animated = "true";

            const animationType = Array.from(el.classList).find(cls => 
              Object.keys(animationConfigs).includes(cls)
            );

            if (animationType) {
              const config = animationConfigs[animationType];
              animate(
                el,
                config.animate,
                { duration: 0.9, ease: "easeOut" }
              );
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    Object.keys(animationConfigs).forEach(animationType => {
      const elements = document.querySelectorAll(`.${animationType}`);
      elements.forEach((el) => {
        const config = animationConfigs[animationType];
        el.style.opacity = config.initial.opacity;
        el.style.transform = `translate(${config.initial.x}px, ${config.initial.y}px)`;
        el.style.filter = config.initial.filter;
        el.style.willChange = "transform, opacity, filter";
        observer.observe(el);
      });
    });

    return () => observer.disconnect();
  }, []);

  return null;
}