import { Link } from "react-router-dom";
import ReturnArrow from "../../assets/img/service-pages/figma/1b256.svg";
import NextArrow from "../../assets/img/service-pages/figma/f9867.svg";

const ServiceDetailPager = ({ nextHref }) => (
  <nav className="service-pager" aria-label="Service pages">
    <Link to="/services"><img src={ReturnArrow} alt="" />Return to Services</Link>
    <Link to={nextHref}>Next Service<img src={NextArrow} alt="" /></Link>
  </nav>
);

export default ServiceDetailPager;
