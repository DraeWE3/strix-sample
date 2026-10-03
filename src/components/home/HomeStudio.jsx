import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import CoinVideo from "../../assets/img/home/coin-video.webm";
import CopyTexture from "../../assets/img/home/5ba94.png";

// The logo animation plays only while visible and honours reduced motion.
const HomeStudio = () => {
  const videoRef = useRef(null);
  const manuallyPaused = useRef(false);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      if (motionPreference.matches || manuallyPaused.current) video.pause();
      else video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? updateMotion() : video.pause()),
      { threshold: 0.05 }
    );
    observer.observe(video);
    motionPreference.addEventListener("change", updateMotion);
    updateMotion();
    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", updateMotion);
      video.pause();
    };
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    manuallyPaused.current = !video.paused;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <section className="hm-studio" aria-labelledby="hm-studio-title">
      <div className="hm-studio-media">
        <video
          ref={videoRef}
          src={CoinVideo}
          muted
          playsInline
          loop
          preload="metadata"
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          aria-hidden="true"
          tabIndex={-1}
        />
        <button
          type="button"
          className="hm-studio-motion"
          onClick={toggleVideo}
          aria-label={paused ? "Play decorative logo animation" : "Pause decorative logo animation"}
        >
          {paused ? "Play animation" : "Pause animation"}
        </button>
      </div>
      <h2 id="hm-studio-title" data-reveal>Strix Production</h2>
      <div className="hm-studio-intro" data-reveal>
        <p className="hm-body-copy" style={{ backgroundImage: `url("${CopyTexture}")` }}>
          Strix combines design, development, and production in one team.<br />
          Founded by <strong>Raj</strong> - a builder who believes the best products ships, not just render.
        </p>
        <Button to="/about">About us</Button>
      </div>
    </section>
  );
};

export default HomeStudio;
