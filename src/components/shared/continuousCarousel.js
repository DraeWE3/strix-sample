// Continuous galleries with native scrolling, pointer drag, keyboard controls and reduced-motion support.
// Scoped to one root element. React-rendered items are never moved: aria-hidden clones are added as
// siblings around them and removed again on cleanup, so the DOM React owns stays intact.

const manualPause = new Map();
const now = () => performance.now();
const CONTROL_SELECTOR = "[data-carousel-prev],[data-carousel-next],[data-carousel-toggle]";

export const mod = (value, length) => (length > 0 ? ((value % length) + length) % length : 0);

export function cloneCountFor(itemCount, cycle, availableWidth) {
  return itemCount > 1 && cycle > 0 ? Math.max(1, Math.ceil(availableWidth / cycle)) : 0;
}

export function wrapScroll(value, base, cycle) {
  return base + mod(value - base, cycle);
}

export function isOutsideCycle(value, base, cycle) {
  return value < base - 0.75 || value > base + cycle + 0.75;
}

export function initialPhase(align, contentWidth, availableWidth) {
  return align === "center" ? Math.max(0, (contentWidth - availableWidth) / 2) : 0;
}

export function itemStepFor(widths, gap, phase) {
  let position = 0;
  for (const width of widths) {
    if (position + width + gap > phase + 1) return width + gap;
    position += width + gap;
  }
  return widths.length ? widths[0] + gap : 0;
}

export function pauseReasonFor(status) {
  if (status.itemCount < 2 || !status.cycle) return "single-item";
  if (status.reducedMotion) return "reduced-motion";
  if (status.userPaused) return "user";
  if (status.hidden) return "hidden";
  if (!status.visible) return "offscreen";
  if (status.dragging) return "drag";
  if (status.hovered) return "hover";
  if (status.focused) return "focus";
  if (status.time < status.resumeAt) return "interaction";
  return "";
}

export function decayVelocity(velocity, elapsed) {
  return velocity * Math.pow(0.92, elapsed / 16.667);
}

export function dragVelocity(previous, delta, elapsed) {
  const sample = Math.max(-2.5, Math.min(2.5, delta / Math.max(8, elapsed)));
  return previous * 0.4 + sample * 0.6;
}

export function controlSubject(id) {
  if (id === "concepts") return "both concept galleries";
  if (id === "related") return "related projects gallery";
  return "responsive gallery";
}

const isClone = (node) => node instanceof Element && node.hasAttribute("data-carousel-clone");

