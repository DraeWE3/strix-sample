import LabelLineLeft from "../../assets/img/services/db93d.svg";
import LabelLineRight from "../../assets/img/services/9c4d7.svg";
import StatGlow from "../../assets/img/services/1d4b1.svg";

const stats = [
  { value: "5.0  ⭐", label: "Average Client Rating" },
  { value: "200+", label: "Projects delivered" },
  { value: "100+", label: "Happy clients" },
  { value: "$1M +", label: "Revenue Generated for Clients" },
];

const ServicesStats = () => {
  return (
    <section className="stats" aria-labelledby="services-stats-heading">
      <div className="stats-label" data-reveal>
        <img src={LabelLineLeft} alt="" />
        <h2 id="services-stats-heading">Our Stats</h2>
        <img src={LabelLineRight} alt="" />
      </div>
      <div className="stats-grid">
        {stats.map(({ value, label }) => (
          <div className="stat-card" key={label} data-reveal>
            <img className="stat-glow" src={StatGlow} alt="" />
            <p className="stat-value">{value}</p>
            <p className="stat-label">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesStats;
