"use client";

import { useEffect, useRef, useState } from "react";
import { TCH_MARK, TCH_MARK_ZOOM_ORIGIN, TCH_WORDMARK } from "./tch-logo";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

// White lockup first; warm light appears inside the mark only as it enlarges.
// Background LED rails stay peripheral, leaving the wordmark and tagline readable.
const PLATE = "#121110";
const INK = "#f6f3ee";
const LOCKUP_WIDTH = TCH_WORDMARK.offsetX + TCH_WORDMARK.width;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (value: number, from: number, to: number) => clamp((value - from) / (to - from));
const ease = (value: number) => value * value * (3 - 2 * value);

// Scroll timeline (fraction of the pinned distance).
const T = {
  word: [0.08, 0.2],
  settle: [0.16, 0.3],
  zoom: [0.3, 0.7],
  tagline: [0.72, 0.86],
} as const;
const at = (progress: number, key: keyof typeof T) => span(progress, T[key][0], T[key][1]);

function frameFor(width: number, height: number, progress: number) {
  const lockupPx = Math.min(560, width * 0.72);
  const unit = lockupPx / LOCKUP_WIDTH;
  const markPx = TCH_MARK.width * unit;
  const left = (width - lockupPx) / 2;
  const top = (height - TCH_MARK.height * unit) / 2;
  const settle = ease(at(progress, "settle"));
  const markLeft = left + ((width - markPx) / 2 - left) * settle;
  const zoom = ease(at(progress, "zoom"));
  const needed = (Math.max(width, height) * 0.62) / (TCH_MARK_ZOOM_ORIGIN.halfStem * unit);
  const scale = unit * Math.exp(Math.log(Math.max(needed, 1.01)) * zoom);
  const originX = markLeft + TCH_MARK_ZOOM_ORIGIN.x * unit;
  const originY = top + TCH_MARK_ZOOM_ORIGIN.y * unit;
  return {
    mark: `translate(${originX.toFixed(2)} ${originY.toFixed(2)}) scale(${scale.toFixed(5)}) translate(${-TCH_MARK_ZOOM_ORIGIN.x} ${-TCH_MARK_ZOOM_ORIGIN.y})`,
    word: `translate(${(left + TCH_WORDMARK.offsetX * unit).toFixed(2)} ${top.toFixed(2)}) scale(${unit.toFixed(5)})`,
    wordOpacity: 1 - ease(at(progress, "word")),
  };
}

export function LogoDoor({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).door;
  const section = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 1440, height: 560 });
  const [live, setLive] = useState(false);
  const initial = frameFor(size.width, size.height, 0);

  useEffect(() => {
    const root = section.current;
    const drawing = svg.current;
    if (!root || !drawing) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const marks = drawing.querySelectorAll<SVGPathElement>(".cv-door-mark");
    const ink = drawing.querySelector<SVGPathElement>(".cv-door-ink");
    const word = drawing.querySelector<SVGPathElement>(".cv-door-word");
    let frame = 0;
    let displayed: number | null = null;
    let previousTime = 0;

    const render = (time: number) => {
      frame = 0;
      const width = drawing.clientWidth;
      const height = drawing.clientHeight;
      if (!width || !height) return;
      drawing.setAttribute("viewBox", `0 0 ${width} ${height}`);
      drawing.querySelectorAll("rect").forEach((rect) => {
        rect.setAttribute("width", String(width));
        rect.setAttribute("height", String(height));
      });
      const still = reducedMotion.matches || !root.classList.contains("is-live");
      let progress = 0;
      if (!still) {
        const rect = root.getBoundingClientRect();
        const stage = root.firstElementChild as HTMLElement;
        progress = clamp(-rect.top / Math.max(1, rect.height - stage.offsetHeight));
      }
      const delta = Math.min(64, previousTime ? time - previousTime : 16);
      previousTime = time;
      displayed = still || displayed === null ? progress : displayed + (progress - displayed) * (1 - Math.exp(-delta / 85));
      if (Math.abs(progress - displayed) < 0.0001) displayed = progress;
      const next = frameFor(width, height, displayed);
      marks.forEach((mark) => mark.setAttribute("transform", next.mark));
      word?.setAttribute("transform", next.word);
      word?.setAttribute("opacity", next.wordOpacity.toFixed(3));
      const warmth = still ? 0 : ease(span(displayed, 0.30, 0.57));
      ink?.setAttribute("opacity", (1 - warmth).toFixed(4));
      root.style.setProperty("--door-light", (1 - ease(span(displayed, 0.54, 0.74))).toFixed(4));
      root.style.setProperty("--door-scene", still ? "1" : ease(at(displayed, "tagline")).toFixed(4));
      if (displayed !== progress) frame = requestAnimationFrame(render);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const applyMode = () => {
      setLive(!reducedMotion.matches);
      schedule();
    };
    const resize = new ResizeObserver(() => {
      setSize({ width: drawing.clientWidth || 1440, height: drawing.clientHeight || 560 });
      schedule();
    });
    applyMode();
    resize.observe(drawing);
    window.addEventListener("scroll", schedule, { passive: true });
    reducedMotion.addEventListener("change", applyMode);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      reducedMotion.removeEventListener("change", applyMode);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new Event("scroll"));
  }, [live, size]);

  return (
    <section ref={section} className={`cv-door${live ? " is-live" : ""}`} aria-label="Tech-Convergence Hub">
      <div className="cv-door-stage">
        <svg
          ref={svg}
          className="cv-door-plate"
          viewBox={`0 0 ${size.width} ${size.height}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <mask id="cv-door-mask" maskUnits="userSpaceOnUse">
              <rect x="0" y="0" width={size.width} height={size.height} fill="white" />
              <path className="cv-door-mark" d={TCH_MARK.d} transform={initial.mark} fill="black" fillRule="evenodd" />
            </mask>
          </defs>
          <rect x="0" y="0" width={size.width} height={size.height} fill={PLATE} mask="url(#cv-door-mask)" />
          <path className="cv-door-mark cv-door-ink" d={TCH_MARK.d} transform={initial.mark} fill={INK} fillRule="evenodd" />
          <path className="cv-door-word" d={TCH_WORDMARK.d} transform={initial.word} fill={INK} fillRule="evenodd" />
        </svg>
        <div className="cv-door-neon" aria-hidden="true"><i /><i /><i /></div>
        <div className="cv-door-scene">
          <p>
            {t.taglineA}
            <br />
            <span>{t.taglineB}</span>
          </p>
        </div>
      </div>
      <span className="cv-dark-end" aria-hidden="true" />
    </section>
  );
}
