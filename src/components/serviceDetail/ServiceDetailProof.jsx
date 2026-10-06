import GlowOne from "../../assets/img/service-pages/figma/3cba9.svg";
import GlowTwo from "../../assets/img/service-pages/figma/07f61.svg";
import GlowThree from "../../assets/img/service-pages/figma/db361.svg";
import { PROOF_ARTWORK, fillArtwork } from "../../data/serviceArtwork";
import ClientLogo from "./ClientLogos";

// The three capability cards each carry one of the template's three glow placements.
const GLOWS = [
  { src: GlowOne, height: "849.544px", left: "-291.28px", top: "-222.49px", width: "982.279px", transform: "rotate(17.2deg) scaleY(-1.0)" },
  { src: GlowTwo, height: "982.279px", left: "-225.05px", top: "-289.28px", width: "849.544px", transform: "rotate(107.2deg) scaleY(-1.0)" },
  { src: GlowThree, height: "849.544px", left: "-291px", top: "-223.05px", width: "982.279px", transform: "rotate(-162.8deg) scaleY(-1.0)" },
];

const CapabilityCard = ({ card, index }) => {
  const glow = GLOWS[index % GLOWS.length];
  return (
    <div className="capability-card">
      <div className="capability-card__glow" aria-hidden="true">
        <div style={{ position: "absolute", display: "flex", height: glow.height, alignItems: "center", justifyContent: "center", left: glow.left, mixBlendMode: "screen", top: glow.top, width: glow.width }}>
          <div style={{ flex: "none", transform: glow.transform }}>
            <div style={{ height: "631.518px", position: "relative", width: "832.771px" }}>
              <div style={{ position: "absolute", inset: "-15.65% -11.86%" }}>
                <img alt="" src={glow.src} className="figma-svg" style={{ display: "block", maxWidth: "none" }} loading="lazy" draggable={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {card.logo ? (
        <div className="capability-card__logo"><ClientLogo name={card.logo} /></div>
      ) : (
        <span className="capability-card__label">{card.label}</span>
      )}
      <h3>{card.title}</h3>
      <p>{card.description}</p>
    </div>
  );
};

const ServiceDetailProof = ({ proof }) => (
  <section className="service-proof" aria-labelledby="service-proof-heading">
    <h2 id="service-proof-heading" className="service-proof__heading" data-reveal>{proof.heading}</h2>
    <p className="service-proof__intro" data-reveal>{proof.intro}</p>
    <div className="service-proof__cards">
      {proof.cards.map((card, index) => (
        <article className="service-proof-native" data-reveal key={card.title}>
          {card.art && PROOF_ARTWORK[card.art] ? (
            <div className="service-proof-art" dangerouslySetInnerHTML={{ __html: fillArtwork(PROOF_ARTWORK[card.art], card) }} />
          ) : (
            <div className="service-proof-art"><CapabilityCard card={card} index={index} /></div>
          )}
        </article>
      ))}
    </div>
  </section>
);

export default ServiceDetailProof;
