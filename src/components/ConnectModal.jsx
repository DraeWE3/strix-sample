import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import "../style/fonts.css";
import "../style/ConnectModal.css";
import Logo from "../assets/img/layout/Header-s.webp";
import { serviceRoute } from "../data/serviceDetails";

gsap.registerPlugin(CustomEase);
const MENU_EASE = CustomEase.create("strix-menu", "0.6, 0.08, 0.02, 0.99");
const MOBILE_QUERY = "(orientation: portrait), (max-width: 767px), (max-height: 500px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
export const SITE_MENU_ID = "site-menu";

const CONTACT_EMAIL = "info@strixproduction.com";

const navigationLinks = [
  { text: "Home", path: "/", match: (p) => p === "/" },
  { text: "About Us", path: "/about", match: (p) => p === "/about" },
  { text: "Services", path: "/services", match: (p) => p === "/services" },
  { text: "Projects", path: "/works", match: (p) => p === "/works" || p.startsWith("/case-study") },
  { text: "Blog", path: "/blog", match: (p) => p.startsWith("/blog") },
  { text: "Contact", path: "/contact", match: (p) => p === "/contact" },
];

const serviceLinks = [
  { text: "UI/UX Design", slug: "ui-ux-design" },
  { text: "SaaS Promos", slug: "commercials" },
  { text: "Web-Applications", slug: "web-app" },
].map(({ text, slug }) => {
  const path = serviceRoute(slug);
  return { text, path, match: (p) => p === path };
});

const solutionLinks = [{ text: "Build MVP", path: "/mvp", match: (p) => p === "/mvp" }];

const Glyph = ({ viewBox, children }) => (
  <svg x="9" y="9" width="15" height="15" viewBox={viewBox}>{children}</svg>
);

