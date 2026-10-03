import Button from "../Button";
import { useEffect, useRef } from "react";
import { BOOKING_URL } from "./mvpCases";
import Illustration from "../../assets/img/mvp/748f0.png";
import StepIcon from "../../assets/img/mvp/ecd12.svg";

const steps = [
  { key: "discovery", title: "Discovery & Wireframes", body: "We define your core idea, map user journeys, and create wireframes that lock your product vision with direction." },
  { key: "design", title: "Design & Validation", body: "High-fidelity visuals, interactive prototypes, and feedback loops - ensuring every screen looks and feels right before development." },
  { key: "development", title: "Development & Iterations", body: "We develop the MVP with clean, scalable code & refine through quick sprints to keep results aligned with the vision." },
  { key: "launch", title: "Test, Launch & Scale", body: "Before going live, we stress-test every feature for smooth performance, scalability, and future expansion." },
];

// The progress indicator grows with the reader's position; the page always scrolls natively.
const useProcessProgress = (trackRef, progressRef, markerRef) => {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;

    const update = () => {
      frame = null;
      const track = trackRef.current;
      const progress = progressRef.current;
      const marker = markerRef.current;
      if (!track || !progress || !marker) return;
      const rect = track.getBoundingClientRect();
      const initial = window.innerWidth <= 850 ? 100 : 112;
      const length = reduceMotion.matches ? initial : Math.max(initial, Math.min(rect.height, window.innerHeight * 0.5 - rect.top));
      progress.style.height = `${length}px`;
      const tip = rect.top + length;
      track.parentElement.querySelectorAll(".mvp-process__step").forEach((step) => {
        step.classList.toggle("is-active", reduceMotion.matches || length >= rect.height || step.getBoundingClientRect().top + 60 < tip);
      });
      marker.style.top = `${Math.min(rect.height - marker.offsetHeight, Math.max(initial - 32, length - 32))}px`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

    // The site scrolls inside body, so window never receives scroll events; capture them from any scroller.
    document.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule, { passive: true });
    reduceMotion.addEventListener("change", schedule);
    update();

    return () => {
      document.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      reduceMotion.removeEventListener("change", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [trackRef, progressRef, markerRef]);
};

const MvpProcess = () => {
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const markerRef = useRef(null);
  useProcessProgress(trackRef, progressRef, markerRef);

  return (
    <section className="mvp-process" id="framework" aria-labelledby="mvp-process-title">
      <div className="mvp-process__overview">
        <div className="mvp-process__arch" aria-hidden="true"><div className="mvp-process__halo"></div><div className="mvp-process__arch-border"></div></div>
        <header className="mvp-process__intro">
          <h2 id="mvp-process-title" data-reveal>Our 4-Week<br />MVP Framework</h2>
          <p data-reveal>One sprint. Every layer handled. Research, design, development, and launch assets — in four weeks flat.</p>
          <img className="mvp-process__illustration" src={Illustration} alt="An idea moves through concept, research, design and development to a finished product." loading="lazy" width="1084" height="336" />
        </header>
      </div>
      <div className="mvp-process__timeline">
        <div className="mvp-process__track" ref={trackRef} aria-hidden="true">
          <span className="mvp-process__progress" ref={progressRef}></span>
          <span className="mvp-process__marker" ref={markerRef}></span>
          <span className="mvp-process__track-end"></span>
        </div>
        <ol className="mvp-process__steps">
          {steps.map(({ key, title, body }) => (
            <li key={key} className={`mvp-process__step mvp-process__step--${key}`} data-reveal>
              <span className="mvp-process__icon" aria-hidden="true"><img src={StepIcon} alt="" loading="lazy" /></span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </div>
      <Button className="mvp-process__cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" arrow>Build MVP</Button>
    </section>
  );
};

export default MvpProcess;
