import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../style/button.css";
import ArrowIcon from "../assets/img/home/e23f5-hero-intro.svg";
import ArrowRim from "../assets/img/home/917a3.svg";
import ArrowMask from "../assets/img/about/f4a96.svg";
import ArrowGlow from "../assets/img/home/9b392.svg";
import PlainRim from "../assets/img/home/3e10a.svg";
import PlainMask from "../assets/img/shared/81e7e.svg";
import PlainGlow from "../assets/img/home/51ad2.svg";

const SKINS = {
  arrow: { rim: ArrowRim, mask: ArrowMask, glow: ArrowGlow, size: [212, 65] },
  plain: { rim: PlainRim, mask: PlainMask, glow: PlainGlow, size: [213.75, 65.25] },
};

const Button = ({ text, children = text, to, href, arrow = false, icon, className = "", onClick, type = "button", ...props }) => {
  const ref = useRef(null);
  const artRef = useRef(null);
  const skin = SKINS[arrow ? "arrow" : "plain"];
  const [width, height] = skin.size;

  useEffect(() => {
    const update = () => {
      const box = ref.current.getBoundingClientRect();
      artRef.current.style.setProperty("--btn-scale-x", box.width / width);
      artRef.current.style.setProperty("--btn-scale-y", box.height / height);
    };
    const observer = new ResizeObserver(update);
    observer.observe(ref.current);
    update();
    return () => observer.disconnect();
  }, [width, height]);

  const content = (
    <>
      <span ref={artRef} className="ui-btn-art" aria-hidden="true" style={{ width, height }}>
        <img className="ui-btn-rim" src={skin.rim} alt="" />
        <span className="ui-btn-shine" style={{ maskImage: `url("${skin.mask}")`, WebkitMaskImage: `url("${skin.mask}")` }}>
          <img src={skin.glow} alt="" />
        </span>
      </span>
      <span className="ui-btn-label">
        {children}
        {arrow && <img className="ui-btn-arrow" src={ArrowIcon} alt="" />}
        {icon && <img className="ui-btn-icon" src={icon} alt="" />}
      </span>
    </>
  );
  const classes = `ui-btn ${className}`.trim();

  if (to) return <Link ref={ref} to={to} className={classes} onClick={onClick} {...props}>{content}</Link>;
  if (href) return <a ref={ref} href={href} className={classes} onClick={onClick} {...props}>{content}</a>;
  return <button ref={ref} type={type} className={classes} onClick={onClick} {...props}>{content}</button>;
};

export default Button;