const socials = [
  { label: "Upwork", href: "https://www.upwork.com/agencies/1799430219619033088/", glyph: <Glyph viewBox="0 0 24 24"><path fill="currentColor" d="M17.47 6.07a4.54 4.54 0 0 0-4.38 3.69a20 20 0 0 1-2.28-4.9H8.55v6a2.14 2.14 0 1 1-4.28 0v-6L2 4.91v6a4.4 4.4 0 1 0 8.8-.05v-1a20.6 20.6 0 0 0 1.65 2.7l-1.38 6.61h2.32l1-4.81a5.6 5.6 0 0 0 3.11.89a4.57 4.57 0 0 0 0-9.14zm0 6.83a4.1 4.1 0 0 1-2.55-1l.23-.91v-.05c.16-1 .66-2.6 2.35-2.6a2.25 2.25 0 0 1 2.27 2.24a2.41 2.41 0 0 1-2.27 2.32z" /></Glyph> },
  { label: "Behance", href: "https://www.behance.net/strixproductions", glyph: <Glyph viewBox="0 0 24 24"><path fill="currentColor" d="M7.443 5.35c.639 0 1.23.05 1.77.198c.541.099.984.297 1.377.544q.591.371.885 1.039c.197.445.296.99.296 1.583c0 .693-.148 1.286-.492 1.731c-.295.446-.787.841-1.377 1.138c.836.248 1.475.693 1.869 1.286s.639 1.336.639 2.177c0 .693-.148 1.286-.394 1.781c-.245.495-.639.94-1.082 1.237a5.1 5.1 0 0 1-1.573.692c-.59.149-1.18.248-1.77.248H1V5.35zm-.394 5.54c.541 0 .984-.148 1.328-.395s.492-.693.492-1.237c0-.297-.05-.594-.148-.791s-.246-.347-.442-.495a2.4 2.4 0 0 0-.64-.247c-.246-.05-.491-.05-.787-.05H4v3.216zm.148 5.838c.295 0 .59-.05.836-.099c.246-.05.492-.148.688-.297a1.8 1.8 0 0 0 .492-.544c.098-.247.197-.544.197-.89c0-.693-.197-1.188-.59-1.534c-.394-.297-.935-.445-1.574-.445H4v3.81zm9.492-.05q.59.594 1.77.594c.541 0 1.033-.148 1.426-.395q.591-.446.738-.891h2.41c-.394 1.187-.984 2.028-1.77 2.572c-.788.495-1.722.792-2.853.792a5.8 5.8 0 0 1-2.115-.396a3.9 3.9 0 0 1-1.574-1.088a3.9 3.9 0 0 1-.983-1.633c-.246-.643-.345-1.335-.345-2.127c0-.742.099-1.434.345-2.078a5.3 5.3 0 0 1 1.033-1.682c.442-.445.983-.84 1.573-1.088a5.5 5.5 0 0 1 2.066-.396c.836 0 1.574.149 2.213.495c.64.346 1.131.742 1.524 1.336c.394.544.69 1.187.886 1.88c.098.692.147 1.385.098 2.176H16c0 .792.295 1.534.689 1.93m3.098-5.194c-.344-.346-.885-.544-1.525-.544a2.34 2.34 0 0 0-1.082.247c-.295.149-.491.347-.688.545a1.3 1.3 0 0 0-.344.692c-.05.248-.099.445-.099.643h4.426c-.098-.742-.344-1.236-.688-1.583M15.459 6.29h5.508v1.336H15.46z" /></Glyph> },
  { label: "Dribbble", href: "https://dribbble.com/StrixProduction", glyph: <Glyph viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5"><circle cx="24" cy="24" r="20" /><path d="M44 24c-2.918 0-10.968-1.1-18.173 2.063C18 29.5 12.333 34.832 9.863 38.147M16.5 5.454C19.63 8.343 26.46 15.698 29 23s3.48 16.28 4.06 18.835M4.154 21.5c3.778.228 13.779.433 20.179-2.3s11.907-7.76 13.796-9.355" /></g></Glyph> },
  { label: "Instagram", href: "https://www.instagram.com/strix_productions", glyph: <Glyph viewBox="0 0 24 24"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" /></Glyph> },
  { label: "X", href: "https://x.com/strixproduction", glyph: <Glyph viewBox="0 0 24 24"><path fill="currentColor" d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z" /></Glyph> },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/strix-production/", glyph: <Glyph viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M1 2.838A1.84 1.84 0 0 1 2.838 1H21.16A1.837 1.837 0 0 1 23 2.838V21.16A1.84 1.84 0 0 1 21.161 23H2.838A1.84 1.84 0 0 1 1 21.161zm8.708 6.55h2.979v1.496c.43-.86 1.53-1.634 3.183-1.634c3.169 0 3.92 1.713 3.92 4.856v5.822h-3.207v-5.106c0-1.79-.43-2.8-1.522-2.8c-1.515 0-2.145 1.089-2.145 2.8v5.106H9.708zm-5.5 10.403h3.208V9.25H4.208zM7.875 5.812a2.063 2.063 0 1 1-4.125 0a2.063 2.063 0 0 1 4.125 0" clipRule="evenodd" /></Glyph> },
  { label: "Clutch", href: "https://clutch.co/profile/strix-production", glyph: <Glyph viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" d="M18.2 17.3A8 8 0 1 1 18.2 6.7" /><circle cx="12.4" cy="12" r="2.6" fill="currentColor" /></Glyph> },
];

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4.5 19.5L19.5 4.5M19.5 4.5H8.25M19.5 4.5V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="4" stroke="currentColor" strokeWidth="1.4" />
    <path d="M4.5 8l6.2 4.6a2.2 2.2 0 0 0 2.6 0L19.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StaggerChars = ({ text }) => (
  <span className="smenu-chars" aria-hidden="true">
    {[...text].map((char, i) => (
      <span key={i} style={{ transitionDelay: `${i * 0.01}s` }}>{char === " " ? " " : char}</span>
    ))}
  </span>
);

const TalkButton = ({ className, onClick }) => (
  <Link to="/contact" className={`smenu-cta ${className}`} aria-label="Let's talk" onClick={onClick}>
    <span className="smenu-cta__bg" aria-hidden="true" />
    <StaggerChars text="LET'S TALK" />
    <span className="smenu-cta__arrow" aria-hidden="true"><ArrowIcon /></span>
  </Link>
);

const LinkGroup = ({ title, links, kind, pathname, onNavigate }) => (
  <nav className={`smenu__group smenu__group--${kind}`} aria-label={title}>
    <div className="smenu__group-head"><h4>{title}</h4></div>
    <ul>
      {links.map(({ text, path, match }) => {
        const active = match(pathname);
        return (
          <li key={path}>
            <Link
              to={path}
              className={`smenu__item${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            >
              <span className="smenu__item-dot" aria-hidden="true" />
              <span className="smenu__item-text">{text}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
);

// Builds the reveal/hide timelines; values mirror the reference interaction.
const buildTimeline = (root, open, { mobile, reduced }) => {
  const q = gsap.utils.selector(root);
  const layers = q(".smenu__backdrop, .smenu__glow");
  const header = q(".smenu__header");
  const panel = q(".smenu__panel");
  const bars = q(".smenu__close rect");
  const headings = q("[data-menu-heading]");
  const navItems = q(".smenu__group--navigation .smenu__group-head, .smenu__group--navigation li");
  const sideItems = q(".smenu__col .smenu__group-head, .smenu__col li");
  const socials = q(".smenu__socials");
  const divider = q(".smenu__footer-divider");
  const mobileCta = q(".smenu__cta-mobile");
  const interactive = [...layers, ...header, ...panel];

  const tl = gsap.timeline({ defaults: { ease: MENU_EASE, duration: 2 } });

  if (open) {
    gsap.set([...interactive, ...bars, ...headings, ...navItems, ...sideItems, ...socials, ...divider, ...mobileCta], { clearProps: "all" });
    gsap.set(root, { display: "block" });

    if (reduced) {
      return tl.fromTo(interactive, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "none" }, 0);
    }

    tl.set(bars, { scale: 0, transformOrigin: "50% 50%" }, 0)
      .fromTo(layers, { opacity: 0 }, { opacity: 1 }, 0)
      .fromTo(header, { opacity: 0 }, { opacity: 1, duration: 1 }, 0.1)
      .to(bars, { scale: 1, stagger: 0.1 }, 0.3);

    if (mobile) {
      return tl
        .fromTo(panel, { opacity: 0, scale: 1 }, { opacity: 1, scale: 1 }, 0)
        .from(navItems, { opacity: 0, y: 30, stagger: 0.1 }, 0.3)
        .from(sideItems, { opacity: 0, y: 30, stagger: 0.1 }, 0.5)
        .from(mobileCta, { opacity: 0, y: 30 }, 0.6)
        .from(divider, { opacity: 0, scaleX: 0 }, 0.6)
        .from(socials, { opacity: 0, yPercent: 100 }, 0.8);
    }

    return tl
      .fromTo(panel, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1 }, 0)
      .from(navItems, { opacity: 0, x: -75, stagger: 0.1 }, 0.3)
      .from(sideItems, { opacity: 0, x: -75, stagger: 0.1 }, 0.5)
      .from(headings, { opacity: 0, x: 50, stagger: 0.1 }, 0.4)
      .from(socials, { opacity: 0, yPercent: 100 }, 0.6)
      .from(divider, { opacity: 0, scaleX: 0 }, 0.8);
  }

  tl.set(interactive, { pointerEvents: "none" }, 0);
  if (reduced) {
    tl.to(interactive, { opacity: 0, duration: 0.2, ease: "none" }, 0);
  } else {
    tl.to(bars, { scale: 0, stagger: 0.1 }, 0)
      .to(panel, { opacity: 0, scale: 0.9 }, 0.3)
      .to([...layers, ...header], { opacity: 0 }, 0.3);
  }
  return tl.set(root, { display: "none" });
};

// px clip path for the panel: rounded body with a raised tab in the top-right corner for the close control.
const panelClipPath = (w, h, unit) => {
  const r = 3 * unit;
  const top = 9.55 * unit;
  const tab = 10.2 * unit;
  const x = w - tab;
  return `path("M0 ${top + r}A${r} ${r} 0 0 1 ${r} ${top}L${x - r} ${top}A${r} ${r} 0 0 0 ${x} ${top - r}L${x} ${r}A${r} ${r} 0 0 1 ${x + r} 0L${w - r} 0A${r} ${r} 0 0 1 ${w} ${r}L${w} ${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}L${r} ${h}A${r} ${r} 0 0 1 0 ${h - r}Z")`;
};

const ConnectModal = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const timelineRef = useRef(null);
  const hasOpenedRef = useRef(false);
  const returnFocusRef = useRef(null);
  const bodyOverflowRef = useRef(null);
  const [portalTarget, setPortalTarget] = useState(null);

  useEffect(() => setPortalTarget(document.body), []);

  const releaseScroll = useCallback(() => {
    if (bodyOverflowRef.current === null) return;
    document.body.style.overflow = bodyOverflowRef.current;
    bodyOverflowRef.current = null;
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || (!isOpen && !hasOpenedRef.current)) return;
    hasOpenedRef.current = true;

    const media = {
      mobile: window.matchMedia(MOBILE_QUERY).matches,
      reduced: window.matchMedia(REDUCED_MOTION_QUERY).matches,
    };
    timelineRef.current?.kill();
    timelineRef.current = buildTimeline(root, isOpen, media);

    if (isOpen) {
      returnFocusRef.current = document.activeElement;
      if (bodyOverflowRef.current === null) {
        bodyOverflowRef.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }
      closeRef.current?.focus({ preventScroll: true });
    } else {
      releaseScroll();
      if (root.contains(document.activeElement)) returnFocusRef.current?.focus?.({ preventScroll: true });
    }
  }, [isOpen, portalTarget, releaseScroll]);

  useEffect(() => () => {
    timelineRef.current?.kill();
    releaseScroll();
  }, [releaseScroll]);

  const lastPathRef = useRef(pathname);
  useEffect(() => {
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;
    if (isOpen) onClose();
  }, [pathname, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !rootRef.current) return;
      const focusables = [...rootRef.current.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!rootRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;
    // Lives on the root as a custom property: the open timeline's clearProps wipes the panel's inline style,
    // and reopening mid-close doesn't resize the panel, so the observer wouldn't put it back.
    const update = () => {
      if (window.matchMedia(MOBILE_QUERY).matches) {
        root.style.removeProperty("--smenu-clip");
        return;
      }
      const unit = parseFloat(getComputedStyle(panel).getPropertyValue("--smenu-u")) || 7.5;
      root.style.setProperty("--smenu-clip", panelClipPath(panel.offsetWidth, panel.offsetHeight, unit));
    };
    const observer = new ResizeObserver(update);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [portalTarget]);

  if (!portalTarget) return null;

  return createPortal(
    <div
      ref={rootRef}
      id={SITE_MENU_ID}
      className="smenu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className="smenu__backdrop" onClick={onClose} />
      <div className="smenu__glow" aria-hidden="true" />

      <div className="smenu__header">
        <Link to="/" className="smenu__brand" aria-label="Strix home" onClick={onClose}>
          <img src={Logo} alt="" />
          <span className="smenu__divider" aria-hidden="true" />
          <span className="smenu__brand-name">Strix</span>
        </Link>
        <div className="smenu__header-right">
          <Link to="/contact" className="smenu__talk" aria-label="Let's talk" onClick={onClose}>
            <StaggerChars text="Let's talk" />
            <span className="smenu__talk-arrow" aria-hidden="true"><ArrowIcon /></span>
          </Link>
          <span className="smenu__divider" aria-hidden="true" />
        </div>
      </div>

      <div ref={panelRef} className="smenu__panel">
        <button ref={closeRef} type="button" className="smenu__close" aria-label="Close menu" onClick={onClose}>
          <svg viewBox="0 0 34 34" fill="none" aria-hidden="true">
            <g transform="rotate(45 1.59 0.1)"><rect x="1.59" y="0.1" width="45.69" height="1.6" fill="currentColor" /></g>
            <g transform="rotate(-45 0.09 32.31)"><rect x="0.09" y="32.31" width="45.69" height="1.6" fill="currentColor" /></g>
          </svg>
        </button>

        <div className="smenu__connect">
          <div className="smenu__eyebrow" data-menu-heading="">
            <span className="smenu__eyebrow-dot" aria-hidden="true" />
            <span>Connect with us!</span>
          </div>
          <div className="smenu__headline" data-menu-heading="">Turn Your Vision Into an Experience That Lasts</div>
          <div className="smenu__rule" aria-hidden="true" />
          <a href={`mailto:${CONTACT_EMAIL}`} className="smenu__email" data-menu-heading="">
            <MailIcon />
            <span>{CONTACT_EMAIL}</span>
          </a>
          <div data-menu-heading="">
            <TalkButton className="smenu-cta--desktop" onClick={onClose} />
          </div>
        </div>

        <div className="smenu__nav">
          <LinkGroup title="NAVIGATION" kind="navigation" links={navigationLinks} pathname={pathname} onNavigate={onClose} />
          <div className="smenu__col">
            <LinkGroup title="SERVICES" kind="services" links={serviceLinks} pathname={pathname} onNavigate={onClose} />
            <LinkGroup title="SOLUTIONS" kind="solutions" links={solutionLinks} pathname={pathname} onNavigate={onClose} />
          </div>
        </div>

        <div className="smenu__cta-mobile">
          <TalkButton className="smenu-cta--mobile" onClick={onClose} />
        </div>

        <div className="smenu__footer">
          <div className="smenu__footer-divider" aria-hidden="true" />
          <div className="smenu__footer-row">
            <span className="smenu__copyright">© {new Date().getFullYear()} – Strix Production All Rights Reserved</span>
            <div className="smenu__socials">
              {socials.map(({ label, href, glyph }) => (
                <a key={label} className="smenu__social" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <svg viewBox="0 0 33 33" fill="none" aria-hidden="true">
                    <rect x="0.5" y="0.5" width="32" height="32" rx="16" stroke="currentColor" />
                    {glyph}
                  </svg>
                </a>
              ))}
            </div>
            <div className="smenu__legal">
              <Link to="/policy" onClick={onClose}>Privacy Policy</Link>
              <Link to="/term" onClick={onClose}>Terms Of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    portalTarget
  );
};

export default ConnectModal;
