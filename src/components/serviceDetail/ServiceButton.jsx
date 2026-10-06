import { Link } from "react-router-dom";
import ButtonRim from "../../assets/img/service-pages/figma/3e10a.svg";
import ButtonGlow from "../../assets/img/service-pages/figma/51ad2.svg";

// Pill button from the service template (hero actions + offer cards).
const ServiceButton = ({ children, to, href, buttonRef, ...props }) => {
  const content = (
    <>
      <img className="service-button__rim" src={ButtonRim} alt="" aria-hidden="true" />
      <span className="service-button__glow" aria-hidden="true"><img src={ButtonGlow} alt="" /></span>
      <span>{children}</span>
    </>
  );
  if (to) return <Link className="service-button" to={to} {...props}>{content}</Link>;
  if (href) return <a className="service-button" href={href} {...props}>{content}</a>;
  return <button className="service-button" type="button" ref={buttonRef} {...props}>{content}</button>;
};

export default ServiceButton;
