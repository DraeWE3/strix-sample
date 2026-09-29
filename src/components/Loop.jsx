import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "../style/loop.css";

// Import images
import logo1 from "../assets/img/shared/logos/logo1.svg";
import logo2 from "../assets/img/shared/logos/logo2.svg";
import logo3 from "../assets/img/shared/logos/logo3.svg";
import logo4 from "../assets/img/shared/logos/logo4.svg";
import logo5 from "../assets/img/shared/logos/logo5.svg";
import logo6 from "../assets/img/shared/logos/logo6.svg";
import logo7 from "../assets/img/shared/logos/logo7.svg";

const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

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
