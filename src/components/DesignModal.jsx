import Button from "./Button";
import { Link } from "react-router-dom";
import InfoDialog from "./InfoDialog";

import Grad from "../assets/img/home/design-gradient.webp";
import Icon1 from "../assets/img/home/design-icon1.png";
import Icon2 from "../assets/img/home/design-icon2.png";
import Icon3 from "../assets/img/home/design-icon3.png";
import Icon4 from "../assets/img/home/design-icon4.png";
import Icon5 from "../assets/img/home/design-icon5.png";
import Icon6 from "../assets/img/home/design-icon6.png";
import Arrow from "../assets/img/home/arr-left.png";
import Mgrad from "../assets/img/home/design-grad-mobile.webp";


const DesignModal = ({ isOpen, onClose }) => (
  <InfoDialog
    isOpen={isOpen}
    onClose={onClose}
    title="Design"
    backdropStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
    contentStyle={{ background: "white", borderRadius: "1rem" }}
    closeClassName="arr-left"
    closeIcon={Arrow}
    media={
      <>
        <img src={Grad} alt="" className="gradient" width="1118" height="600" />
        <img src={Mgrad} alt="" className="mgradient" width="1414" height="2268" />
      </>
    }
  >
            <p className="mcp">
              Crafting intuitive, eye-catching designs for web, apps, and brands
              that stand out.
            </p>

           <div className="mcp-con">
  <div className="mcp-left">
    <Link to="/services/ui-ux-design">
      <div className="table">
        <img src={Icon1} alt="" className="t-icon" width="49" height="49" />
        <div className="t-txt">
          <h2>UI/UX Design</h2>
          <p>Web & Mobile App Design</p>
        </div>
      </div>
    </Link>

    <Link to="/services/product-design">
      <div className="table">
        <img src={Icon2} alt="" className="t-icon" width="44" height="43" />
        <div className="t-txt">
          <h2>Product Design</h2>
          <p>Digital Product, User Experience</p>
        </div>
      </div>
    </Link>

    <Link to="/services/ui-ux-design">
      <div className="table">
        <img src={Icon3} alt="" className="t-icon" width="47" height="42" />
        <div className="t-txt">
          <h2>Mobile App Design</h2>
          <p>User-Friendly Applications</p>
        </div>
      </div>
    </Link>
  </div>

  <div className="mcp-left">
    <Link to="/services/branding">
      <div className="table">
        <img src={Icon4} alt="" className="t-icon" width="48" height="47" />
        <div className="t-txt">
          <h2>Branding</h2>
          <p>Identity, Strategy, Guidelines</p>
        </div>
      </div>
    </Link>

    <Link to="/services/creative-design">
      <div className="table">
        <img src={Icon5} alt="" className="t-icon" width="48" height="47" />
        <div className="t-txt">
          <h2>Creative Design</h2>
          <p>Graphics, Thumbnails, Presentations</p>
        </div>
      </div>
    </Link>

    <Link to="/services/ui-ux-design">
      <div className="table">
        <img src={Icon6} alt="" className="t-icon" width="48" height="47" />
        <div className="t-txt">
          <h2>Website Design</h2>
          <p>Custom Websites, Landing page</p>
        </div>
      </div>
    </Link>
  </div>
</div>

            <Button to="/works" text="Portfolio" arrow />
  </InfoDialog>
);

export default DesignModal;
