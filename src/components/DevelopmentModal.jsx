import Button from "./Button";
import InfoDialog from "./InfoDialog";
import Grad from "../assets/img/home/dev-gradient.webp";
import Icon1 from "../assets/img/home/dev-icon1.png";
import Icon2 from "../assets/img/home/dev-icon2.png";
import Icon3 from "../assets/img/home/dev-icon3.png";
import Icon4 from "../assets/img/home/dev-icon4.png";
import Icon5 from "../assets/img/home/dev-icon5.png";
import Icon6 from "../assets/img/home/dev-icon6.png";
import Arrow from "../assets/img/home/arr-left.png";
import Mgrad from "../assets/img/home/dev-grad-mobile.webp";
import { Link } from "react-router-dom";


const DevelopmentModal = ({ isOpen, onClose }) => (
  <InfoDialog
    isOpen={isOpen}
    onClose={onClose}
    title="Development"
    closeIcon={Arrow}
    media={
      <>
        <img src={Grad} className="gradient" alt="" width="1118" height="600" />
        <img src={Mgrad} alt="" className="mgradient" width="1414" height="2268" />
      </>
    }
  >
            <p className="mcp">
              Building fast, functional, and scalable digital experiences across
              platforms.
            </p>
           <div className="mcp-con">
  <div className="mcp-left">
    <Link to="/services/web-app">
      <div className="table">
        <img src={Icon1} alt="" className="t-icon" width="48" height="49" />
        <div className="t-txt">
          <h2>Web Applications</h2>
          <p>Site builder solutions</p>
        </div>
      </div>
    </Link>

    <Link to="/services/interactive-web">
      <div className="table">
        <img src={Icon2} alt="" className="t-icon" width="43" height="43" />
        <div className="t-txt">
          <h2>Interactive Websites</h2>
          <p>Real-time interactions</p>
        </div>
      </div>
    </Link>

    <Link to="/services/web-dev">
      <div className="table">
        <img src={Icon3} alt="" className="t-icon" width="46" height="41" />
        <div className="t-txt">
          <h2>Website Development</h2>
          <p>Front-End & Back-End Development</p>
        </div>
      </div>
    </Link>
  </div>

  <div className="mcp-left">
    <Link to="/services/app-dev">
      <div className="table">
        <img src={Icon4} alt="" className="t-icon" width="48" height="47" />
        <div className="t-txt">
          <h2>Mobile App Development</h2>
          <p>IOS, Android, Cross-platform</p>
        </div>
      </div>
    </Link>

    <Link to="/ecommerce">
      <div className="table">
        <img src={Icon5} alt="" className="t-icon" width="48" height="47" />
        <div className="t-txt">
          <h2>E-Commerce</h2>
          <p>Custom e-commerce platforms</p>
        </div>
      </div>
    </Link>

    <Link to="/services/software-dev">
      <div className="table">
        <img src={Icon6} alt="" className="t-icon" width="48" height="47" />
        <div className="t-txt">
          <h2>Maintenance & Hosting</h2>
          <p>Performance optimization, Setup</p>
        </div>
      </div>
    </Link>
  </div>
</div>
            <Button to="/works" text="Portfolio" arrow />
  </InfoDialog>
);

export default DevelopmentModal;
