import BackdropHero from "../../assets/img/about/2e651.svg";
import BackdropTopVector from "../../assets/img/about/25320.svg";
import BackdropTeam from "../../assets/img/about/c5e3f.svg";
import BackdropReview from "../../assets/img/about/df947.svg";
import BackdropSide from "../../assets/img/about/1673e.svg";
import BackdropProcess from "../../assets/img/shared/f91ac.svg";

const AboutBackdrops = () => {
  return (
    <div className="about-page-backdrops" aria-hidden="true">
      <img className="about-backdrop-hero" src={BackdropHero} alt="" />
      <div className="about-backdrop-top-vector"><img src={BackdropTopVector} alt="" /></div>
      <img className="about-backdrop-team" src={BackdropTeam} alt="" />
      <img className="about-backdrop-review" src={BackdropReview} alt="" />
      <img className="about-backdrop-side-one" src={BackdropSide} alt="" />
      <img className="about-backdrop-side-two" src={BackdropSide} alt="" />
      <img className="about-backdrop-side-three" src={BackdropSide} alt="" />
      <img className="about-backdrop-side-four" src={BackdropSide} alt="" />
      <img className="about-backdrop-side-five" src={BackdropSide} alt="" />
      <img className="about-backdrop-process-left" src={BackdropProcess} alt="" />
      <img className="about-backdrop-process-right" src={BackdropProcess} alt="" />
    </div>
  );
};

export default AboutBackdrops;
