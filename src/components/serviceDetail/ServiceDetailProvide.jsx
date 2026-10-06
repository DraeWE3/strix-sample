import ServiceButton from "./ServiceButton";
import ServiceOrbit from "./ServiceOrbit";
import OfferArtwork from "./OfferArtwork";
import { OFFER_ARTWORK, fillArtwork } from "../../data/serviceArtwork";

const OfferCanvas = ({ offer, categoryName }) => {
  const label = `${offer.title} — ${categoryName.toLowerCase()} example`;
  if (offer.art && OFFER_ARTWORK[offer.art]) {
    return (
      <div className="service-offer__canvas" role="img" aria-label={label}>
        <div className="service-offer__art" dangerouslySetInnerHTML={{ __html: fillArtwork(OFFER_ARTWORK[offer.art], { title: offer.title }) }} />
      </div>
    );
  }
  return (
    <div className="service-offer__canvas" role="img" aria-label={label}>
      <div className="service-offer__art"><OfferArtwork title={offer.title} image={offer.image} /></div>
    </div>
  );
};

const ServiceDetailProvide = ({ offers, categoryName }) => (
  <section className="service-provide" aria-labelledby="service-provide-title">
    <ServiceOrbit className="service-provide-orbit" />
    <h2 id="service-provide-title" data-reveal>What we provide</h2>
    <div className={`service-offers service-offers--${offers.length}`}>
      {offers.map((offer) => (
        <article
          className="service-offer"
          data-reveal
          aria-label={offer.title}
          key={offer.title}
          style={offer.descriptionWidth ? { "--description-width": `${offer.descriptionWidth}px` } : undefined}
        >
          <OfferCanvas offer={offer} categoryName={categoryName} />
          <p className="service-offer__description">{offer.description}</p>
          <ServiceButton href="#related-projects">View Work</ServiceButton>
        </article>
      ))}
    </div>
  </section>
);

export default ServiceDetailProvide;
