import { useCallback, useEffect, useRef, useState } from "react";

// Native overflow scrolling stays the single source of truth: touch and trackpads
// keep the browser's momentum, mouse drags are handled here, and vertical wheel
// input always continues down the page. React only renders the resulting state.
const useScrollCarousel = ({ align = "start", startIndex = 0 } = {}) => {
  const viewportRef = useRef(null);
  const controlsRef = useRef(null);
  const [position, setPosition] = useState({ index: startIndex, controlIndex: startIndex, settledIndex: startIndex });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const view = viewportRef.current;
    const slides = [...view.firstElementChild.children];
    const lastIndex = slides.length - 1;
    const center = align === "center";
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionBehavior = () => (motionPreference.matches ? "auto" : "smooth");

    let index = Math.min(lastIndex, startIndex);
    let anchorIndex = index;
    let targetIndex = null;
    let offsets = [];
    let measuredWidth = 0;
    let measuredScrollWidth = 0;
    let drag = null;
    let suppressClickUntil = 0;
    let settleTimer;
    let frame = 0;
    let disposed = false;

    const publish = (patch) =>
      setPosition((previous) => {
        const next = { ...previous, ...patch };
        return Object.keys(next).every((key) => next[key] === previous[key]) ? previous : next;
      });

    const measure = () => {
      const viewportBox = view.getBoundingClientRect();
      const padding = parseFloat(getComputedStyle(view).scrollPaddingInlineStart) || 0;
      const max = Math.max(0, view.scrollWidth - view.clientWidth);
      offsets = slides.map((slide) => {
        const box = slide.getBoundingClientRect();
        const offset = box.left - viewportBox.left + view.scrollLeft - (center ? (view.clientWidth - box.width) / 2 : padding);
        return Math.max(0, Math.min(max, offset));
      });
      measuredWidth = view.clientWidth;
      measuredScrollWidth = view.scrollWidth;
    };

    const geometryChanged = () => measuredWidth !== view.clientWidth || measuredScrollWidth !== view.scrollWidth;

    const nearest = (scrollPosition = view.scrollLeft) =>
      offsets.reduce(
        (best, offset, i) => (Math.abs(offset - scrollPosition) < Math.abs(offsets[best] - scrollPosition) ? i : best),
        0
      );

    const update = () => {
      // A scroll event can precede ResizeObserver after a responsive reflow;
      // re-anchor before reading the position against obsolete offsets.
      if (geometryChanged()) {
        restoreAnchor();
        return;
      }
      index = nearest();
      publish({ index, controlIndex: targetIndex ?? index });
    };

    const settled = () => {
      if (drag?.active) return;
      if (geometryChanged()) {
        restoreAnchor();
        return;
      }
      // A late scrollend must not discard a newer destination still in flight.
      if (targetIndex !== null && Math.abs(view.scrollLeft - offsets[targetIndex]) > 2) return;
      targetIndex = null;
      update();
      anchorIndex = index;
      publish({ settledIndex: index });
    };

    const go = (nextIndex, animate = true) => {
      targetIndex = Math.max(0, Math.min(lastIndex, nextIndex));
      anchorIndex = targetIndex;
      view.scrollTo({ left: offsets[targetIndex], behavior: animate ? motionBehavior() : "instant" });
      update();
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settled, animate && !motionPreference.matches ? 800 : 0);
    };

    const step = (direction) => go((targetIndex ?? index) + direction);

    const endDrag = (snap = true) => {
      const current = drag;
      if (!current) return;
      drag = null;
      setIsDragging(false);
      if (view.hasPointerCapture(current.id)) view.releasePointerCapture(current.id);
      if (!current.active) return;
      suppressClickUntil = performance.now() + 350;
      if (!snap) return;
      // A short decisive flick advances once; slow drags settle on the nearest slide.
      const travel = view.scrollLeft - current.startScroll;
      const recentVelocity = performance.now() - current.lastTime < 100 ? current.velocity : 0;
      let destination = nearest(view.scrollLeft + recentVelocity * 150);
      if (
        destination === current.startIndex &&
        (Math.abs(travel) > Math.min(100, view.clientWidth * 0.15) || Math.abs(recentVelocity) > 0.5)
      ) {
        destination += Math.sign(travel || recentVelocity);
      }
      go(destination);
    };

    function restoreAnchor() {
      const restoreIndex = targetIndex ?? anchorIndex;
      clearTimeout(settleTimer);
      endDrag(false);
      measure();
      go(restoreIndex, false);
    }

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
      }
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settled, 140);
    };

    const onKeyDown = (event) => {
      if (event.target !== view && event.target.closest("a,button,input,select,textarea,[contenteditable]")) return;
      const actions = {
        ArrowLeft: () => step(-1),
        ArrowRight: () => step(1),
        Home: () => go(0),
        End: () => go(lastIndex),
      };
      if (!actions[event.key]) return;
      event.preventDefault();
      actions[event.key]();
    };

    const onPointerDown = (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0 || !event.isPrimary) return;
      if (event.target.closest("button,input,select,textarea")) return;
      targetIndex = null;
      view.scrollTo({ left: view.scrollLeft, behavior: "instant" });
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        startScroll: view.scrollLeft,
        startIndex: nearest(),
        lastScroll: view.scrollLeft,
        lastTime: performance.now(),
        velocity: 0,
        active: false,
      };
    };

    const onPointerMove = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      if (!(event.buttons & 1)) {
        endDrag();
        return;
      }
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.active) {
        if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
          endDrag(false);
          return;
        }
        if (Math.abs(dx) < 6) return;
        drag.active = true;
        setIsDragging(true);
        view.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      view.scrollLeft = drag.startScroll - dx;
      const now = performance.now();
      const elapsed = now - drag.lastTime;
      if (elapsed > 0) drag.velocity = Math.max(-3, Math.min(3, (view.scrollLeft - drag.lastScroll) / elapsed));
      drag.lastScroll = view.scrollLeft;
      drag.lastTime = now;
    };

    const onPointerUp = () => endDrag();
    const cancelDrag = () => endDrag(false);
    const onPointerLeave = () => {
      if (drag && !drag.active) endDrag(false);
    };
    const onDragStart = (event) => event.preventDefault();
    const onClickCapture = (event) => {
      if (event.detail && performance.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    const onTouchStart = () => {
      targetIndex = null;
    };
    const onWheel = (event) => {
      targetIndex = null;
      // Trackpad deltaX stays native; Shift + mouse wheel scrolls horizontally
      // until a boundary, where the event continues normally.
      if (!event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? view.clientWidth : 1);
      if ((delta < 0 && view.scrollLeft <= 0) || (delta > 0 && view.scrollLeft >= view.scrollWidth - view.clientWidth - 1)) return;
      event.preventDefault();
      view.scrollLeft += delta;
    };
    const onFocusIn = (event) => {
      // Pointer focus follows pointerdown; only keyboard focus jumps a card into view.
      if (drag) return;
      const slideIndex = slides.findIndex((slide) => slide.contains(event.target));
      if (slideIndex !== -1) go(slideIndex, false);
    };

    measure();
    view.scrollTo({ left: offsets[index], behavior: "instant" });
    update();

    const listeners = [
      ["scroll", onScroll, { passive: true }],
      ["scrollend", settled],
      ["keydown", onKeyDown],
      ["pointerdown", onPointerDown],
      ["pointermove", onPointerMove],
      ["pointerup", onPointerUp],
      ["pointercancel", cancelDrag],
      ["lostpointercapture", cancelDrag],
      ["pointerleave", onPointerLeave],
      ["dragstart", onDragStart],
      ["click", onClickCapture, true],
      ["touchstart", onTouchStart, { passive: true }],
      ["wheel", onWheel, { passive: false }],
      ["focusin", onFocusIn],
    ];
    listeners.forEach(([type, handler, options]) => view.addEventListener(type, handler, options));
    window.addEventListener("blur", cancelDrag);

    const resizeObserver = new ResizeObserver(() => {
      if (geometryChanged()) restoreAnchor();
    });
    resizeObserver.observe(view);
    document.fonts?.ready.then(() => {
      if (!disposed) restoreAnchor();
    });

    controlsRef.current = { go, step };

    return () => {
      disposed = true;
      controlsRef.current = null;
      clearTimeout(settleTimer);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      listeners.forEach(([type, handler, options]) => view.removeEventListener(type, handler, options));
      window.removeEventListener("blur", cancelDrag);
    };
  }, [align, startIndex]);

  const go = useCallback((index) => controlsRef.current?.go(index), []);
  const step = useCallback((direction) => controlsRef.current?.step(direction), []);

  return { viewportRef, ...position, isDragging, go, step };
};

export default useScrollCarousel;
