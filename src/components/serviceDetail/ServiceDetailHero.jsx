import { useRef } from "react";
import ServiceButton from "./ServiceButton";
import ServiceOrbit from "./ServiceOrbit";
import useInlineYouTube from "./useInlineYouTube";

const ServiceDetailHero = ({ title, hero }) => {
  const rootRef = useRef(null);
  const mountRef = useRef(null);
  const playButtonRef = useRef(null);
  const { available, playing, play } = useInlineYouTube({
    rootRef,
    mountRef,
    playButtonRef,
    videoId: hero.showreel ? hero.videoId : "",
    isDemo: Boolean(hero.videoIsDemo),
  });

  return (
    <section className={`service-hero${playing ? " is-playing" : ""}`} data-media ref={rootRef} aria-labelledby="service-title">
      <ServiceOrbit className="service-hero-orbit" />
      <h1 id="service-title">{title}</h1>
      <div className="service-hero-media">
        <img
          className="service-hero-poster"
          src={hero.poster}
          alt={`${title} — selected Strix Production work`}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          width="1004"
          height="503"
          fetchPriority="high"
        />
        <div className="service-video-mount" ref={mountRef} hidden={!playing} />
      </div>
      <p className="service-hero-description">{hero.description}</p>
      <div className="service-hero-actions">
        <ServiceButton href="#related-projects">View Work</ServiceButton>
        {available && (
          <ServiceButton buttonRef={playButtonRef} onClick={play} hidden={playing} aria-label={`Play ${hero.videoIsDemo ? "demo" : "project"} video`}>
            Showreel
          </ServiceButton>
        )}
      </div>
    </section>
  );
};

export default ServiceDetailHero;
