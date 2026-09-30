import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Figma glow buttons. Each skin is { rim, mask, glow } exported for its section;
// the SVGs keep their original effect padding, so they are never resized directly.

const SmartLink = ({ href, children, ...props }) =>
  href.startsWith("/") ? <Link to={href} {...props}>{children}</Link> : <a href={href} {...props}>{children}</a>;

const HERO_SIZES = { primary: [212, 65], standard: [213.75, 65.25] };

// Hero-style button: the artwork is authored at a fixed size and scaled to the
// rendered button so responsive sizes keep the rim and glow aligned.
export const HeroButton = ({ href, skin, arrow, primary = false, children }) => {
  const buttonRef = useRef(null);
  const artRef = useRef(null);
  const [width, height] = HERO_SIZES[primary ? "primary" : "standard"];

  useEffect(() => {
    const update = () => {
      const box = buttonRef.current.getBoundingClientRect();
      artRef.current.style.setProperty("--hh-scale-x", box.width / width);
      artRef.current.style.setProperty("--hh-scale-y", box.height / height);
    };
    const observer = new ResizeObserver(update);
    observer.observe(buttonRef.current);
    update();
    return () => observer.disconnect();
  }, [width, height]);

  return (
    <Link ref={buttonRef} to={href} className={`hh-button${primary ? " hh-button-primary" : ""}`}>
      <span ref={artRef} className="hh-button-art" style={{ width, height }}>
        <img className="hh-button-rim" src={skin.rim} alt="" />
        <span className="hh-button-shine" aria-hidden="true" style={{ maskImage: `url("${skin.mask}")` }}>
          <img src={skin.glow} alt="" />
        </span>
      </span>
      <span className="hh-button-label">
        {children}
        {arrow && <img className="hh-button-arrow" src={arrow} alt="" />}
      </span>
    </Link>
  );
};

export const MiddleButton = ({ href, skin, arrow, kind = "standard", children }) => (
  <Link to={href} className={`hm-button hm-button-${kind}`}>
    <img className="hm-button-rim" src={skin.rim} alt="" aria-hidden="true" />
    <span
      className="hm-button-mask"
      aria-hidden="true"
      style={{ maskImage: `url("${skin.mask}")`, WebkitMaskImage: `url("${skin.mask}")` }}
    >
      <img className="hm-button-glow" src={skin.glow} alt="" />
    </span>
    <span className="hm-button-label">{children}</span>
    {arrow && <span className="hm-button-arrow" aria-hidden="true"><img src={arrow} alt="" /></span>}
  </Link>
);

export const GlassButton = ({ href, skin, icon, iconClassName = "hl-button-arrow", className = "", children, ...props }) => (
  <SmartLink href={href} className={`hl-glass-button ${className}`} {...props}>
    <span className="hl-button-art" aria-hidden="true">
      <img className="hl-button-rim" src={skin.rim} alt="" draggable="false" />
      <span
        className="hl-button-light"
        style={{ maskImage: `url("${skin.mask}")`, WebkitMaskImage: `url("${skin.mask}")` }}
      >
        <img src={skin.glow} alt="" draggable="false" />
      </span>
    </span>
    <span className="hl-button-label">
      {children}
      <img className={iconClassName} src={icon} alt="" draggable="false" />
    </span>
  </SmartLink>
);
