import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollGSAP() {
  useEffect(() => {
    if (window.innerWidth < 770) return;

    const sections = document.querySelectorAll(".smoothsection");

    gsap.set(sections, {
      transformStyle: "preserve-3d",
      perspective: 1200,
      willChange: "transform, opacity, filter"
    });

    sections.forEach((section, i) => {
      const next = sections[i + 1];

      // Exit animation
      gsap.fromTo(
        section,
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        {
          opacity: 0,
          y: -140,
          scale: 0.92,
          filter: "blur(20px)",
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        }
      );

      // Enter animation
      if (next) {
        gsap.fromTo(
          next,
          { opacity: 0, y: 250, scale: 1.15, filter: "blur(26px)", zIndex: 10 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.6,
            ease: "power4.out",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top 50%",
              scrub: 2,
            },
          }
        );
      }

      // ✅ Slide-from-top element animations
      const animatedEls = section.querySelectorAll(".delay1, .delay2, .delay3");

      animatedEls.forEach((el) => {
        let delay = 0;

        if (el.classList.contains("delay1")) delay = 0.1;
        if (el.classList.contains("delay2")) delay = 0.35;
        if (el.classList.contains("delay3")) delay = 0.6;

        gsap.fromTo(
          el,
          { opacity: 0, y: -40, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            delay,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return null;
}
