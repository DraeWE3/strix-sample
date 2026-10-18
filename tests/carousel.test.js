import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cloneCountFor,
  controlSubject,
  decayVelocity,
  dragVelocity,
  initContinuousCarousels,
  initialPhase,
  isOutsideCycle,
  itemStepFor,
  mod,
  pauseReasonFor,
  wrapScroll,
} from "../src/components/shared/continuousCarousel.js";

const running = {
  itemCount: 4, cycle: 1000, reducedMotion: false, userPaused: false, hidden: false,
  visible: true, dragging: false, hovered: false, focused: false, time: 10, resumeAt: 0,
};

test("mod wraps negatives and guards empty cycles", () => {
  assert.equal(mod(5, 3), 2);
  assert.equal(mod(-1, 3), 2);
  assert.equal(mod(-7.5, 5), 2.5);
  assert.equal(mod(4, 0), 0);
});

test("clone count fills the viewport with at least one set per side", () => {
  assert.equal(cloneCountFor(5, 1200, 1440), 2);
  assert.equal(cloneCountFor(5, 2000, 1440), 1);
  assert.equal(cloneCountFor(5, 480, 1440), 3);
  assert.equal(cloneCountFor(5, 500, 0), 1);
});

test("no clones for a single item or an unmeasured cycle", () => {
  assert.equal(cloneCountFor(1, 1200, 1440), 0);
  assert.equal(cloneCountFor(0, 0, 1440), 0);
  assert.equal(cloneCountFor(4, 0, 1440), 0);
});

test("scroll positions wrap into the original set", () => {
  assert.equal(wrapScroll(2500, 2000, 1000), 2500);
  assert.equal(wrapScroll(3200, 2000, 1000), 2200);
  assert.equal(wrapScroll(1900, 2000, 1000), 2900);
  assert.equal(wrapScroll(-50, 0, 1000), 950);
});

test("normalisation only triggers outside the cycle tolerance", () => {
  assert.equal(isOutsideCycle(1999.5, 2000, 1000), false);
  assert.equal(isOutsideCycle(3000.5, 2000, 1000), false);
  assert.equal(isOutsideCycle(1999, 2000, 1000), true);
  assert.equal(isOutsideCycle(3001, 2000, 1000), true);
});

test("initial phase centres wide content only when asked", () => {
  assert.equal(initialPhase("center", 3000, 1400), 800);
  assert.equal(initialPhase("center", 1000, 1400), 0);
  assert.equal(initialPhase(undefined, 3000, 1400), 0);
});

test("item step returns the width of the item under the phase", () => {
  const widths = [300, 400, 200];
  assert.equal(itemStepFor(widths, 20, 0), 320);
  assert.equal(itemStepFor(widths, 20, 319), 420);
  assert.equal(itemStepFor(widths, 20, 750), 220);
  assert.equal(itemStepFor(widths, 20, 5000), 320);
  assert.equal(itemStepFor([], 20, 0), 0);
});

test("pause reasons follow the original priority order", () => {
  assert.equal(pauseReasonFor(running), "");
  assert.equal(pauseReasonFor({ ...running, itemCount: 1 }), "single-item");
  assert.equal(pauseReasonFor({ ...running, cycle: 0, reducedMotion: true }), "single-item");
  assert.equal(pauseReasonFor({ ...running, reducedMotion: true, userPaused: true }), "reduced-motion");
  assert.equal(pauseReasonFor({ ...running, userPaused: true, hidden: true }), "user");
  assert.equal(pauseReasonFor({ ...running, hidden: true, visible: false }), "hidden");
  assert.equal(pauseReasonFor({ ...running, visible: false, dragging: true }), "offscreen");
  assert.equal(pauseReasonFor({ ...running, dragging: true, hovered: true }), "drag");
  assert.equal(pauseReasonFor({ ...running, hovered: true, focused: true }), "hover");
  assert.equal(pauseReasonFor({ ...running, focused: true, resumeAt: 100 }), "focus");
  assert.equal(pauseReasonFor({ ...running, resumeAt: 100 }), "interaction");
});

test("reduced motion always blocks autoplay", () => {
  assert.equal(pauseReasonFor({ ...running, reducedMotion: true }), "reduced-motion");
});

test("inertia decays at the same rate regardless of frame length", () => {
  assert.equal(decayVelocity(1, 16.667), 0.92);
  assert.ok(Math.abs(decayVelocity(1, 33.334) - 0.92 * 0.92) < 1e-9);
});

test("drag velocity smooths and clamps pointer samples", () => {
  assert.ok(Math.abs(dragVelocity(0, 16, 16) - 0.6) < 1e-9);
  assert.equal(dragVelocity(0, 500, 1), 1.5);
  assert.equal(dragVelocity(0, -500, 1), -1.5);
  assert.ok(Math.abs(dragVelocity(1, 8, 2) - 1) < 1e-9);
});

test("toggle labels name the gallery", () => {
  assert.equal(controlSubject("concepts"), "both concept galleries");
  assert.equal(controlSubject("related"), "related projects gallery");
  assert.equal(controlSubject("responsive"), "responsive gallery");
});

test("init without a root is a no-op that still returns cleanup", () => {
  const destroy = initContinuousCarousels(null);
  assert.equal(typeof destroy, "function");
  destroy();
});
