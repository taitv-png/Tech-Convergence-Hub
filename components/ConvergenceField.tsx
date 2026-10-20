"use client";

import { useEffect, useRef } from "react";

// "Trường hội tụ": twelve thin signal paths, one per technology direction, converge on one node.
// One motion only: the paths draw in once (about 1 s), then slow orange pulses travel inward.
// The pointer gently bends the field towards itself; text and controls never move.
const SIGNALS = 12;
const SAMPLES = 48;
const INTRO_MS = 1000;
const LINE = "rgba(35, 33, 31, 0.13)";
const ACCENT = "217, 77, 18";

type Point = { x: number; y: number };

// Deterministic pseudo random values keep the composition identical between visits.
const seeded = (index: number, salt: number) => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const signals = Array.from({ length: SIGNALS }, (_, index) => ({
  angle: ((index + 0.5) / SIGNALS) * Math.PI * 2 + (seeded(index, 1) - 0.5) * 0.28,
  bend: (index % 2 ? 1 : -1) * (0.12 + seeded(index, 2) * 0.12),
  period: 7000 + seeded(index, 3) * 5000,
  phase: seeded(index, 4),
}));

const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

export function ConvergenceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>("[data-convergence-hero]");
    const context = canvas?.getContext("2d");
    if (!canvas || !hero || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let start = 0;
    let visible = true;
    const pointer = { x: 0, y: 0, active: false };
    const lean = { x: 0, y: 0 };

    const anchor = (): Point =>
      width >= 900
        ? { x: width * 0.72, y: height * 0.46 }
        : { x: width * 0.8, y: 76 };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const bounds = hero.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const pathFor = (index: number, centre: Point) => {
      const signal = signals[index];
      const reach = Math.hypot(width, height);
      const origin = {
        x: centre.x + Math.cos(signal.angle) * reach,
        y: centre.y + Math.sin(signal.angle) * reach,
      };
      const middle = { x: (origin.x + centre.x) / 2, y: (origin.y + centre.y) / 2 };
      const control = {
        x: middle.x - (origin.y - centre.y) * signal.bend,
        y: middle.y + (origin.x - centre.x) * signal.bend,
      };
      const points: Point[] = [];
      for (let step = 0; step <= SAMPLES; step += 1) {
        const t = step / SAMPLES;
        const a = (1 - t) * (1 - t);
        const b = 2 * (1 - t) * t;
        const c = t * t;
        points.push({
          x: a * origin.x + b * control.x + c * centre.x,
          y: a * origin.y + b * control.y + c * centre.y,
        });
      }
      return points;
    };

    const stroke = (points: Point[], from: number, to: number) => {
      const first = Math.max(0, Math.floor(from * SAMPLES));
      const last = Math.min(SAMPLES, Math.ceil(to * SAMPLES));
      if (last <= first) return;
      context.beginPath();
      context.moveTo(points[first].x, points[first].y);
      for (let step = first + 1; step <= last; step += 1)
        context.lineTo(points[step].x, points[step].y);
      context.stroke();
    };

    const draw = (time: number) => {
      const elapsed = reducedMotion.matches ? Infinity : time - start;
      const base = anchor();
      if (pointer.active && !reducedMotion.matches) {
        const dx = Math.max(-48, Math.min(48, (pointer.x - base.x) * 0.08));
        const dy = Math.max(-36, Math.min(36, (pointer.y - base.y) * 0.08));
        lean.x += (dx - lean.x) * 0.06;
        lean.y += (dy - lean.y) * 0.06;
      } else {
        lean.x *= 0.94;
        lean.y *= 0.94;
      }
      const centre = { x: base.x + lean.x, y: base.y + lean.y };
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";

      for (let index = 0; index < SIGNALS; index += 1) {
        const points = pathFor(index, centre);
        const reveal = easeOut(Math.max(0, Math.min(1, (elapsed - index * 18) / INTRO_MS)));
        context.strokeStyle = LINE;
        context.lineWidth = 1;
        stroke(points, 0, reveal);

        if (reveal < 1 || reducedMotion.matches) continue;
        const signal = signals[index];
        const head = (time / signal.period + signal.phase) % 1;
        const tail = Math.max(0, head - 0.12);
        const gradient = context.createLinearGradient(
          points[Math.floor(tail * SAMPLES)].x,
          points[Math.floor(tail * SAMPLES)].y,
          points[Math.ceil(head * SAMPLES)].x,
          points[Math.ceil(head * SAMPLES)].y,
        );
        gradient.addColorStop(0, `rgba(${ACCENT}, 0)`);
        gradient.addColorStop(1, `rgba(${ACCENT}, ${0.25 + head * 0.55})`);
        context.strokeStyle = gradient;
        context.lineWidth = 1.5;
        stroke(points, tail, head);
      }

      const settle = easeOut(Math.max(0, Math.min(1, (elapsed - INTRO_MS * 0.6) / 500)));
      context.fillStyle = `rgba(${ACCENT}, ${settle})`;
      context.beginPath();
      context.arc(centre.x, centre.y, 4, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = `rgba(${ACCENT}, ${0.3 * settle})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(centre.x, centre.y, 16, 0, Math.PI * 2);
      context.stroke();
    };

    const loop = (time: number) => {
      frame = 0;
      if (!start) start = time;
      draw(time);
      if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(loop);
    };
    const play = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = hero.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    };
    const leave = () => {
      pointer.active = false;
    };
    const visibility = () => (document.hidden ? stop() : play());
    const resizeObserver = new ResizeObserver(() => {
      resize();
      play();
    });
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else stop();
    });

    resize();
    resizeObserver.observe(hero);
    viewObserver.observe(hero);
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    reducedMotion.addEventListener("change", play);
    play();

    return () => {
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      reducedMotion.removeEventListener("change", play);
    };
  }, []);

  return (
    <div className="cv-field" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
