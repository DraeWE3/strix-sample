import Button from "./Button";
import ServiceModalList from "./ServiceModalList";
import serviceGalleries from "./services/serviceGalleries";
import InfoDialog from "./InfoDialog";
import Grad from "../assets/img/home/dev-gradient.webp";
import Icon1 from "../assets/img/home/dev-icon1.png";
import Icon2 from "../assets/img/home/dev-icon2.png";
import Icon3 from "../assets/img/home/dev-icon3.png";
import Icon4 from "../assets/img/home/dev-icon4.png";
import Icon6 from "../assets/img/home/dev-icon6.png";
import Arrow from "../assets/img/home/arr-left.png";
import Mgrad from "../assets/img/home/dev-grad-mobile.webp";


const ICONS = {
  "/services/web-app": Icon1,
  "/services/web-dev": Icon3,
  "/services/app-dev": Icon4,
  "/services/interactive-web": Icon2,
  "/services/software-dev": Icon6,
};

const gallery = serviceGalleries.find((item) => item.id === "development");

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
            <p className="mcp">{gallery.tagline}</p>
            <ServiceModalList gallery={gallery} icons={ICONS} />
            <Button to="/works" text="Portfolio" arrow />
  </InfoDialog>
);

export default DevelopmentModal;
