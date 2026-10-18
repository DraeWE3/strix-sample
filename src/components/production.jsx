import Button from "./Button";
import InfoDialog from "./InfoDialog";
import { Link } from "react-router-dom";
import Grad from "../assets/img/home/pro-gradient.webp";
import Icon1 from "../assets/img/home/pro-icon1.png";
import Icon2 from "../assets/img/home/pro-icon2.png";
import Icon3 from "../assets/img/home/pro-icon3.png";
import Icon4 from "../assets/img/home/pro-icon4.png";
import Icon5 from "../assets/img/home/pro-icon5.png";
import Arrow from "../assets/img/home/arr-left.png";
import Mgrad from "../assets/img/home/pro-gradient.webp";


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
            <p className="mcp">
              Creating engaging video content and motion graphics that tell your
              story powerfully.
            </p>

          <div className="mcp-con">
  <div className="mcp-left">
    <Link to="/services/commercials">
      <div className="table">
        <img src={Icon1} alt="" className="t-icon" width="49" height="49" />
        <div className="t-txt">
          <h2>Commercials</h2>
          <p>Product promos, ads, teasers</p>
        </div>
      </div>
    </Link>

    <Link to="/services/reels-shorts">
      <div className="table">
        <img src={Icon2} alt="" className="t-icon" width="44" height="43" />
        <div className="t-txt">
          <h2>Reels & Shorts</h2>
          <p>Engaging short format content</p>
        </div>
      </div>
    </Link>
  </div>

  <div className="mcp-left">
    <Link to="/services/long-format">
      <div className="table">
        <img src={Icon3} alt="" className="t-icon" width="48" height="47" />
        <div className="t-txt">
          <h2>Long Format Content</h2>
          <p>Vlogs, Documentaries, Podcasts etc.</p>
        </div>
      </div>
    </Link>

    <Link to="/services/motion-graphics">
      <div className="table">
        <img src={Icon4} alt="" className="t-icon" width="48" height="47" />
        <div className="t-txt">
          <h2>Motion Graphics</h2>
          <p>High quality After Effects animations</p>
        </div>
      </div>
    </Link>
  </div>
</div>

<Link to="/services/3d-animations">
  <div className="table threed">
    <img src={Icon5} alt="" className="t-icon" width="47" height="41" />
    <div className="t-txt">
      <h2>3D Animations</h2>
      <p>Pixar level visuals and rendering</p>
    </div>
  </div>
</Link>

            {/* <div className="table threed">
              <img src={Icon5} alt="" className="t-icon" width="47" height="41" />
              <div className="t-txt">
                <h2>3D Animations</h2>
                <p>Pixar level visuals and rendering</p>
              </div>
            </div> */}

            <Button to="/works" text="Portfolio" arrow />
  </InfoDialog>
);

export default ResearchModal;
