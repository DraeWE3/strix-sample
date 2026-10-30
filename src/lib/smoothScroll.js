// Site-wide inertia smooth scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync.
//
// Two site quirks shape this module:
// - index.css gives html/body `height:100%; overflow-x:hidden`, which makes <body> the scroll
//   container on every page except the home page, whose shell switches scrolling back to the
//   viewport (home-page.css). Lenis must wrap whichever element actually scrolls, so the instance
//   is rebuilt whenever that changes (route change, or body overflow toggled by a modal lock).
// - Modals lock the page with `body { overflow: hidden }` (inline style or a body class). Lenis
//   keeps its own scroll target, so it is paused while a lock is active and resumed afterwards.
//
// Nothing here runs for users who prefer reduced motion; the browser's native scrolling remains.
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LERP = 0.1;

let lenis = null;
let wrapper = null;
let tick = null;
let lockObserver = null;
let clickBound = false;
let destroyed = true;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const nativeScrollTo = (top, behavior) => {
  const scroller = document.scrollingElement || document.documentElement;
  window.scrollTo({ top, left: 0, behavior });
  scroller.scrollTo({ top, left: 0, behavior });
  document.body.scrollTo({ top, left: 0, behavior });
};

const teardownInstance = () => {
  if (tick) gsap.ticker.remove(tick);
  tick = null;
  lenis?.destroy();
  lenis = null;
  wrapper = null;
};

const buildInstance = (nextWrapper) => {
  teardownInstance();
  wrapper = nextWrapper;
  lenis = new Lenis({
    wrapper: nextWrapper,
    content: nextWrapper === window ? document.documentElement : document.getElementById("root") || document.body,
    lerp: LERP,
    smoothWheel: true,
    syncTouch: false,
    allowNestedScroll: true,
    autoRaf: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
};

/**
 * Point Lenis at the element that scrolls right now and pause it while a modal locks the page.
 * Safe to call often; it only rebuilds when the scroll container changed.
 */
export const syncSmoothScroll = () => {
  if (destroyed) return;
  const overflow = getComputedStyle(document.body).overflowY;
  if (overflow === "hidden" || overflow === "clip") {
    lenis?.stop();
    return;
  }
  const next = overflow === "visible" ? window : document.body;
  if (next !== wrapper) buildInstance(next);
  else lenis?.start();
};

/** Same-page hash links: ease to the target instead of jumping, and keep focus/history behaviour. */
const onDocumentClick = (event) => {
  if (!lenis || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!anchor) return;
  let url;
  try {
    url = new URL(anchor.getAttribute("href"), window.location.href);
  } catch {
    return;
  }
  if (url.origin !== window.location.origin) return;
  if (url.pathname !== window.location.pathname || url.search !== window.location.search) return;
  if (url.hash.length < 2) return;

  const id = decodeURIComponent(url.hash.slice(1));
  const target = document.getElementById(id);
  if (!target && id !== "top") return;

  event.preventDefault();
  window.history.pushState(null, "", url.hash);
  lenis.scrollTo(target || 0);

  if (target) {
    const focusable = target.matches("a[href], button, input, select, textarea, [tabindex]");
    if (!focusable) {
      target.setAttribute("tabindex", "-1");
      target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
    }
    target.focus({ preventScroll: true });
  }
};

/** Mount once for the whole app. Returns a cleanup function. */
export const initSmoothScroll = () => {
  if (typeof window === "undefined" || reducedMotion()) return () => {};
  destroyed = false;

  lockObserver = new MutationObserver(syncSmoothScroll);
  lockObserver.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });

  if (!clickBound) {
    document.addEventListener("click", onDocumentClick);
    clickBound = true;
  }

  syncSmoothScroll();

  return () => {
    destroyed = true;
    lockObserver?.disconnect();
    lockObserver = null;
    if (clickBound) {
      document.removeEventListener("click", onDocumentClick);
      clickBound = false;
    }
    teardownInstance();
  };
};

/** Current Lenis instance, or null when smooth scrolling is off (reduced motion, not mounted). */
export const getLenis = () => lenis;

/**
 * Scroll the page to the top. `smooth` eases there (Lenis, or native smooth without it);
 * otherwise the jump is instant and also resets every possible native scroller, which covers
 * the moment right after a route change before Lenis has re-targeted the new scroll container.
 */
export const scrollToTop = ({ smooth = false } = {}) => {
  if (lenis && smooth) {
    lenis.scrollTo(0, { force: true });
    return;
  }
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  nativeScrollTo(0, smooth && !reducedMotion() ? "smooth" : "instant");
};

/** Ease to an element (anchor targets, tables of contents). Falls back to scrollIntoView. */
export const scrollToElement = (element, options = {}) => {
  if (!element) return;
  if (lenis) {
    lenis.scrollTo(element, options);
    return;
  }
  element.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
};
