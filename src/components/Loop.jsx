import { useEffect, useRef } from "react";
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

const logos = [
  { src: logo1, className: "logo-wurkzen", size: [125, 24] },
  { src: logo2, size: [152, 21] },
  { src: logo3, size: [148, 24] },
  { src: logo4, size: [148, 18] },
  { src: logo5, size: [128, 25] },
  { src: logo6, size: [131, 25] },
  { src: logo7, className: "logo-locovo", size: [87, 15] },
];

const LogoLoop = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia(containerRef);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
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
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="logo-loop" ref={containerRef}>
      <div className="logo-strip">
        {/* Duplicate logos to ensure smooth loop */}
        {logos.concat(logos).map(({ src, className, size: [width, height] }, i) => (
          <div key={i} className="logo-item" aria-hidden={i >= logos.length || undefined}>
            <img src={src} className={className} alt={i >= logos.length ? "" : `logo-${i}`} width={width} height={height} decoding="async" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;
