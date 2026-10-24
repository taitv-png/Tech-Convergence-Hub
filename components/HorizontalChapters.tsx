"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Ordinary vertical scrolling drives just this pair of desktop chapters sideways.
// Anchors remain in the document flow, including with reduced motion or no script.
export function HorizontalChapters({ children, next }: { children: ReactNode; next: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const second = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = root.current;
    const viewport = stage.current;
    const about = first.current;
    const technology = second.current;
    const marker = anchor.current;
    if (!box || !viewport || !about || !technology || !marker) return;
    const desktop = window.matchMedia("(min-width: 1100px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let anchorFrame = 0;
    const render = () => {
      frame = 0;
      const live = desktop.matches;
      const distance = Math.max(1, box.offsetHeight - viewport.offsetHeight);
      const header = Number.parseFloat(getComputedStyle(box).getPropertyValue("--header-height")) || 0;
      const raw = Math.min(1, Math.max(0, (header - box.getBoundingClientRect().top) / distance));
      const progress = Math.min(1, Math.max(0, (raw - .14) / .72));
      const eased = progress * progress * (3 - 2 * progress);
      box.style.setProperty("--chapter-progress", String(live ? eased : 0));
      marker.style.top = `${live ? distance : about.offsetHeight}px`;
      // A hidden panel must not take keyboard focus. Focusing a panel makes it fully visible.
      about.inert = live && progress > .98;
      technology.inert = live && progress < .02;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const apply = () => { box.classList.toggle("is-horizontal", desktop.matches); render(); };
    const focusPanel = (event: FocusEvent) => {
      if (!desktop.matches) return;
      const target = event.target as Node;
      const distance = box.offsetHeight - viewport.offsetHeight;
      const header = Number.parseFloat(getComputedStyle(box).getPropertyValue("--header-height")) || 0;
      const top = box.getBoundingClientRect().top + window.scrollY - header;
      if (technology.contains(target)) window.scrollTo({ top: top + distance, behavior: "instant" });
      else if (about.contains(target)) window.scrollTo({ top, behavior: "instant" });
    };
    apply();
    const resize = new ResizeObserver(schedule);
    resize.observe(about);
    resize.observe(viewport);
    window.addEventListener("scroll", schedule, { passive: true });
    desktop.addEventListener("change", apply);
    box.addEventListener("focusin", focusPanel);
    // Intro hydration changes the document height before a direct chapter anchor is resolved.
    anchorFrame = requestAnimationFrame(() => {
      anchorFrame = requestAnimationFrame(() => {
        const id = window.location.hash.slice(1);
        if (id === "about" || id === "technology") document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(anchorFrame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      desktop.removeEventListener("change", apply);
      box.removeEventListener("focusin", focusPanel);
      about.inert = false;
      technology.inert = false;
      box.classList.remove("is-horizontal");
    };
  }, []);

  return (
    <div ref={root} className="chapter-rail">
      <span id="about" className="chapter-anchor" />
      <span ref={anchor} id="technology" className="chapter-anchor chapter-anchor-next" />
      <div ref={stage} className="chapter-stage">
        <div className="chapter-track">
          <div ref={first} className="chapter-panel">{children}</div>
          <div ref={second} className="chapter-panel">{next}</div>
        </div>
      </div>
    </div>
  );
}
