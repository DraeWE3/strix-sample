import Button from "./Button";
import ServiceModalList from "./ServiceModalList";
import serviceGalleries from "./services/serviceGalleries";
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


const ICONS = {
  "/services/ui-ux-design": Icon3,
  "/services/product-design": Icon6,
  "/services/game-art": Icon2,
  "/services/creative-design": Icon5,
  "/services/3d-design": Icon1,
  "/services/branding": Icon4,
};

const gallery = serviceGalleries.find((item) => item.id === "design");

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
            <p className="mcp">{gallery.tagline}</p>
            <ServiceModalList gallery={gallery} icons={ICONS} />
            <Button to="/works" text="Portfolio" arrow />
  </InfoDialog>
);

export default DesignModal;
