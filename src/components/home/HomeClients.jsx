import TrustIcon from "../../assets/img/about/fc732.svg";
import Loop from "../Loop";

const HomeClients = () => (
  <section className="hh-clients" aria-label="Selected clients" data-reveal>
    <p className="hh-clients-label"><img alt="" src={TrustIcon} />Trusted by growing companies worldwide</p>
    <Loop />
  </section>
);

export default HomeClients;
