import Button from "./Button";
import ServiceModalList from "./ServiceModalList";
import serviceGalleries from "./services/serviceGalleries";
import InfoDialog from "./InfoDialog";
import Grad from "../assets/img/home/pro-gradient.webp";
import Icon1 from "../assets/img/home/pro-icon1.png";
import Icon2 from "../assets/img/home/pro-icon2.png";
import Icon3 from "../assets/img/home/pro-icon3.png";
import Icon4 from "../assets/img/home/pro-icon4.png";
import Icon5 from "../assets/img/home/pro-icon5.png";
import Arrow from "../assets/img/home/arr-left.png";
import Mgrad from "../assets/img/home/pro-gradient.webp";


const ICONS = {
  "/services/3d-animations": Icon5,
  "/services/commercials": Icon1,
  "/services/reels-shorts": Icon2,
  "/services/long-format": Icon3,
  "/services/motion-graphics": Icon4,
};

const gallery = serviceGalleries.find((item) => item.id === "production");

const ResearchModal = ({ isOpen, onClose }) => (
  <InfoDialog
    isOpen={isOpen}
    onClose={onClose}
    title="Production"
    backdropStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
    contentStyle={{ background: "white", borderRadius: "1rem" }}
    closeClassName="arr-left"
    closeIcon={Arrow}
    media={
      <>
        <img src={Grad} alt="" className="gradient" width="1118" height="600" />
        <img src={Mgrad} alt="" className="mgradient" width="1118" height="600" />
      </>
    }
  >
            <p className="mcp">{gallery.tagline}</p>
            <ServiceModalList gallery={gallery} icons={ICONS} />
            <Button to="/works" text="Portfolio" arrow />
  </InfoDialog>
);

export default ResearchModal;
