import { useEffect } from "react";

// Reveals [data-reveal] elements within a container as they scroll into view.
// Honors prefers-reduced-motion (including live changes) and reveals content
// immediately for keyboard focus, matching the source page's behavior.
const useScrollReveal = (
  containerRef,
  { readyClass = "about-motion-ready", threshold = 0.06, rootMargin = "0px 0px -24px 0px" } = {}
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let revealObserver;

    const configureMotion = () => {
      revealObserver?.disconnect();
      const targets = container.querySelectorAll("[data-reveal]");

      if (motionPreference.matches || !("IntersectionObserver" in window)) {
        container.classList.remove(readyClass);
        targets.forEach((node) => node.classList.add("is-visible"));
        return;
      }

      container.classList.add(readyClass);
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold, rootMargin }
      );
      targets.forEach((node) => revealObserver.observe(node));
    };

    const revealOnFocus = (event) => {
      let target = event.target.closest("[data-reveal]");
      while (target) {
        target.classList.add("is-visible");
        target = target.parentElement?.closest("[data-reveal]");
      }
    };

    configureMotion();
    motionPreference.addEventListener?.("change", configureMotion);
    container.addEventListener("focusin", revealOnFocus);

    return () => {
      revealObserver?.disconnect();
      motionPreference.removeEventListener?.("change", configureMotion);
      container.removeEventListener("focusin", revealOnFocus);
    };
  }, [containerRef, readyClass, threshold, rootMargin]);
};

export default useScrollReveal;
