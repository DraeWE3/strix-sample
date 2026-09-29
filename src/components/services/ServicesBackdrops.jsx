import GlowTopLeft from "../../assets/img/services/f56d7-9984.svg";
import GlowTopRight from "../../assets/img/services/f56d7-9985.svg";
import GlowHeroRight from "../../assets/img/services/08e55-9986.svg";
import GlowHeroLeft from "../../assets/img/services/08e55-9987.svg";
import GlowStatsLeft from "../../assets/img/about/f91ac.svg";
import GlowStatsRight from "../../assets/img/services/f91ac-10283.svg";
import GlowPortfolioLeft from "../../assets/img/services/a190f.svg";
import GlowPortfolioRight from "../../assets/img/services/5adc7.svg";

const ServicesBackdrops = () => {
  return (
    <div className="page-backdrops" aria-hidden="true">
      <img className="backdrop-tl" src={GlowTopLeft} alt="" />
      <img className="backdrop-tr" src={GlowTopRight} alt="" />
      <img className="backdrop-hr" src={GlowHeroRight} alt="" />
      <img className="backdrop-hl" src={GlowHeroLeft} alt="" />
      <img className="backdrop-sl" src={GlowStatsLeft} alt="" />
      <img className="backdrop-sr" src={GlowStatsRight} alt="" />
      <img className="backdrop-pl" src={GlowPortfolioLeft} alt="" />
      <img className="backdrop-pr" src={GlowPortfolioRight} alt="" />
    </div>
  );
};

export default ServicesBackdrops;
