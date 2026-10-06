// Continuous gallery with native scrolling, pointer drag, keyboard controls and reduced-motion support.
// Ported from strix-production-services/carousels.js; scoped to one root element instead of `document`.

const manualPause = new Map();
const mod = (value, length) => (length > 0 ? ((value % length) + length) % length : 0);
const now = () => performance.now();

export function createContinuousCarousels(root) {
  let states = [];
  let controller = null;
  let resizeObserver = null;
  let intersectionObserver = null;
  let media = null;
  let frame = 0;
  let lastTime = 0;
  let wakeTimer = 0;
  let wakeAt = 0;
  let controls = [];
  let controlsOriginal = new Map();

  function related(id) {
    return states.filter((state) => state.id === id || (id === "concepts" && state.id.startsWith("concepts-")));
  }

  function isControlFor(element, state) {
    if (!(element instanceof Element)) return false;
    const control = element.closest("[data-carousel-prev],[data-carousel-next],[data-carousel-toggle]");
    if (!control) return false;
    const id = control.dataset.carouselPrev || control.dataset.carouselNext || control.dataset.carouselToggle;
    return related(id).includes(state);
  }

  function pauseReason(state, time) {
    if (state.originals.length < 2 || !state.cycle) return "single-item";
    if (media.matches) return "reduced-motion";
    if (state.userPaused) return "user";
    if (document.hidden) return "hidden";
    if (!state.visible) return "offscreen";
    if (state.drag || state.touching) return "drag";
    if (state.hovered) return "hover";
    if (state.viewport.contains(document.activeElement) || isControlFor(document.activeElement, state)) return "focus";
    if (time < state.resumeAt) return "interaction";
    return "";
  }

  function updateStatus(state, time) {
    const reason = pauseReason(state, time);
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
      const subject = id === "concepts" ? "both concept galleries" : id === "related" ? "related projects gallery" : "responsive gallery";
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
    if (value < state.base - 0.75 || value > state.base + state.cycle + 0.75) {
      setScroll(state, state.base + mod(value - state.base, state.cycle));
    }
  }

  function move(state, delta) {
    if (!state.cycle || state.originals.length < 2) return;
    setScroll(state, state.base + mod(state.logicalScroll - state.base + delta, state.cycle));
  }

  function scheduleWake(delay) {
    if (!controller || controller.signal.aborted) return;
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
    if (!controller || controller.signal.aborted || frame || document.hidden) return;
    lastTime = 0;
    frame = requestAnimationFrame(tick);
  }

  function tick(time) {
    frame = 0;
    if (!controller || controller.signal.aborted) return;
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
        const eased = 1 - Math.pow(1 - progress, 3);
        const distance = tween.distance * eased;
        move(state, distance - tween.previous);
        tween.previous = distance;
        if (progress === 1) state.tween = null;
        else active = true;
      } else if (!state.drag && Math.abs(state.velocity) > 0.025 && !media.matches) {
        move(state, state.velocity * elapsed);
        state.velocity *= Math.pow(0.92, elapsed / 16.667);
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
    const phase = mod(state.viewport.scrollLeft - state.base, state.cycle);
    let position = 0;
    for (const item of state.originals) {
      const width = item.getBoundingClientRect().width;
      if (position + width + state.gap > phase + 1) return width + state.gap;
      position += width + state.gap;
    }
    return state.originals[0]?.getBoundingClientRect().width + state.gap || 0;
  }

  function cloneGroup(group) {
    const clone = group.cloneNode(true);
    clone.dataset.carouselClone = "";
    clone.removeAttribute("data-carousel-originals");
    clone.setAttribute("aria-hidden", "true");
    clone.inert = true;
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    clone.querySelectorAll("a,button,input,select,textarea,[tabindex]").forEach((element) => {
      element.setAttribute("tabindex", "-1");
      if ("disabled" in element) element.disabled = true;
    });
    return clone;
  }

  function measure(state, initial = false) {
    if (!state.group.isConnected) return;
    const priorCycle = state.cycle;
    const priorPhase = priorCycle ? mod(state.logicalScroll - state.base, priorCycle) / priorCycle : 0;
    const trackStyle = getComputedStyle(state.track);
    const viewportStyle = getComputedStyle(state.viewport);
    const gap = parseFloat(trackStyle.columnGap) || 0;
    const width = state.group.getBoundingClientRect().width;
    const availableWidth = state.viewport.clientWidth - (parseFloat(viewportStyle.paddingLeft) || 0) - (parseFloat(viewportStyle.paddingRight) || 0);
    const cycle = width + gap;
    const cloneCount = state.originals.length > 1 && cycle > 0 ? Math.max(1, Math.ceil(availableWidth / cycle)) : 0;
    if (cloneCount !== state.cloneCount) {
      state.track.querySelectorAll(":scope > [data-carousel-clone]").forEach((clone) => clone.remove());
      for (let index = 0; index < cloneCount; index += 1) {
        state.track.insertBefore(cloneGroup(state.group), state.group);
        state.track.append(cloneGroup(state.group));
      }
      state.cloneCount = cloneCount;
    }
    state.gap = gap;
    state.cycle = cycle;
    state.base = cloneCount * cycle;
    const phase = initial ? (state.viewport.dataset.initialAlign === "center" ? Math.max(0, (width - availableWidth) / 2) : 0) : priorPhase * cycle;
    setScroll(state, state.base + phase);
    updateStatus(state, now());
    updateControls();
    ensureFrame();
  }

  function addState(viewport) {
    const track = viewport.querySelector("[data-track]");
    if (!track) return;
    const originals = Array.from(track.children);
    const group = document.createElement("div");
    group.dataset.carouselOriginals = "";
    Object.assign(group.style, { display: "flex", flex: "none", alignItems: "center", gap: "inherit", width: "max-content" });
    originals.forEach((item) => group.append(item));
    track.append(group);
    const state = {
      id: viewport.dataset.carousel, viewport, track, group, originals,
      gap: 0, cycle: 0, base: 0, cloneCount: -1,
      userPaused: manualPause.get(viewport.dataset.carousel) || false,
      visible: !("IntersectionObserver" in window), hovered: viewport.matches(":hover"), touching: false,
      drag: null, velocity: 0, tween: null, resumeAt: 0, expectedScroll: 0, logicalScroll: 0,
      speed: (parseFloat(viewport.dataset.speed) || 24) * (viewport.dataset.direction === "reverse" ? -1 : 1),
      originalScrollBehavior: viewport.style.scrollBehavior,
      originalRoleDescription: viewport.getAttribute("aria-roledescription"),
      suppressClickUntil: 0,
    };
    states.push(state);
    viewport.style.scrollBehavior = "auto";
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.dataset.carouselInitialized = "true";
    const signal = controller.signal;
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
      if (event.pointerType !== "mouse" || event.button !== 0 || originals.length < 2) return;
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
      const sample = Math.max(-2.5, Math.min(2.5, delta / Math.max(8, time - drag.lastTime)));
      state.velocity = state.velocity * 0.4 + sample * 0.6;
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
    resizeObserver?.observe(group);
    intersectionObserver?.observe(viewport);
  }

  function init() {
    destroy();
    controller = new AbortController();
    media = matchMedia("(prefers-reduced-motion: reduce)");
    const signal = controller.signal;
    const viewports = Array.from(root.querySelectorAll("[data-carousel]"));
    controls = Array.from(root.querySelectorAll("[data-carousel-prev],[data-carousel-next],[data-carousel-toggle]"));
    controlsOriginal = new Map(controls.map((control) => [control, { text: control.textContent, disabled: control.disabled, label: control.getAttribute("aria-label"), pressed: control.getAttribute("aria-pressed") }]));
    if ("ResizeObserver" in window) resizeObserver = new ResizeObserver((entries) => {
      const affected = new Set(entries.map((entry) => states.find((state) => state.viewport === entry.target || state.group === entry.target)).filter(Boolean));
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
    viewports.forEach(addState);

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
  }

  function destroy() {
    if (controller) controller.abort();
    controller = null;
    resizeObserver?.disconnect(); resizeObserver = null;
    intersectionObserver?.disconnect(); intersectionObserver = null;
    cancelAnimationFrame(frame); frame = 0;
    clearTimeout(wakeTimer); wakeTimer = 0; wakeAt = 0; lastTime = 0;
    states.forEach((state) => {
      manualPause.set(state.id, state.userPaused);
      const phase = mod(state.viewport.scrollLeft - state.base, state.cycle);
      if (state.group.isConnected) state.track.replaceChildren(...state.originals);
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
    states = []; controls = []; controlsOriginal.clear();
  }

  init();
  return { destroy };
}
