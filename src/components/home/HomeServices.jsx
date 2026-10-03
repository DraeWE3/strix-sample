import { Link } from "react-router-dom";
import Button from "../Button";
import useMobileCarousel from "./useMobileCarousel";
import OrbitMask from "../../assets/img/home/481b8-services.svg";
import CopyTexture from "../../assets/img/home/09427.png";
import DesignLight from "../../assets/img/home/96834.svg";
import DesignLineA from "../../assets/img/home/ffd97.svg";
import DesignLineB from "../../assets/img/home/71f1a.svg";
import DesignIcon from "../../assets/img/home/fb245.svg";
import DevelopmentLight from "../../assets/img/home/45bf6.svg";
import CardLineA from "../../assets/img/home/55b54.svg";
import CardLineB from "../../assets/img/home/0e5a6.svg";
import DevelopmentIcon from "../../assets/img/home/66905.svg";
import ProductionLight from "../../assets/img/home/71c66.svg";
import ProductionIcon from "../../assets/img/home/b20c5.svg";

const services = [
  { title: "Design", copy: "Crafted to Captivate", type: "design", light: DesignLight, lineA: DesignLineA, lineB: DesignLineB, icon: DesignIcon },
  { title: "Development", copy: "Engineered for Performance", type: "development", light: DevelopmentLight, lineA: CardLineA, lineB: CardLineB, icon: DevelopmentIcon },
  { title: "Production", copy: "Elevate your Content", type: "production", light: ProductionLight, lineA: CardLineA, lineB: CardLineB, icon: ProductionIcon },
];

const HomeServices = () => {
  const { mobile, viewportRef, settledIndex, isDragging } = useMobileCarousel();

  return (
    <section className="hm-services" aria-labelledby="hm-services-title">
      <h2 id="hm-services-title" className="hm-section-heading" data-reveal><span>The Architects of<br />Digital Excellence</span></h2>
      <div className="hm-service-orbit" aria-hidden="true">
        <span className="hm-service-orbit-rim" style={{ maskImage: `url("${OrbitMask}")`, WebkitMaskImage: `url("${OrbitMask}")` }} />
      </div>
      <div className={`hm-services-body${isDragging ? " is-dragging" : ""}`}>
        <div
          ref={viewportRef}
          className={`hm-services-grid${mobile ? " carousel-viewport" : ""}`}
          tabIndex={mobile ? 0 : undefined}
          role={mobile ? "region" : undefined}
          aria-label={mobile ? "Explore our services. Use arrow keys or drag to browse." : undefined}
          data-reveal
        >
          {services.map((service) => (
            <Link
              key={service.type}
              to="/services"
              className={`hm-service-card hm-service-${service.type}${mobile ? " carousel-slide" : ""}`}
              aria-label={`Explore ${service.title} services`}
            >
              <div className="hm-service-card-inner">
                <span className="hm-service-light" aria-hidden="true" />
                <span className="hm-service-card-window" aria-hidden="true">
                  <span className="hm-service-card-skin">
                    <span className="hm-service-art-light"><span><img src={service.light} alt="" /></span></span>
                    <span className="hm-service-art-line-a"><span><img src={service.lineA} alt="" /></span></span>
                    <span className="hm-service-art-line-b"><span><img src={service.lineB} alt="" /></span></span>
                  </span>
                </span>
                <span className="hm-service-symbol" aria-hidden="true"><img src={service.icon} alt="" /></span>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
              </div>
            </Link>
          ))}
        </div>
        {mobile && <p className="visually-hidden" aria-live="polite" aria-atomic="true">{`Services: ${settledIndex + 1} of ${services.length}`}</p>}
        <div className="hm-services-intro" data-reveal>
          <p className="hm-body-copy" style={{ backgroundImage: `url("${CopyTexture}")` }}>
            From visuals that speak to systems that scale - We deliver end-to-end solutions that define, design, and develop your brand’s digital presence
          </p>
          <Button to="/services">Our Services</Button>
        </div>
      </div>
    </section>
  );
};

export default HomeServices;
