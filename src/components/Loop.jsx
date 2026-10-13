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

// Order follows the Figma client strip: Ryvon, Structly, Axis Bank, Runloop, Wurkzen, Locovo, Abhiwan.
const logos = [
  { src: logo2, className: "logo-ryvon" },
  { src: logo5, className: "logo-structly" },
  { src: logo6, className: "logo-axis" },
  { src: logo3, className: "logo-runloop" },
  { src: logo1, className: "logo-wurkzen" },
  { src: logo7, className: "logo-locovo" },
  { src: logo4, className: "logo-abhiwan" },
];

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
        {logos.concat(logos).map(({ src, className }, i) => (
          <div key={i} className="logo-item">
            <img src={src} className={className} alt={`logo-${i}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;