export function initContinuousCarousels(root, { defaultSpeed = 24 } = {}) {
  if (!root) return () => {};
  let states = [];
  const controller = new AbortController();
  let resizeObserver = null;
  let intersectionObserver = null;
  let mutationObserver = null;
  let frame = 0;
  let lastTime = 0;
  let wakeTimer = 0;
  let wakeAt = 0;
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const signal = controller.signal;
  const controls = Array.from(root.querySelectorAll(CONTROL_SELECTOR));
  const controlsOriginal = new Map(controls.map((control) => [control, { text: control.textContent, disabled: control.disabled, label: control.getAttribute("aria-label"), pressed: control.getAttribute("aria-pressed") }]));

  function related(id) {
    return states.filter((state) => state.id === id || (id === "concepts" && state.id.startsWith("concepts-")));
  }

  function isControlFor(element, state) {
    if (!(element instanceof Element) || !root.contains(element)) return false;
    const control = element.closest(CONTROL_SELECTOR);
    if (!control) return false;
    const id = control.dataset.carouselPrev || control.dataset.carouselNext || control.dataset.carouselToggle;
    return related(id).includes(state);
  }

  function updateStatus(state, time) {
    const reason = pauseReasonFor({
      itemCount: state.originals.length,
      cycle: state.cycle,
      reducedMotion: media.matches,
      userPaused: state.userPaused,
      hidden: document.hidden,
      visible: state.visible,
      dragging: Boolean(state.drag || state.touching),
      hovered: state.hovered,
      focused: state.viewport.contains(document.activeElement) || isControlFor(document.activeElement, state),
      time,
      resumeAt: state.resumeAt,
    });
    state.viewport.dataset.paused = String(Boolean(reason));
    state.viewport.dataset.running = String(!reason);
    state.viewport.dataset.pauseReason = reason;
    return reason;
  }

  function updateControls() {
    controls.forEach((control) => {
      const id = control.dataset.carouselPrev || control.dataset.carouselNext || control.dataset.carouselToggle;
      const group = related(id);
      const available = group.some((state) => state.originals.length > 1 && state.cycle > 0);
      if (!control.hasAttribute("data-carousel-toggle")) {
        control.disabled = !available;
        return;
      }
      const paused = group.length > 0 && group.every((state) => state.userPaused);
      control.disabled = !available || media.matches;
      control.setAttribute("aria-pressed", String(paused || media.matches));
      const subject = controlSubject(id);
      if (media.matches) {
        control.textContent = "Motion off";
        control.setAttribute("aria-label", `Automatic movement is off for ${subject} because reduced motion is enabled`);
      } else if (!available) {
        control.textContent = "Pause";
        control.setAttribute("aria-label", "Automatic movement is unavailable with fewer than two images");
      } else {
        control.textContent = paused ? "Play" : "Pause";
        control.setAttribute("aria-label", `${paused ? "Play" : "Pause"} ${subject}`);
      }
    });
  }

  function setScroll(state, value) {
    state.logicalScroll = value;
    state.viewport.scrollLeft = value;
    state.expectedScroll = state.viewport.scrollLeft;
  }

  function normalize(state) {
    if (!state.cycle || !state.cloneCount) return;
    const value = state.viewport.scrollLeft;
    if (isOutsideCycle(value, state.base, state.cycle)) setScroll(state, wrapScroll(value, state.base, state.cycle));
  }

  function move(state, delta) {
    if (!state.cycle || state.originals.length < 2) return;
    setScroll(state, wrapScroll(state.logicalScroll + delta, state.base, state.cycle));
  }

  function scheduleWake(delay) {
    if (signal.aborted) return;
    const deadline = now() + Math.max(20, delay);
    if (wakeTimer && wakeAt <= deadline) return;
    if (wakeTimer) clearTimeout(wakeTimer);
    wakeAt = deadline;
    wakeTimer = window.setTimeout(() => {
      wakeTimer = 0;
      wakeAt = 0;
      ensureFrame();
    }, Math.max(20, delay));
  }

  function ensureFrame() {
    if (signal.aborted || frame || document.hidden) return;
    lastTime = 0;
    frame = requestAnimationFrame(tick);
  }

  function tick(time) {
    frame = 0;
    if (signal.aborted) return;
    const elapsed = lastTime ? Math.min(64, time - lastTime) : 16.667;
    lastTime = time;
    let active = false;
    let earliestResume = Infinity;

    states.forEach((state) => {
      normalize(state);
      const reason = updateStatus(state, time);
      if (document.hidden || !state.visible) return;
      if (state.tween) {
        const tween = state.tween;
        const progress = Math.min(1, (time - tween.start) / tween.duration);
        const distance = tween.distance * (1 - Math.pow(1 - progress, 3));
        move(state, distance - tween.previous);
        tween.previous = distance;
        if (progress === 1) state.tween = null;
        else active = true;
      } else if (!state.drag && Math.abs(state.velocity) > 0.025 && !media.matches) {
        move(state, state.velocity * elapsed);
        state.velocity = decayVelocity(state.velocity, elapsed);
        active = true;
      } else {
        if (!state.drag) state.velocity = 0;
        if (!reason) {
          move(state, (state.speed * elapsed) / 1000);
          active = true;
        } else if (reason === "interaction") {
          earliestResume = Math.min(earliestResume, state.resumeAt - time);
        }
      }
    });

    if (active) frame = requestAnimationFrame(tick);
    else lastTime = 0;
    if (earliestResume < Infinity) scheduleWake(earliestResume + 20);
  }

  function pauseForInteraction(state, delay = 3200) {
    state.resumeAt = now() + delay;
    state.velocity = 0;
    state.tween = null;
    updateStatus(state, now());
    scheduleWake(delay + 20);
  }

  function toggle(id) {
    if (media.matches) return;
    const group = related(id).filter((state) => state.originals.length > 1);
    const shouldPause = !group.every((state) => state.userPaused);
    group.forEach((state) => {
      state.userPaused = shouldPause;
      manualPause.set(state.id, shouldPause);
      state.velocity = 0;
      state.tween = null;
      state.resumeAt = 0;
      updateStatus(state, now());
    });
    updateControls();
    ensureFrame();
  }

  function step(state, distance) {
    if (state.originals.length < 2) return;
    pauseForInteraction(state, 4200);
    if (media.matches) move(state, distance);
    else state.tween = { start: now(), distance, previous: 0, duration: 380 };
    ensureFrame();
  }

  function itemStep(state) {
    const widths = state.originals.map((item) => item.getBoundingClientRect().width);
    return itemStepFor(widths, state.gap, mod(state.viewport.scrollLeft - state.base, state.cycle));
  }

  function cloneItem(item) {
    const clone = item.cloneNode(true);
    clone.dataset.carouselClone = "";
    clone.setAttribute("aria-hidden", "true");
    clone.inert = true;
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    if (clone.matches("a,button,input,select,textarea,[tabindex]")) clone.setAttribute("tabindex", "-1");
    clone.querySelectorAll("a,button,input,select,textarea,[tabindex]").forEach((element) => {
      element.setAttribute("tabindex", "-1");
      if ("disabled" in element) element.disabled = true;
    });
    return clone;
  }

  function cloneSet(state) {
    const fragment = document.createDocumentFragment();
    state.originals.forEach((item) => fragment.append(cloneItem(item)));
    return fragment;
  }

  function removeClones(state) {
    state.track.querySelectorAll(":scope > [data-carousel-clone]").forEach((clone) => clone.remove());
  }

  function contentWidth(state) {
    const first = state.originals[0];
    const last = state.originals[state.originals.length - 1];
    if (!first) return 0;
    return last.getBoundingClientRect().right - first.getBoundingClientRect().left;
  }

  function measure(state, initial = false) {
    if (!state.track.isConnected) return;
    const priorCycle = state.cycle;
    const priorPhase = priorCycle ? mod(state.logicalScroll - state.base, priorCycle) / priorCycle : 0;
    const viewportStyle = getComputedStyle(state.viewport);
    const gap = parseFloat(getComputedStyle(state.track).columnGap) || 0;
    const width = contentWidth(state);
    const availableWidth = state.viewport.clientWidth - (parseFloat(viewportStyle.paddingLeft) || 0) - (parseFloat(viewportStyle.paddingRight) || 0);
    const cycle = width + gap;
    const cloneCount = cloneCountFor(state.originals.length, cycle, availableWidth);
    if (cloneCount !== state.cloneCount) {
      removeClones(state);
      const first = state.originals[0];
      for (let index = 0; index < cloneCount; index += 1) {
        state.track.insertBefore(cloneSet(state), first);
        state.track.append(cloneSet(state));
      }
      state.cloneCount = cloneCount;
    }
    state.gap = gap;
    state.cycle = cycle;
    state.base = cloneCount * cycle;
    const phase = initial ? initialPhase(state.viewport.dataset.initialAlign, width, availableWidth) : priorPhase * cycle;
    setScroll(state, state.base + phase);
    updateStatus(state, now());
    updateControls();
    ensureFrame();
  }

  function observeItems(state) {
    state.originals.forEach((item) => resizeObserver?.observe(item));
  }

  function rebuild(state) {
    state.originals.forEach((item) => resizeObserver?.unobserve(item));
    removeClones(state);
    state.originals = Array.from(state.track.children);
    state.cloneCount = -1;
    state.tween = null;
    observeItems(state);
    measure(state);
  }

  function addState(viewport) {
    const track = viewport.querySelector("[data-track]");
    if (!track) return;
    const state = {
      id: viewport.dataset.carousel, viewport, track, originals: Array.from(track.children),
      gap: 0, cycle: 0, base: 0, cloneCount: -1,
      userPaused: manualPause.get(viewport.dataset.carousel) || false,
      visible: !("IntersectionObserver" in window), hovered: viewport.matches(":hover"), touching: false,
      drag: null, velocity: 0, tween: null, resumeAt: 0, expectedScroll: 0, logicalScroll: 0,
      speed: (parseFloat(viewport.dataset.speed) || defaultSpeed) * (viewport.dataset.direction === "reverse" ? -1 : 1),
      originalScrollBehavior: viewport.style.scrollBehavior,
      originalRoleDescription: viewport.getAttribute("aria-roledescription"),
      suppressClickUntil: 0,
    };
    states.push(state);
    viewport.style.scrollBehavior = "auto";
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.dataset.carouselInitialized = "true";
    const listen = (type, listener, options = {}) => viewport.addEventListener(type, listener, { ...options, signal });

    listen("pointerenter", (event) => {
      if (event.pointerType !== "mouse") return;
      state.hovered = true;
      updateStatus(state, now());
    });
    listen("pointerleave", (event) => {
      if (event.pointerType !== "mouse") return;
      state.hovered = false;
      ensureFrame();
    });
    listen("focusin", () => { state.velocity = 0; updateStatus(state, now()); });
    listen("focusout", () => queueMicrotask(ensureFrame));
    listen("wheel", () => pauseForInteraction(state, 3500), { passive: true });
    listen("touchstart", () => { state.touching = true; pauseForInteraction(state, 4000); }, { passive: true });
    const endTouch = (event) => {
      state.touching = Boolean(event.touches?.length);
      state.resumeAt = now() + 4000;
      scheduleWake(4020);
    };
    listen("touchend", endTouch, { passive: true });
    listen("touchcancel", endTouch, { passive: true });
    listen("scroll", () => {
      if (Math.abs(viewport.scrollLeft - state.expectedScroll) > 0.5 && !state.drag) {
        state.logicalScroll = viewport.scrollLeft;
        pauseForInteraction(state, 3500);
      }
      normalize(state);
    }, { passive: true });

    listen("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0 || state.originals.length < 2) return;
      if (event.target.closest("a,button,input,select,textarea")) return;
      pauseForInteraction(state, 4000);
      state.drag = { id: event.pointerId, originX: event.clientX, lastX: event.clientX, lastTime: now(), started: false };
      updateStatus(state, now());
      viewport.setPointerCapture(event.pointerId);
    });
    listen("pointermove", (event) => {
      const drag = state.drag;
      if (!drag || drag.id !== event.pointerId) return;
      const time = now();
      if (!drag.started && Math.abs(event.clientX - drag.originX) < 5) return;
      const delta = drag.lastX - event.clientX;
      if (!drag.started) {
        drag.started = true;
        viewport.classList.add("is-dragging");
      }
      event.preventDefault();
      move(state, delta);
      state.velocity = dragVelocity(state.velocity, delta, time - drag.lastTime);
      drag.lastX = event.clientX;
      drag.lastTime = time;
    }, { passive: false });
    const releaseDrag = (event) => {
      const drag = state.drag;
      if (!drag || event.pointerId !== drag.id) return;
      state.drag = null;
      viewport.classList.remove("is-dragging");
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (drag.started) state.suppressClickUntil = now() + 250;
      if (event.type !== "pointerup" || !drag.started || now() - drag.lastTime > 100 || media.matches) state.velocity = 0;
      state.resumeAt = now() + 4000;
      scheduleWake(4020);
      ensureFrame();
    };
    listen("pointerup", releaseDrag);
    listen("pointercancel", releaseDrag);
    listen("lostpointercapture", releaseDrag);
    listen("click", (event) => {
      if (now() < state.suppressClickUntil) { event.preventDefault(); event.stopPropagation(); }
    }, { capture: true });
    listen("keydown", (event) => {
      if (event.target !== viewport || event.altKey || event.ctrlKey || event.metaKey) return;
      let distance = 0;
      if (event.key === "ArrowRight") distance = itemStep(state);
      else if (event.key === "ArrowLeft") distance = -itemStep(state);
      else if (event.key === "PageDown") distance = viewport.clientWidth * 0.85;
      else if (event.key === "PageUp") distance = -viewport.clientWidth * 0.85;
      else if (event.key === "Home" || event.key === "End") {
        const phase = mod(viewport.scrollLeft - state.base, state.cycle);
        distance = (event.key === "Home" ? 0 : Math.max(0, state.cycle - itemStep(state))) - phase;
      } else if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault(); toggle(state.id); return;
      } else return;
      event.preventDefault(); step(state, distance);
    });

    measure(state, true);
    resizeObserver?.observe(viewport);
    observeItems(state);
    intersectionObserver?.observe(viewport);
    mutationObserver?.observe(track, { childList: true, subtree: true, characterData: true, attributes: true });
  }

  function isOwnMutation(record) {
    const target = record.target instanceof Element ? record.target : record.target.parentElement;
    if (target?.closest("[data-carousel-clone]")) return true;
    if (record.type !== "childList") return false;
    return [...record.addedNodes, ...record.removedNodes].every(isClone);
  }

  if ("ResizeObserver" in window) resizeObserver = new ResizeObserver((entries) => {
    const affected = new Set(entries.map((entry) => states.find((state) => state.viewport === entry.target || state.originals.includes(entry.target))).filter(Boolean));
    affected.forEach((state) => measure(state));
  });
  if ("IntersectionObserver" in window) intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const state = states.find((item) => item.viewport === entry.target);
      if (!state) return;
      state.visible = entry.isIntersecting;
      if (!state.visible) { state.velocity = 0; state.tween = null; }
      updateStatus(state, now());
    });
    ensureFrame();
  }, { threshold: 0, rootMargin: "0px" });
  if ("MutationObserver" in window) mutationObserver = new MutationObserver((records) => {
    const affected = new Set(records.filter((record) => !isOwnMutation(record)).map((record) => states.find((state) => state.track.contains(record.target))).filter(Boolean));
    affected.forEach(rebuild);
  });
  Array.from(root.querySelectorAll("[data-carousel]")).forEach(addState);

  controls.forEach((control) => {
    control.addEventListener("click", () => {
      if (control.hasAttribute("data-carousel-toggle")) toggle(control.dataset.carouselToggle);
      else {
        const direction = control.hasAttribute("data-carousel-prev") ? -1 : 1;
        related(control.dataset.carouselPrev || control.dataset.carouselNext).forEach((state) => step(state, itemStep(state) * direction));
      }
    }, { signal });
    control.addEventListener("focus", () => states.forEach((state) => updateStatus(state, now())), { signal });
    control.addEventListener("blur", () => queueMicrotask(ensureFrame), { signal });
  });
  media.addEventListener("change", () => {
    states.forEach((state) => { state.velocity = 0; state.tween = null; updateStatus(state, now()); });
    updateControls(); ensureFrame();
  }, { signal });
  document.addEventListener("visibilitychange", () => {
    states.forEach((state) => { state.velocity = 0; state.tween = null; updateStatus(state, now()); });
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    else ensureFrame();
  }, { signal });
  window.addEventListener("resize", () => states.forEach((state) => measure(state)), { signal, passive: true });
  document.fonts?.ready.then(() => {
    if (!signal.aborted) states.forEach((state) => measure(state));
  });
  updateControls();
  ensureFrame();

  return function destroy() {
    if (signal.aborted) return;
    controller.abort();
    mutationObserver?.disconnect(); mutationObserver = null;
    resizeObserver?.disconnect(); resizeObserver = null;
    intersectionObserver?.disconnect(); intersectionObserver = null;
    cancelAnimationFrame(frame); frame = 0;
    clearTimeout(wakeTimer); wakeTimer = 0; wakeAt = 0; lastTime = 0;
    states.forEach((state) => {
      manualPause.set(state.id, state.userPaused);
      const phase = mod(state.viewport.scrollLeft - state.base, state.cycle);
      removeClones(state);
      state.viewport.style.scrollBehavior = state.originalScrollBehavior;
      state.viewport.scrollLeft = phase;
      state.viewport.classList.remove("is-dragging");
      if (state.originalRoleDescription === null) state.viewport.removeAttribute("aria-roledescription");
      else state.viewport.setAttribute("aria-roledescription", state.originalRoleDescription);
      ["carouselInitialized", "paused", "running", "pauseReason"].forEach((key) => delete state.viewport.dataset[key]);
    });
    controlsOriginal.forEach((original, control) => {
      if (control.hasAttribute("data-carousel-toggle")) control.textContent = original.text;
      control.disabled = original.disabled;
      ["label", "pressed"].forEach((key) => {
        const attribute = `aria-${key}`;
        if (original[key] === null) control.removeAttribute(attribute);
        else control.setAttribute(attribute, original[key]);
      });
    });
    states = [];
    controlsOriginal.clear();
  };
}
