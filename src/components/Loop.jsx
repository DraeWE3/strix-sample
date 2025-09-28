import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "../style/loop.css";

// Import images
import slogo1 from "../assets/img/slogo1.webp";
import slogo2 from "../assets/img/slogo2.webp";
import slogo3 from "../assets/img/slogo3.webp";
import slogo4 from "../assets/img/slogo4.webp";
import slogo5 from "../assets/img/slogo5.webp";
import slogo6 from "../assets/img/slogo6.webp";

const logos = [slogo1, slogo2, slogo3, slogo4, slogo5, slogo6];

const LogoLoop = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const strip = containerRef.current.querySelector(".logo-strip");
      const stripWidth = strip.scrollWidth / 2; // width of one set of logos

      gsap.to(strip, {
        x: -stripWidth,
        duration: 30, // speed (lower = faster)
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x) => {
            const current = parseFloat(x);
            // Reset after moving one full set
            return `${current % -stripWidth}px`;
          },
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="logo-loop" ref={containerRef}>
      <div className="logo-strip">
        {/* Duplicate logos to ensure smooth loop */}
        {logos.concat(logos).map((src, i) => (
          <div key={i} className="logo-item">
            <img src={src} alt={`logo-${i}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;
