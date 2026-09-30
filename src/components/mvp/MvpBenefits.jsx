import SpeedArt from "../../assets/img/mvp/benefit-speed.png";
import ScalabilityArt from "../../assets/img/mvp/benefit-scalability.png";
import StrategyArt from "../../assets/img/mvp/benefit-strategy.png";
import SpeedBadge from "../../assets/img/mvp/650ab.svg";
import BadgeGlow from "../../assets/img/mvp/44b88.svg";

const benefits = [
  { key: "speed", art: SpeedArt, badge: SpeedBadge, icon: "⚡", title: "Speed", body: <>Launch faster, validate smarter ideas - we turn ideas into <strong>working prototype</strong> before competitors even start planning.</> },
  { key: "scale", art: ScalabilityArt, badge: BadgeGlow, icon: "⚙️", title: "Scalability", body: <>Your MVP isn’t a one-off experiment - it’s the foundation of your <strong>future product</strong>.</> },
  { key: "strategy", art: StrategyArt, badge: BadgeGlow, icon: "🧠", title: "Strategy", body: <>A <strong>great MVP</strong> isn’t just about what you build, but why you build it.</> },
];

const MvpBenefits = () => (
  <section className="mvp-benefits" id="why-mvp" aria-labelledby="mvp-benefits-title">
    <div className="mvp-benefits__arch" aria-hidden="true"><div className="mvp-benefits__halo"></div><div className="mvp-benefits__arch-border"></div></div>
    <header className="mvp-benefits__intro" data-reveal>
      <h2 id="mvp-benefits-title">Why MVP with Strix ?</h2>
      <p>Because most MVPs take 6 months and ship late. Ours ship in 4 weeks — designed, built, and launch-ready.</p>
    </header>
    <div className="mvp-benefits__cards">
      {benefits.map(({ key, art, badge, icon, title, body }) => (
        <article key={key} className={`mvp-benefits__card mvp-benefits__card--${key}`} data-reveal>
          <div className="mvp-benefits__art" aria-hidden="true"><div className="mvp-benefits__native-art"><img src={art} alt="" loading="lazy" /></div></div>
          <div className="mvp-benefits__card-content">
            <span className="mvp-benefits__badge" aria-hidden="true"><img src={badge} alt="" loading="lazy" /><span>{icon}</span></span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default MvpBenefits;
