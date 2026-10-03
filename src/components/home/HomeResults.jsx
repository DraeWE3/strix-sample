import Button from "../Button";
import ResultsVector from "../../assets/img/home/089cd.svg";
import HorizonBottom from "../../assets/img/home/2670e.svg";
import HorizonLower from "../../assets/img/home/8e839.svg";
import HorizonUpper from "../../assets/img/home/886aa.svg";
import HorizonTop from "../../assets/img/home/c1e75.svg";
import ResultsLight from "../../assets/img/home/af430.svg";
import CopyTexture from "../../assets/img/home/cf19f.png";

const horizons = [
  ["bottom", HorizonBottom],
  ["lower", HorizonLower],
  ["upper", HorizonUpper],
  ["top", HorizonTop],
];

const HomeResults = () => (
  <section className="hh-results" aria-labelledby="hh-results-title" data-reveal>
    <h2 id="hh-results-title">Real Work. Real Results</h2>
    <div className="hh-results-art">
      <div className="hh-results-artwork" aria-hidden="true">
        <img className="hh-results-vector" src={ResultsVector} alt="" />
        {horizons.map(([position, src]) => (
          <div key={position} className={`hh-horizon hh-horizon-${position}`}><img src={src} alt="" /></div>
        ))}
        <div className="hh-results-light"><img src={ResultsLight} alt="" /></div>
        <div className="hh-results-fade hh-results-fade-left" />
        <div className="hh-results-fade hh-results-fade-right" />
      </div>
      <dl className="hh-metrics">
        <div><dd>5<span>+</span></dd><dt>MVP Launched</dt></div>
        <div><dd>100<span>+</span></dd><dt>Projects</dt></div>
        <div><dd>100<span className="hh-percent">%</span></dd><dt>Job success</dt></div>
        <div><dd className="hh-potential" aria-label="Limitless">∞</dd><dt>Potential</dt></div>
      </dl>
    </div>
    <div className="hh-results-copy">
      <p style={{ backgroundImage: `url("${CopyTexture}")` }}>
        Trusted by brands that demand Excellence - we deliver creative-tech solutions that don’t just look good, they perform where it matters
      </p>
      <Button to="/works">Explore Cases</Button>
    </div>
  </section>
);

export default HomeResults;
