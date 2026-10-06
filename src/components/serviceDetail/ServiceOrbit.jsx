// Blurred light + masked ring behind the section headings.
const ServiceOrbit = ({ className }) => (
  <div className={`ds-orbit ${className}`} aria-hidden="true">
    <div className="ds-orbit-light" />
    <div className="ds-orbit-ring" />
  </div>
);

export default ServiceOrbit;
