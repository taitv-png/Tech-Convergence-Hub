"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Ordinary vertical scrolling drives just this pair of desktop chapters sideways.
// Anchors remain in the document flow, including with reduced motion or no script.
export function HorizontalChapters({ children, next, firstId = "about", nextId = "technology", direction = "left" }: {
  children: ReactNode;
  next: ReactNode;
  firstId?: string;
  nextId?: string;
  direction?: "left" | "right";
}) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const second = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = root.current;
    const viewport = stage.current;
    const firstPanel = first.current;
    const nextPanel = second.current;
    const marker = anchor.current;
    if (!box || !viewport || !firstPanel || !nextPanel || !marker) return;
    const desktop = window.matchMedia("(min-width: 1100px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let anchorFrame = 0;
    let displayed: number | null = null;
    let previousTime = 0;
    const render = (time: number) => {
      frame = 0;
      const live = desktop.matches;
      const distance = Math.max(1, box.offsetHeight - viewport.offsetHeight);
      const header = Number.parseFloat(getComputedStyle(box).getPropertyValue("--header-height")) || 0;
      const rect = box.getBoundingClientRect();
      const raw = Math.min(1, Math.max(0, (header - rect.top) / distance));
      const progress = Math.min(1, Math.max(0, (raw - .14) / .72));
      const eased = progress * progress * (3 - 2 * progress);
      // A short time-based settle softens wheel steps equally on 60 Hz and 120 Hz screens.
      // Outside the pinned range, snap to the target so no trailing panel is left behind.
      const delta = Math.min(64, previousTime ? time - previousTime : 16);
      previousTime = time;
      const pinned = live && rect.top <= header && rect.bottom >= window.innerHeight;
      displayed = !pinned || displayed === null ? eased : displayed + (eased - displayed) * (1 - Math.exp(-delta / 80));
      if (Math.abs(eased - displayed) < .0001) displayed = eased;
      box.style.setProperty("--chapter-progress", (live ? displayed : 0).toFixed(5));
      marker.style.top = `${live ? distance : firstPanel.offsetHeight}px`;
      // A hidden panel must not take keyboard focus. Focusing a panel makes it fully visible.
      firstPanel.inert = live && displayed > .98;
      nextPanel.inert = live && displayed < .02;
      if (pinned && displayed !== eased) frame = requestAnimationFrame(render);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const apply = () => {
      displayed = null;
      previousTime = 0;
      box.classList.toggle("is-horizontal", desktop.matches);
      schedule();
    };
    const focusPanel = (event: FocusEvent) => {
      if (!desktop.matches) return;
      const target = event.target as Node;
      const distance = box.offsetHeight - viewport.offsetHeight;
      const header = Number.parseFloat(getComputedStyle(box).getPropertyValue("--header-height")) || 0;
      const top = box.getBoundingClientRect().top + window.scrollY - header;
      displayed = null;
      if (nextPanel.contains(target)) window.scrollTo({ top: top + distance, behavior: "instant" });
      else if (firstPanel.contains(target)) window.scrollTo({ top, behavior: "instant" });
      schedule();
    };
    apply();
    const resize = new ResizeObserver(schedule);
    resize.observe(firstPanel);
    resize.observe(viewport);
    resize.observe(box);
    window.addEventListener("scroll", schedule, { passive: true });
    desktop.addEventListener("change", apply);
    box.addEventListener("focusin", focusPanel);
    // Intro hydration changes the document height before a direct chapter anchor is resolved.
    const initialAnchor = window.location.hash.slice(1);
    anchorFrame = requestAnimationFrame(() => {
      anchorFrame = requestAnimationFrame(() => {
        if (initialAnchor === firstId || initialAnchor === nextId) document.getElementById(initialAnchor)?.scrollIntoView({ block: "start", behavior: "instant" });
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(anchorFrame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      desktop.removeEventListener("change", apply);
      box.removeEventListener("focusin", focusPanel);
      firstPanel.inert = false;
      nextPanel.inert = false;
      box.classList.remove("is-horizontal");
    };
  }, [firstId, nextId]);

  return (
    <div ref={root} className={`chapter-rail chapter-towards-${direction}`} data-first-chapter={firstId}>
      <span id={firstId} className="chapter-anchor" />
      <span ref={anchor} id={nextId} className="chapter-anchor chapter-anchor-next" />
      <div ref={stage} className="chapter-stage">
        <div className="chapter-track">
          <div ref={first} className="chapter-panel">{children}</div>
          <div ref={second} className="chapter-panel">{next}</div>
        </div>
      </div>
    </div>
  );
}
